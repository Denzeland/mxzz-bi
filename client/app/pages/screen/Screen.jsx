import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { PageHeader, Row, Col, Card, Typography, List, Icon, Dropdown, Tabs, Empty } from 'antd';
import NewScreenDialog from './NewScreenDialog';
import location from "@/services/location";
import './Screen.less';

function Screen(props) {
    console.log('编辑大屏查询search', location.search);
    const search = location.search;
    const dropdownListData = [
        {
            name: '基础',
            icon: <Icon type="bar-chart" />,
            data: [
                {
                    imgSrc: '/static/images/line_chart.png',
                    name: '折线图'
                },
                {
                    imgSrc: '/static/images/bar_chart.png',
                    name: '柱状图'
                },
                {
                    imgSrc: '/static/images/pie_chart.png',
                    name: '饼图',
                },
                {
                    imgSrc: '/static/images/scatter_plot.png',
                    name: '散点图',
                },
                {
                    imgSrc: '/static/images/bubble_chart.png',
                    name: '气泡图',
                },
            ]
        },
        {
            name: '科学',
            icon: <i class="fa fa-flask" aria-hidden="true"></i>,
            data: [
                {
                    imgSrc: '/static/images/heat_map.png',
                    name: '热力图'
                },
                {
                    imgSrc: '/static/images/relate.png',
                    name: '关系图'
                },
                {
                    imgSrc: '/static/images/themeRiver.png',
                    name: '河流图'
                },
                {
                    imgSrc: '/static/images/radar.png',
                    name: '雷达图'
                },
                {
                    imgSrc: '/static/images/tree_chart.png',
                    name: '树图'
                },
                {
                    imgSrc: '/static/images/treemap.png',
                    name: '矩形树图'
                },
                {
                    imgSrc: '/static/images/sunburst.png',
                    name: '旭日图'
                },
                {
                    imgSrc: '/static/images/sankey.png',
                    name: '桑基图'
                },
            ]
        },
        {
            name: '金融',
            icon: <Icon type="box-plot" />,
            data: [
                {
                    imgSrc: '/static/images/candlestick.png',
                    name: 'K 线图'
                },
                {
                    imgSrc: '/static/images/boxplot.png',
                    name: '盒须图'
                },
                {
                    imgSrc: '/static/images/funnel.png',
                    name: '漏斗图'
                },
                {
                    imgSrc: '/static/images/gauge.png',
                    name: '仪表盘'
                },
            ]
        },
        {
            name: '地图',
            icon: <i class="fa fa-globe" aria-hidden="true"></i>,
            data: [
                {
                    imgSrc: '/static/images/map_chart.png',
                    name: '地图'
                },
                {
                    imgSrc: '/static/images/route_map.png',
                    name: '路径图'
                },
            ]
        },
        {
            name: '3D',
            icon: <i class="fa fa-cubes" aria-hidden="true"></i>,
            data: []
        }
    ];
    const dropdownListComponent = dropdownListData.map((dropdown) => {
        const dropdownList = dropdown.data.length > 0 ? <div className="edit-dropdown"><List
            size="small"
            grid={{ gutter: 16, column: dropdown.data.length >= 3 ? 3 : dropdown.data.length }}
            dataSource={dropdown.data}
            renderItem={item => (
                <List.Item>
                    <Card hoverable><img src={item.imgSrc} className="chart-icon"></img><span className="chart-text">{item.name}</span></Card>
                </List.Item>
            )}
        />
        </div> : <div className="edit-dropdown"><Empty /></div>;
        return (
            <Dropdown placement="bottomCenter" overlay={dropdownList}>
                <li>
                    {dropdown.icon}
                    <span>{dropdown.name}</span>
                </li>
            </Dropdown>
        )
    });
    // const basicCharts, scientificCharts, financialCharts, mapCharts, threeDimensionalCharts;
    // const basicChartsDropdown = <div className="edit-dropdown"><List
    //     size="small"
    //     grid={{ gutter: 16, column: 3 }}
    //     dataSource={basicCharts}
    //     renderItem={item => (
    //         <List.Item>
    //             <Card hoverable><img src="/static/images/line_chart.png" className="chart-icon"></img><span className="chart-text">折线图</span></Card>
    //         </List.Item>
    //     )}
    // />
    // </div>;
    return (
        <PageHeader
            // ghost={false}
            className="screen-page-header"
            onBack={() => null}
            title={<Typography.Title level={3}>{search.title}</Typography.Title>}
            subTitle={search.description}
            extra={
                <React.Fragment>
                    <ul className="screen-edit-btn-wrap">
                        {dropdownListComponent}
                        <li>
                            <Icon type="table" />
                            <span>表格</span>
                        </li>
                        <li>
                            <i class="fa fa-text-width" aria-hidden="true"></i>
                            <span>文字</span>
                        </li>
                    </ul>
                    <ul className="screen-edit-extra">
                        <li>
                            <Icon type="fullscreen" />
                            <span>预览</span>
                        </li>
                        <li>
                            <Icon type="save" />
                            <span>保存</span>
                        </li>
                    </ul>
                </React.Fragment>}
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