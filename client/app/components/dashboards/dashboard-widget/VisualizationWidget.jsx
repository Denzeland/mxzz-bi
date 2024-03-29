﻿import React, { useState } from "react";
import PropTypes, { func } from "prop-types";
import { compact, isEmpty, invoke } from "lodash";
import { markdown } from "markdown";
import cx from "classnames";
import Menu from "antd/lib/menu";
import HtmlContent from "@redash/viz/lib/components/HtmlContent";
import { currentUser } from "@/services/auth";
import recordEvent from "@/services/recordEvent";
import { formatDateTime } from "@/lib/utils";
import Parameters from "@/components/Parameters";
import TimeAgo from "@/components/TimeAgo";
import Timer from "@/components/Timer";
import { Moment } from "@/components/proptypes";
import QueryLink from "@/components/QueryLink";
import { FiltersType } from "@/components/Filters";
import ExpandedWidgetDialog from "@/components/dashboards/ExpandedWidgetDialog";
import EditParameterMappingsDialog from "@/components/dashboards/EditParameterMappingsDialog";
import VisualizationRenderer from "@/components/visualizations/VisualizationRenderer";
import Widget from "./Widget";
import { axios } from "@/services/axios";
import { local } from "d3";
import { log } from "debug";



function visualizationWidgetMenuOptions({ widget, canEditDashboard, onParametersEdit, onLook }) {
  const canViewQuery = currentUser.hasPermission("view_query");
  const canEditParameters = canEditDashboard && !isEmpty(invoke(widget, "query.getParametersDefs"));
  const widgetQueryResult = widget.getQueryResult();
  const isQueryResultEmpty = !widgetQueryResult || !widgetQueryResult.isEmpty || widgetQueryResult.isEmpty();

  const downloadLink = fileType => widgetQueryResult.getLink(widget.getQuery().id, fileType);
  const downloadName = fileType => widgetQueryResult.getName(widget.getQuery().name, fileType);

  return compact([
    <Menu.Item key="download_csv" disabled={isQueryResultEmpty}>
      {!isQueryResultEmpty ? (
        <a href={downloadLink("csv")} download={downloadName("csv")} target="_self">
          {__("Download as CSV File")}
        </a>
      ) : (
          __("Download as CSV File")
        )}
    </Menu.Item>,
    <Menu.Item key="download_tsv" disabled={isQueryResultEmpty}>
      {!isQueryResultEmpty ? (
        <a href={downloadLink("tsv")} download={downloadName("tsv")} target="_self">
          {__("Download as TSV File")}
        </a>
      ) : (
          __("Download as TSV File")
        )}
    </Menu.Item>,
    <Menu.Item key="download_excel" disabled={isQueryResultEmpty}>
      {!isQueryResultEmpty ? (
        <a href={downloadLink("xlsx")} download={downloadName("xlsx")} target="_self">
          {__("Download as Excel File")}
        </a>
      ) : (
          __("Download as Excel File")
        )}
    </Menu.Item>,
    (canViewQuery || canEditParameters) && <Menu.Divider key="divider" />,
    canViewQuery && (
      <Menu.Item key="view_query">
        <a href={widget.getQuery().getUrl(true, widget.visualization.id)}>{__("View Query")}</a>
      </Menu.Item>
    ),
    //<Menu.Item key="view_property" onClick={() => PropertyGet(widget.visualization.id, widget.id)}>
    //  查看属性
    //</Menu.Item>,
    //onClick = {() => onLook(widget.visualization.id, widget.id)}
    <Menu.Item key="view_property" onClick={onLook.bind(this, widget.visualization.id, widget.id)}>
      查看属性
    </Menu.Item>,
    canEditParameters && (
      <Menu.Item key="edit_parameters" onClick={onParametersEdit}>
        {__("Edit Parameters")}
      </Menu.Item>
    ),
    //<Menu.Item key="view_property" onClick={() => PropertyGet(widget.visualization.id, widget.id)}>
    //  {/*<a href={widget.getQuery().getUrl(true, widget.visualization.id)}>查看属性</a>*/}
    //  查看属性
    //</Menu.Item>,
  ]);
}

//function PropertyGet(Pids, Wids) {
//  console.log(Wids);
//  if (Pids != "" && Pids != null && Pids != undefined) {
//    // select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 
//    //left join public.widgets t2 on t1.id = t2.visualization_id where t1.id = 7 and t2.id = 10
//    var sql = "select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 left join public.widgets t2 on t1.id = t2.visualization_id";
//    sql += " where t1.id = " + Pids + " and t2.id = " + Wids;
//    axios.get('/api/select?sql=' + sql).then(function (response) {
//      console.log(response.data);
//      switch (response.data[0]["t1.type"]) {
//        case "CHART":
//          console.log(response.data[0]["t1.options as VisualizationsJson"]);
//          console.log(response.data[0]["t2.options as WidgetJson"]);
//          break;
//        case "TABLE":
//          console.log(response.data[0]["t1.type"]);
//          break;
//        case "FUNNEL":
//          console.log(response.data[0]["t1.type"]);
//          break;
//        case "MAP":
//          console.log(response.data[0]["t1.type"]);
//          break;
//        default:
//          break;
//      }
//    }).catch(function (error) {
//      console.log(error);
//    });
//  }
//}

function RefreshIndicator({ refreshStartedAt }) {
  return (
    <div className="refresh-indicator">
      <div className="refresh-icon">
        <i className="zmdi zmdi-refresh zmdi-hc-spin" />
      </div>
      <Timer from={refreshStartedAt} />
    </div>
  );
}

RefreshIndicator.propTypes = { refreshStartedAt: Moment };
RefreshIndicator.defaultProps = { refreshStartedAt: null };

function VisualizationWidgetHeader({ widget, refreshStartedAt, parameters, onParametersUpdate }) {
  const canViewQuery = currentUser.hasPermission("view_query");

  return (
    <>
      <RefreshIndicator refreshStartedAt={refreshStartedAt} />
      <div className="t-header widget clearfix">
        <div className="th-title">
          <p>
            <QueryLink query={widget.getQuery()} visualization={widget.visualization} readOnly={!canViewQuery} />
          </p>
          {!isEmpty(widget.getQuery().description) && (
            <HtmlContent className="text-muted markdown query--description">
              {markdown.toHTML(widget.getQuery().description || "")}
            </HtmlContent>
          )}
        </div>
      </div>
      {!isEmpty(parameters) && (
        <div className="m-b-10">
          <Parameters parameters={parameters} onValuesChange={onParametersUpdate} />
        </div>
      )}
    </>
  );
}

VisualizationWidgetHeader.propTypes = {
  widget: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  refreshStartedAt: Moment,
  parameters: PropTypes.arrayOf(PropTypes.object),
  onParametersUpdate: PropTypes.func,
};

VisualizationWidgetHeader.defaultProps = {
  refreshStartedAt: null,
  onParametersUpdate: () => { },
  parameters: [],
};

function VisualizationWidgetFooter({ widget, isPublic, onRefresh, onExpand }) {
  const widgetQueryResult = widget.getQueryResult();
  const updatedAt = invoke(widgetQueryResult, "getUpdatedAt");
  const [refreshClickButtonId, setRefreshClickButtonId] = useState();

  const refreshWidget = buttonId => {
    if (!refreshClickButtonId) {
      setRefreshClickButtonId(buttonId);
      onRefresh().finally(() => setRefreshClickButtonId(null));
    }
  };

  return widgetQueryResult ? (
    <>
      <span>
        {!isPublic && !!widgetQueryResult && (
          <a
            className="refresh-button hidden-print btn btn-sm btn-default btn-transparent"
            onClick={() => refreshWidget(1)}
            data-test="RefreshButton">
            <i className={cx("zmdi zmdi-refresh", { "zmdi-hc-spin": refreshClickButtonId === 1 })} />{" "}
            <TimeAgo date={updatedAt} />
          </a>
        )}
        <span className="visible-print">
          <i className="zmdi zmdi-time-restore" /> {formatDateTime(updatedAt)}
        </span>
        {isPublic && (
          <span className="small hidden-print">
            <i className="zmdi zmdi-time-restore" /> <TimeAgo date={updatedAt} />
          </span>
        )}
      </span>
      <span>
        {!isPublic && (
          <a
            className="btn btn-sm btn-default hidden-print btn-transparent btn__refresh"
            onClick={() => refreshWidget(2)}>
            <i className={cx("zmdi zmdi-refresh", { "zmdi-hc-spin": refreshClickButtonId === 2 })} />
          </a>
        )}
        <a className="btn btn-sm btn-default hidden-print btn-transparent btn__refresh" onClick={onExpand}>
          <i className="zmdi zmdi-fullscreen" />
        </a>
      </span>
    </>
  ) : null;
}

VisualizationWidgetFooter.propTypes = {
  widget: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isPublic: PropTypes.bool,
  onRefresh: PropTypes.func.isRequired,
  onExpand: PropTypes.func.isRequired,
};

VisualizationWidgetFooter.defaultProps = { isPublic: false };


class VisualizationWidget extends React.Component {
  static propTypes = {
    widget: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    dashboard: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
    filters: FiltersType,
    isPublic: PropTypes.bool,
    isLoading: PropTypes.bool,
    canEdit: PropTypes.bool,
    onLoad: PropTypes.func,
    onRefresh: PropTypes.func,
    onDelete: PropTypes.func,
    onParameterMappingsChange: PropTypes.func,
    onLook: PropTypes.func,
  };


  static defaultProps = {
    filters: [],
    isPublic: false,
    isLoading: false,
    canEdit: false,
    onLoad: () => { },
    onRefresh: () => { },
    onDelete: () => { },
    onParameterMappingsChange: () => { },
    onLook: () => { },
  };

  constructor(props) {
    super(props);
    this.state = { localParameters: props.widget.getLocalParameters(), VisualizationsId: '', WidgetId: '' };
  }


  onLook = (visId, widId) => {
    console.log(visId, widId, "第一次");
    this.setState({ VisualizationsId: visId, WidgetId: widId });
    this.props.getData(visId, widId);
    //this.props.getData(this.state.VisualizationsId, this.state.WidgetId);
  };

  componentDidMount() {
    const { widget, onLoad } = this.props;
    recordEvent("view", "query", widget.visualization.query.id, { dashboard: true });
    recordEvent("view", "visualization", widget.visualization.id, { dashboard: true });
    onLoad();
  }

  expandWidget = () => {
    ExpandedWidgetDialog.showModal({ widget: this.props.widget });
  };

  editParameterMappings = () => {
    const { widget, dashboard, onRefresh, onParameterMappingsChange } = this.props;
    EditParameterMappingsDialog.showModal({
      dashboard,
      widget,
    }).onClose(valuesChanged => {
      // refresh widget if any parameter value has been updated
      if (valuesChanged) {
        onRefresh();
      }
      onParameterMappingsChange();
      this.setState({ localParameters: widget.getLocalParameters() });
    });
  };

  //onLook = () => {

  //var VisualizationsJson;
  //var WidgetJson;
  //if (Pids != "" && Pids != null && Pids != undefined) {
  //  // select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 
  //  //left join public.widgets t2 on t1.id = t2.visualization_id where t1.id = 7 and t2.id = 10
  //  var sql = "select t1.id,t1.type,t1.options as VisualizationsJson,t2.id,t2.options as WidgetJson from public.visualizations t1 left join public.widgets t2 on t1.id = t2.visualization_id";
  //  sql += " where t1.id = " + Pids + " and t2.id = " + Wids;
  //  axios.get('/api/select?sql=' + sql).then(function (response) {
  //    console.log(response.data);
  //    switch (response.data[0]["t1.type"]) {
  //      case "CHART":
  //        VisualizationsJson = response.data[0]["t1.options as VisualizationsJson"];
  //        WidgetJson = response.data[0]["t2.options as WidgetJson"];
  //        this.setState({ VisualizationsJson: VisualizationsJson, WidgetJson: WidgetJson }, () => { console.log(this.state.VisualizationsJson); });
  //        break;
  //      case "TABLE":
  //        console.log(response.data[0]["t1.type"]);
  //        break;
  //      case "FUNNEL":
  //        console.log(response.data[0]["t1.type"]);
  //        break;
  //      case "MAP":
  //        console.log(response.data[0]["t1.type"]);
  //        break;
  //      default:
  //        break;
  //    }
  //  }).catch(function (error) {
  //    console.log(error);
  //  });

  //  }
  //};

  renderVisualization() {
    const { widget, filters } = this.props;
    const widgetQueryResult = widget.getQueryResult();
    const widgetStatus = widgetQueryResult && widgetQueryResult.getStatus();
    switch (widgetStatus) {
      case "failed":
        return (
          <div className="body-row-auto scrollbox">
            {widgetQueryResult.getError() && (
              <div className="alert alert-danger m-5">
                {__("Error running query")}: <strong>{widgetQueryResult.getError()}</strong>
              </div>
            )}
          </div>
        );
      case "done":
        return (
          <div className="body-row-auto scrollbox">
            <VisualizationRenderer
              visualization={widget.visualization}
              queryResult={widgetQueryResult}
              filters={filters}
              context="widget"
            />
          </div>
        );
      default:
        return (
          <div className="body-row-auto spinner-container">
            <div className="spinner">
              <i className="zmdi zmdi-refresh zmdi-hc-spin zmdi-hc-5x" />
            </div>
          </div>
        );
    }
  }

  render() {
    const { widget, isLoading, isPublic, canEdit, onRefresh } = this.props;
    const { localParameters } = this.state;
    const widgetQueryResult = widget.getQueryResult();
    const isRefreshing = isLoading && !!(widgetQueryResult && widgetQueryResult.getStatus());

    return (
      <Widget
        {...this.props}
        className="widget-visualization"
        menuOptions={visualizationWidgetMenuOptions({
          widget,
          canEditDashboard: canEdit,
          onParametersEdit: this.editParameterMappings,
          onLook: this.onLook,
        })}
        header={
          <VisualizationWidgetHeader
            widget={widget}
            refreshStartedAt={isRefreshing ? widget.refreshStartedAt : null}
            parameters={localParameters}
            onParametersUpdate={onRefresh}
          />
        }
        footer={
          <VisualizationWidgetFooter
            widget={widget}
            isPublic={isPublic}
            onRefresh={onRefresh}
            onExpand={this.expandWidget}
          />
        }
        tileProps={{ "data-refreshing": isRefreshing }}>
        {this.renderVisualization()}
      </Widget>
    );
  }
}

export default VisualizationWidget;
