import React, { useState, useEffect, useRef } from "react";
import PropTypes, { func } from "prop-types";
import { isEmpty } from "lodash";
import Button from "antd/lib/button";
import Checkbox from "antd/lib/checkbox";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import DashboardGrid from "@/components/dashboards/DashboardGrid";
import Parameters from "@/components/Parameters";
import Filters from "@/components/Filters";
import { Dashboard } from "@/services/dashboard";
import recordEvent from "@/services/recordEvent";
import useDashboard from "./hooks/useDashboard";
import DashboardHeader from "./components/DashboardHeader";

import ToolCharts from "@/components/cold/ToolCharts";

import "./DashboardPage.less";

function DashboardSettings({ dashboardOptions }) {
  const { dashboard, updateDashboard } = dashboardOptions;
  return (
    //2020-9-10 修改使用仪表板级过滤宽度共3处添加style  位置：className="m-b-10 p-15 bg-white tiled"  style={{ width:"80%", backgroundColor:"#fff!important" }}
    <div className="m-b-10 p-15 bg-white tiled" style={{ width: "80%", backgroundColor: "#fff!important" }}>
      <Checkbox
        checked={!!dashboard.dashboard_filters_enabled}
        onChange={({ target }) => updateDashboard({ dashboard_filters_enabled: target.checked })}
        data-test="DashboardFiltersCheckbox">
        {__("Use Dashboard Level Filters")}
      </Checkbox>
    </div>
  );
}

DashboardSettings.propTypes = {
  dashboardOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function AddWidgetContainer({ dashboardOptions }) {
  const { showAddTextboxDialog, showAddWidgetDialog } = dashboardOptions;
  return (
    <div className="add-widget-container">
      <h2>
        <i className="zmdi zmdi-widgets" />
        <span className="hidden-xs hidden-sm">
          {__("Widgets are individual query visualizations or text boxes you can place on your dashboard in various arrangements.")}
        </span>
      </h2>
      <div>
        <Button className="m-r-15" onClick={showAddTextboxDialog} data-test="AddTextboxButton">
          {__("Add Textbox")}
        </Button>
        <Button type="primary" onClick={showAddWidgetDialog} data-test="AddWidgetButton">
          {__("Add Widget")}
        </Button>
      </div>
    </div>
  );
}

AddWidgetContainer.propTypes = {
  dashboardOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};



function DashboardComponent(props) {

  const dashboardOptions = useDashboard(props.dashboard);
  const {
    dashboard,
    filters,
    setFilters,
    loadDashboard,
    loadWidget,
    removeWidget,
    saveDashboardLayout,
    globalParameters,
    refreshDashboard,
    refreshWidget,
    editingLayout,
    setGridDisabled,
  } = dashboardOptions;

  //const [WigetId, TestJson] = useState({ visId: 0 });


  //const FComp = () => {
  //  const childRef = useRef();
  //  const updateChildState = () => {
  //    childRef.current.changeVal(22);
  //  }
  //}

  //const childRef = useRef();
  //const updateChildState = () => {
  //  childRef.current.changeVal(22);
  //}

  const updateChildState = () => {
  }

  function getChildrenIdPid(a, b) {
    console.log(a, b);
    localStorage.setItem("visId", a);
    localStorage.setItem("widId", b);
  };

  function ParentsOnload(a, b) {
    console.log(a, b);
    //localStorage.setItem("RPvID", a);
    //localStorage.setItem("RPwID", b);
    //updateChildState();
  }



  return (
    <>
      <DashboardHeader dashboardOptions={dashboardOptions} />
      {!isEmpty(globalParameters) && (
        <div className="dashboard-parameters m-b-10 p-15 bg-white tiled" style={{ width: "80%", backgroundColor: "#fff!important" }} data-test="DashboardParameters">
          <Parameters parameters={globalParameters} onValuesChange={refreshDashboard} />
        </div>
      )}
      {!isEmpty(filters) && (
        <div className="m-b-10 p-15 bg-white tiled" style={{ width: "80%", backgroundColor: "#fff!important" }} data-test="DashboardFilters">
          <Filters filters={filters} onChange={setFilters} />
        </div>
      )}
      {editingLayout && <DashboardSettings dashboardOptions={dashboardOptions} />}
      <div id="dashboard-container">
        <DashboardGrid
          dashboard={dashboard}
          widgets={dashboard.widgets}
          filters={filters}
          isEditing={editingLayout}
          onLayoutChange={editingLayout ? saveDashboardLayout : () => { }}
          onBreakpointChange={setGridDisabled}
          onLoadWidget={loadWidget}
          onRefreshWidget={refreshWidget}
          onRemoveWidget={removeWidget}
          onParameterMappingsChange={loadDashboard}
          getChildrenIdPid={getChildrenIdPid}
        />
      </div>
      <ToolCharts ParentsOnload={ParentsOnload} />


      {editingLayout && <AddWidgetContainer dashboardOptions={dashboardOptions} />}
    </>
  );
}

//function receiveChild(visId, widId) {
//  console.log(visId, widId, "第三次");
//}

DashboardComponent.propTypes = {
  dashboard: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function DashboardPage({ dashboardSlug, onError }) {
  const [dashboard, setDashboard] = useState(null);
  const onErrorRef = useRef();
  onErrorRef.current = onError;

  useEffect(() => {
    Dashboard.get({ slug: dashboardSlug })
      .then(dashboardData => {
        recordEvent("view", "dashboard", dashboardData.id);
        setDashboard(dashboardData);
      })
      .catch(error => onErrorRef.current(error));
  }, [dashboardSlug]);

  return (
    <div className="dashboard-page">
      <div className="container">{dashboard && <DashboardComponent dashboard={dashboard} />}</div>
    </div>
  );
}

DashboardPage.propTypes = {
  dashboardSlug: PropTypes.string.isRequired,
  onError: PropTypes.func,
};

DashboardPage.defaultProps = {
  onError: PropTypes.func,
};

export default routeWithUserSession({
  path: "/dashboard/:dashboardSlug",
  render: pageProps => <DashboardPage {...pageProps} />,
});
