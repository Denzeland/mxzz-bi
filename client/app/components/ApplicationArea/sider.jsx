import React, { useCallback, useRef } from "react";
import { currentUser, Auth, clientConfig } from "@/services/auth";
import FavoritesDropdown from "./ApplicationHeader/FavoritesDropdown";
import { Layout, Menu, Icon, Button, Dropdown } from 'antd';
import { Query } from "@/services/query";
import { Dashboard } from "@/services/dashboard";
import CreateDashboardDialog from "@/components/dashboards/CreateDashboardDialog";

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function DesktopSider({ collapsed }) {
  const showCreateDashboardDialog = useCallback(() => {
    CreateDashboardDialog.showModal();
  }, []);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} data-platform="desktop" className="mxbi-aside">
      <a href="./" className="brand">
        <span className="brand-logo"><img src="/static/images/mxbi.png" alt="木星BI平台" /></span>
        <span className="brand-title" style={{ display: collapsed ? 'none' : 'block' }}>木星BI平台</span>
      </a>
      <Menu mode="inline" theme="dark">
        {currentUser.hasPermission("list_dashboards") && (
          <Menu.Item key="dashboards" className="dropdown-menu-item">
            <Icon type="dashboard" />
            <span>
              <a href="dashboards" className="side-href">{__("Dashboards")}</a>
              <FavoritesDropdown fetch={Dashboard.favorites} urlTemplate="dashboard/${slug}" />
            </span>
          </Menu.Item>
        )}
        {currentUser.hasPermission("view_query") && (
          <Menu.Item key="queries" className="dropdown-menu-item">
            <Icon type="search" />
            <span>
              <a href="queries" className="side-href">{__("Queries")}</a>
              <FavoritesDropdown fetch={Query.favorites} urlTemplate="queries/${id}" />
            </span>
          </Menu.Item>
        )}
        {currentUser.hasPermission("list_alerts") && (
          <Menu.Item key="alerts">
            <Icon type="alert" />
            <span><a href="alerts" className="side-href">{__("Alerts")}</a></span>
          </Menu.Item>
        )}
        {currentUser.canCreate() && (
          <SubMenu
            key="edit"
            title={
              <span>
                <Icon type="edit" />
                <span>{__("Create")}</span>
              </span>
            }
          >
            {currentUser.hasPermission("create_query") && (
              <Menu.Item key="new-query">
                <a href="queries/new">{__("New Query")}</a>
              </Menu.Item>
            )}
            {currentUser.hasPermission("create_dashboard") && (
              <Menu.Item key="new-dashboard">
                <a onMouseUp={showCreateDashboardDialog}>{__("New Dashboard")}</a>
              </Menu.Item>
            )}
            {currentUser.hasPermission("list_alerts") && (
              <Menu.Item key="new-alert">
                <a href="alerts/new">{__("New Alert")}</a>
              </Menu.Item>
            )}
          </SubMenu>
        )}
        {currentUser.hasPermission("view_query") && (
          <Menu.Item key="dataset" className="dropdown-menu-item">
            <Icon type="search" />
            <span>
              <a href="dataset/new" className="side-href">数据集</a>
            </span>
          </Menu.Item>
        )}
      </Menu>
    </Sider>
  )
}
