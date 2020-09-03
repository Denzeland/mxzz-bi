/* eslint-disable no-template-curly-in-string */

import React, { useCallback, useRef } from "react";

import Dropdown from "antd/lib/dropdown";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import Menu from "antd/lib/menu";
import Input from "antd/lib/input";
import Tooltip from "antd/lib/tooltip";

import HelpTrigger from "@/components/HelpTrigger";
import CreateDashboardDialog from "@/components/dashboards/CreateDashboardDialog";
import navigateTo from "@/components/ApplicationArea/navigateTo";

import { currentUser, Auth, clientConfig } from "@/services/auth";
import { Dashboard } from "@/services/dashboard";
import { Query } from "@/services/query";
import frontendVersion from "@/version.json";
// import logoUrl from "@/assets/images/redash_icon_small.png";
import logoUrl from "@/assets/images/mxbi.png";

import FavoritesDropdown from "./FavoritesDropdown";
import "./index.less";
import { Layout, Typography } from 'antd';
const { Header } = Layout;

function onSearch(q) {
  navigateTo(`queries?q=${encodeURIComponent(q)}`);
}

function DesktopNavbar({ siderCollapsed, toggleCollapsed }) {
  // const showCreateDashboardDialog = useCallback(() => {
  //   CreateDashboardDialog.showModal();
  // }, []);

  return (
    // <div className="app-header" data-platform="desktop">
    <div className="app-header" data-platform="desktop">
      <Button onClick={toggleCollapsed} className="toggleCollapsed-btn">
        <Icon
          className="trigger"
          type={siderCollapsed ? 'menu-unfold' : 'menu-fold'}
        />
      </Button>
      {/* <div className="header-logo">
        <a href="./" className="brand-logo">
          <img src={logoUrl} alt="Redash" />
        </a>
      </div> */}
      <Typography.Title level={2} className="site-title">木星商业智能分析平台</Typography.Title>
      <div className="divborder">
        <Input.Search
          className="searchbar"
          placeholder={__("Search queries...")}
          data-test="AppHeaderSearch"
          onSearch={onSearch}
        />
        <Menu mode="horizontal" selectable={false}>
          <Menu.Item key="help">
            <HelpTrigger type="HOME" className="menu-item-button" />
          </Menu.Item>
          {currentUser.isAdmin && (
            <Menu.Item key="settings">
              <Tooltip title={__("Settings")}>
                <Button href="data_sources" className="menu-item-button">
                  <i className="fa fa-sliders" />
                </Button>
              </Tooltip>
            </Menu.Item>
          )}
          <Menu.Item key="profile">
            <Dropdown
              overlayStyle={{ minWidth: 200 }}
              placement="bottomRight"
              trigger={["click"]}
              overlay={
                <Menu>
                  <Menu.Item key="profile">
                    <a href="users/me">{__("Edit Profile")}</a>
                  </Menu.Item>
                  {currentUser.hasPermission("super_admin") && <Menu.Divider />}
                  {currentUser.isAdmin && (
                    <Menu.Item key="datasources">
                      <a href="data_sources">{__("Data Sources")}</a>
                    </Menu.Item>
                  )}
                  {currentUser.hasPermission("list_users") && (
                    <Menu.Item key="groups">
                      <a href="groups">{__("Groups")}</a>
                    </Menu.Item>
                  )}
                  {currentUser.hasPermission("list_users") && (
                    <Menu.Item key="users">
                      <a href="users">{__("Users")}</a>
                    </Menu.Item>
                  )}
                  {currentUser.hasPermission("create_query") && (
                    <Menu.Item key="snippets">
                      <a href="query_snippets">{__("Query Snippets")}</a>
                    </Menu.Item>
                  )}
                  {currentUser.isAdmin && (
                    <Menu.Item key="destinations">
                      <a href="destinations">{__("Alert Destinations")}</a>
                    </Menu.Item>
                  )}
                  {currentUser.hasPermission("super_admin") && <Menu.Divider />}
                  {currentUser.hasPermission("super_admin") && (
                    <Menu.Item key="status">
                      <a href="admin/status">{__("System Status")}</a>
                    </Menu.Item>
                  )}
                  <Menu.Divider />
                  <Menu.Item key="logout" onClick={() => Auth.logout()}>
                    {__("Log out")}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item key="version" disabled>
                    {__("Version")}: {clientConfig.version}
                    {frontendVersion !== clientConfig.version && ` (${frontendVersion.substring(0, 8)})`}
                    {clientConfig.newVersionAvailable && currentUser.hasPermission("super_admin") && (
                      <Tooltip title="Update Available" placement="rightTop">
                        {" "}
                        {/* eslint-disable react/jsx-no-target-blank */}
                        <a
                          href="https://version.redash.io/"
                          className="update-available"
                          target="_blank"
                          rel="noopener">
                          <i className="fa fa-arrow-circle-down" />
                        </a>
                      </Tooltip>
                    )}
                  </Menu.Item>
                </Menu>
              }>
              <Button data-test="ProfileDropdown" className="profile-dropdown">
                <img src={currentUser.profile_image_url} alt={currentUser.name} />
                {/* <img src={'https://mxbiavatar.herokuapp.com/' + currentUser.name} alt={currentUser.name} /> */}
                <span>{currentUser.name}</span>
                <Icon type="down" />
              </Button>
            </Dropdown>
          </Menu.Item>
        </Menu>
      </div>
    </div>
    // </div>
  );
}

function MobileNavbar() {
  const ref = useRef();

  return (
    <div className="app-header" data-platform="mobile" ref={ref}>
      <div className="header-logo">
        <a href="./">
          <img src={logoUrl} alt="Redash" />
        </a>
      </div>
      <div>
        <Dropdown
          overlayStyle={{ minWidth: 200 }}
          trigger={["click"]}
          getPopupContainer={() => ref.current} // so the overlay menu stays with the fixed header when page scrolls
          overlay={
            <Menu mode="vertical" selectable={false}>
              {currentUser.hasPermission("list_dashboards") && (
                <Menu.Item key="dashboards">
                  <a href="dashboards">{__("Dashboards")}</a>
                </Menu.Item>
              )}
              {currentUser.hasPermission("view_query") && (
                <Menu.Item key="queries">
                  <a href="queries">{__("Queries")}</a>
                </Menu.Item>
              )}
              {currentUser.hasPermission("list_alerts") && (
                <Menu.Item key="alerts">
                  <a href="alerts">{__("Alerts")}</a>
                </Menu.Item>
              )}
              <Menu.Item key="profile">
                <a href="users/me">{__("Edit Profile")}</a>
              </Menu.Item>
              <Menu.Divider />
              {currentUser.isAdmin && (
                <Menu.Item key="settings">
                  <a href="data_sources">{__("Settings")}</a>
                </Menu.Item>
              )}
              {currentUser.hasPermission("super_admin") && (
                <Menu.Item key="status">
                  <a href="admin/status">{__("System Status")}</a>
                </Menu.Item>
              )}
              {currentUser.hasPermission("super_admin") && <Menu.Divider />}
              <Menu.Item key="help">
                {/* eslint-disable-next-line react/jsx-no-target-blank */}
                <a href="https://redash.io/help" target="_blank" rel="noopener">
                  Help
                </a>
              </Menu.Item>
              <Menu.Item key="logout" onClick={() => Auth.logout()}>
                {__("Log out")}
              </Menu.Item>
            </Menu>
          }>
          <Button>
            <Icon type="menu" />
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}

export default function ApplicationHeader({ siderCollapsed, toggleCollapsed }) {
  return (
    <Header className="mxbi-header" style={{paddingLeft: siderCollapsed? '95px': '215px'}}>
      <nav className="app-header-wrapper">
        <DesktopNavbar siderCollapsed={siderCollapsed} toggleCollapsed={toggleCollapsed} />
        <MobileNavbar />
      </nav>
    </Header>
  );
}
