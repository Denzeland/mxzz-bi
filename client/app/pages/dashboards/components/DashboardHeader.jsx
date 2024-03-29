﻿import React, { useState } from "react";
import cx from "classnames";
import PropTypes, { func } from "prop-types";
import { map, includes, functions } from "lodash";
import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";
import Icon from "antd/lib/icon";
import Modal from "antd/lib/modal";
import Tooltip from "antd/lib/tooltip";
import FavoritesControl from "@/components/FavoritesControl";
import EditInPlace from "@/components/EditInPlace";
import { DashboardTagsControl } from "@/components/tags-control/TagsControl";
import getTags from "@/services/getTags";
import { clientConfig } from "@/services/auth";
import { policy } from "@/services/policy";
import { durationHumanize } from "@/lib/utils";
import { DashboardStatusEnum } from "../hooks/useDashboard";
import cs from "classnames";

import "./DashboardHeader.less";




function getDashboardTags() {
  return getTags("api/dashboards/tags").then(tags => map(tags, t => t.name));
}

function buttonType(value) {
  return value ? "primary" : "default";
}

function DashboardPageTitle({ dashboardOptions }) {
  const { dashboard, canEditDashboard, updateDashboard, editingLayout } = dashboardOptions;
  return (
    <div className="title-with-tags">
      <div className="page-title">
        <FavoritesControl item={dashboard} />
        <h3>
          <EditInPlace
            isEditable={editingLayout}
            onDone={name => updateDashboard({ name })}
            value={dashboard.name}
            ignoreBlanks
          />
        </h3>
        <Tooltip title={dashboard.user.name} placement="bottom">
          <img src={dashboard.user.profile_image_url} className="profile-image" alt={dashboard.user.name} />
        </Tooltip>
      </div>
      <DashboardTagsControl
        tags={dashboard.tags}
        isDraft={dashboard.is_draft}
        isArchived={dashboard.is_archived}
        canEdit={canEditDashboard}
        getAvailableTags={getDashboardTags}
        onEdit={tags => updateDashboard({ tags })}
      />
    </div>
  );
}

DashboardPageTitle.propTypes = {
  dashboardOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function RefreshButton({ dashboardOptions }) {
  const { refreshRate, setRefreshRate, disableRefreshRate, refreshing, refreshDashboard } = dashboardOptions;
  const allowedIntervals = policy.getDashboardRefreshIntervals();
  const refreshRateOptions = clientConfig.dashboardRefreshIntervals;
  const onRefreshRateSelected = ({ key }) => {
    const parsedRefreshRate = parseFloat(key);
    if (parsedRefreshRate) {
      setRefreshRate(parsedRefreshRate);
      refreshDashboard();
    } else {
      disableRefreshRate();
    }
  };
  return (
    <Button.Group>
      <Tooltip title={refreshRate ? `Auto Refreshing every ${durationHumanize(refreshRate)}` : null}>
        <Button type={buttonType(refreshRate)} onClick={() => refreshDashboard()}>
          <i className={cx("zmdi zmdi-refresh m-r-5", { "zmdi-hc-spin": refreshing })} />
          {refreshRate ? durationHumanize(refreshRate) : __("Refresh")}
        </Button>
      </Tooltip>
      <Dropdown
        trigger={["click"]}
        placement="bottomRight"
        overlay={
          <Menu onClick={onRefreshRateSelected} selectedKeys={[`${refreshRate}`]}>
            {refreshRateOptions.map(option => (
              <Menu.Item key={`${option}`} disabled={!includes(allowedIntervals, option)}>
                {durationHumanize(option)}
              </Menu.Item>
            ))}
            {refreshRate && <Menu.Item key={null}>{__("Disable auto refresh")}</Menu.Item>}
          </Menu>
        }>
        <Button className="icon-button hidden-xs" type={buttonType(refreshRate)}>
          <i className="fa fa-angle-down" />
          <span className="sr-only">{__("Split button!")}</span>
        </Button>
      </Dropdown>
    </Button.Group>
  );
}

RefreshButton.propTypes = {
  dashboardOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function DashboardMoreOptionsButton({ dashboardOptions }) {
  const {
    dashboard,
    setEditingLayout,
    togglePublished,
    archiveDashboard,
    managePermissions,
    gridDisabled,
    isDashboardOwnerOrAdmin,
  } = dashboardOptions;

  const archive = () => {
    Modal.confirm({
      title: __("Archive Dashboard"),
      //content: `Are you sure you want to archive the "${dashboard.name}" dashboard?`,
      content: __("Are you sure you want to archive the '") + dashboard.name + __("'dashboard?"),
      okText: __("Archive"),
      okType: "danger",
      onOk: archiveDashboard,
      maskClosable: true,
      autoFocusButton: null,
    });
  };

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      overlay={
        <Menu data-test="DashboardMoreButtonMenu">
          <Menu.Item className={cx({ hidden: gridDisabled })}>
            <a onClick={() => setEditingLayout(true)}>{__("Edit")}</a>
          </Menu.Item>
          {clientConfig.showPermissionsControl && isDashboardOwnerOrAdmin && (
            <Menu.Item>
              <a onClick={managePermissions}>{__("Manage Permissions")}</a>
            </Menu.Item>
          )}
          {!dashboard.is_draft && (
            <Menu.Item>
              <a onClick={togglePublished}>{__("Unpublish")}</a>
            </Menu.Item>
          )}
          <Menu.Item>
            <a onClick={archive}>{__("Archive")}</a>
          </Menu.Item>
        </Menu>
      }>
      <Button className="icon-button m-l-5" data-test="DashboardMoreButton">
        <Icon type="ellipsis" rotate={90} />
      </Button>
    </Dropdown>
  );
}

DashboardMoreOptionsButton.propTypes = {
  dashboardOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function DashboardControl({ dashboardOptions }) {
  const {
    dashboard,
    togglePublished,
    canEditDashboard,
    fullscreen,
    toggleFullscreen,
    showShareDashboardDialog,
  } = dashboardOptions;
  const showPublishButton = dashboard.is_draft;
  const showRefreshButton = true;
  const showFullscreenButton = !dashboard.is_draft;
  const showShareButton = dashboard.publicAccessEnabled || (canEditDashboard && !dashboard.is_draft);
  const showMoreOptionsButton = canEditDashboard;

  function ChangeColors() {

    var obj = document.getElementsByClassName("dashboard-page");
  }

  return (
    <div className="dashboard-control">
      {!dashboard.is_archived && (
        <span className="hidden-print">
          {showPublishButton && (
            <Button className="m-r-5 hidden-xs" onClick={togglePublished}>
              <span className="fa fa-paper-plane m-r-5" /> {__("Publish")}
            </Button>
          )}
          {showRefreshButton && <RefreshButton dashboardOptions={dashboardOptions} />}
          {showFullscreenButton && (
            <Tooltip className="hidden-xs" title={__("Enable/Disable Fullscreen display")}>
              <Button type={buttonType(fullscreen)} className="icon-button m-l-5" onClick={toggleFullscreen}>
                <i className="zmdi zmdi-fullscreen" />
              </Button>
            </Tooltip>
          )}
          {showShareButton && (
            <Tooltip title={__("Dashboard Sharing Options")}>
              <Button
                className="icon-button m-l-5"
                type={buttonType(dashboard.publicAccessEnabled)}
                onClick={showShareDashboardDialog}
                data-test="OpenShareForm">
                <i className="zmdi zmdi-share" />
              </Button>
            </Tooltip>
          )}
          {showMoreOptionsButton && <DashboardMoreOptionsButton dashboardOptions={dashboardOptions} />}
        </span>
      )}
    </div>
  );
}

DashboardControl.propTypes = {
  dashboardOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function DashboardEditControl({ dashboardOptions }) {
  const { setEditingLayout, doneBtnClickedWhileSaving, dashboardStatus, retrySaveDashboardLayout } = dashboardOptions;
  let status;
  if (dashboardStatus === DashboardStatusEnum.SAVED) {
    status = <span className="save-status">{__("Saved")}</span>;
  } else if (dashboardStatus === DashboardStatusEnum.SAVING) {
    status = (
      <span className="save-status" data-saving>
        {__("Saving")}
      </span>
    );
  } else {
    status = (
      <span className="save-status" data-error>
        {__("Saving Failed")}
      </span>
    );
  }
  return (
    <div className="dashboard-control">
      {status}
      {dashboardStatus === DashboardStatusEnum.SAVING_FAILED ? (
        <Button type="primary" onClick={retrySaveDashboardLayout}>
          {__("Retry")}
        </Button>
      ) : (
          <Button loading={doneBtnClickedWhileSaving} type="primary" onClick={() => setEditingLayout(false)}>
            {!doneBtnClickedWhileSaving && <i className="fa fa-check m-r-5" />} {__("Done Editing")}
          </Button>
        )}
    </div>
  );
}

DashboardEditControl.propTypes = {
  dashboardOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default function DashboardHeader({ dashboardOptions }) {
  const { editingLayout } = dashboardOptions;
  const DashboardControlComponent = editingLayout ? DashboardEditControl : DashboardControl;

  return (
    <div className="dashboard-header">
      <DashboardPageTitle dashboardOptions={dashboardOptions} />
      <DashboardControlComponent dashboardOptions={dashboardOptions} />
    </div>
  );
}

DashboardHeader.propTypes = {
  dashboardOptions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};


