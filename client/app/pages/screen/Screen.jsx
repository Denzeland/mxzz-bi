import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { PageHeader, Row, Col, Card, Typography, List, Icon, Dropdown, Tabs, Empty } from 'antd';
import NewScreenDialog from './NewScreenDialog';
import location from "@/services/location";
import './Screen.less';

function Screen(props) {
    console.log('编辑大屏查询search', location.search);
    const search = location.search;
    const data = [
        {
            title: 'Title 1',
        },
        {
            title: 'Title 2',
        },
        {
            title: 'Title 3',
        },
        {
            title: 'Title 4',
        },
    ];
    const dropdownList = <div><List
        size="small"
        grid={{ gutter: 16, column: 4 }}
        dataSource={data}
        renderItem={item => (
            <List.Item>
                <Card hoverable>Card content</Card>
            </List.Item>
        )}
    />
    </div>;
    return (
        <PageHeader
            // ghost={false}
            className="screen-page-header"
            onBack={() => null}
            title={<Typography.Title level={3}>{search.title}</Typography.Title>}
            subTitle={search.description}
            extra={
                <ul className="screen-edit-btn-wrap">
                    <Dropdown placement="bottomCenter" overlay={dropdownList}>
                        <li className="screen-edit-btn">
                            <Icon type="bar-chart" />
                            <span>图表</span>
                        </li>
                    </Dropdown>
                    <Dropdown placement="bottomCenter" overlay={dropdownList}>
                        <li className="screen-edit-btn">
                            <Icon type="table" />
                            <span>表格</span>
                        </li>
                    </Dropdown>
                    <Dropdown placement="bottomCenter" overlay={dropdownList}>
                        <li className="screen-edit-btn">
                            <Icon type="bar-chart" />
                            <span>指标</span>
                        </li>
                    </Dropdown>
                    <Dropdown placement="bottomCenter" overlay={dropdownList}>
                        <li className="screen-edit-btn">
                            <Icon type="bar-chart" />
                            <span>地图</span>
                        </li>
                    </Dropdown>
                    <Dropdown placement="bottomCenter" overlay={dropdownList}>
                        <li className="screen-edit-btn">
                            <Icon type="bar-chart" />
                            <span>文字</span>
                        </li>
                    </Dropdown>
                </ul>}
        ></PageHeader>
        // <Typography.Title level={2}>大屏编辑界面</Typography.Title>
    )
}

export default routeWithUserSession({
    path: "/screen",
    title: '编辑大屏',
    render: pageProps => <Screen {...pageProps} />,
    bodyClass: "screen",
});