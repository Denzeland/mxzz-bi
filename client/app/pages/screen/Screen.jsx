import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { PageHeader, Row, Col, Card, Typography, List, Icon, Dropdown, Tabs, Empty } from 'antd';
import { isEmpty, reject, includes, intersection, isArray, capitalize, map, find, extend, join, cloneDeep, uniqueId, trim, compact, uniq } from "lodash";
import NewScreenDialog from './NewScreenDialog';
import location from "@/services/location";
import ReactEcharts from 'echarts-for-react';
import './Screen.less';
import { defaultChartsOptions } from './defaultChartsOptions';

function Screen(props) {
    console.log('编辑大屏查询search', location.search);
    const search = location.search;
    const reducer = (prevState, updatedProperty) => ([...updatedProperty]);
    const [screenCharts, setScreenCharts] = useReducer(reducer, []);
    const dropdownListData = [
        {
            name: '基础',
            icon: <Icon type="bar-chart" />,
            data: [
                {
                    imgSrc: '/static/images/line_chart.png',
                    name: '折线图',
                    type: 'line'
                },
                {
                    imgSrc: '/static/images/bar_chart.png',
                    name: '直方图',
                    type: 'bar'
                },
                {
                    imgSrc: '/static/images/pie_chart.png',
                    name: '饼图',
                    type: 'pie'
                },
                {
                    imgSrc: '/static/images/scatter_plot.png',
                    name: '散点图',
                    type: 'scatter'
                },
                {
                    imgSrc: '/static/images/bubble_chart.png',
                    name: '涟漪气泡图',
                    type: 'effectScatter'
                },
            ]
        },
        {
            name: '科学',
            icon: <i className="fa fa-flask" aria-hidden="true"></i>,
            data: [
                {
                    imgSrc: '/static/images/heat_map.png',
                    name: '热力图',
                    type: 'heatmap'
                },
                {
                    imgSrc: '/static/images/relate.png',
                    name: '关系图',
                    type: 'graph'
                },
                {
                    imgSrc: '/static/images/themeRiver.png',
                    name: '河流图',
                    type: 'themeRiver'
                },
                {
                    imgSrc: '/static/images/radar.png',
                    name: '雷达图',
                    type: 'radar'
                },
                {
                    imgSrc: '/static/images/tree_chart.png',
                    name: '树图',
                    type: 'tree'
                },
                {
                    imgSrc: '/static/images/treemap.png',
                    name: '矩形树图',
                    type: 'treemap'
                },
                {
                    imgSrc: '/static/images/sunburst.png',
                    name: '旭日图',
                    type: 'sunburst'
                },
                {
                    imgSrc: '/static/images/sankey.png',
                    name: '桑基图',
                    type: 'sankey'
                },
            ]
        },
        {
            name: '金融',
            icon: <Icon type="box-plot" />,
            data: [
                {
                    imgSrc: '/static/images/candlestick.png',
                    name: 'K 线图',
                    type: 'candlestick'
                },
                {
                    imgSrc: '/static/images/boxplot.png',
                    name: '盒须图',
                    type: 'boxplot'
                },
                {
                    imgSrc: '/static/images/funnel.png',
                    name: '漏斗图',
                    type: 'funnel'
                },
                {
                    imgSrc: '/static/images/gauge.png',
                    name: '仪表盘',
                    type: 'gauge'
                },
            ]
        },
        {
            name: '地图',
            icon: <i className="fa fa-globe" aria-hidden="true"></i>,
            data: [
                {
                    imgSrc: '/static/images/map_chart.png',
                    name: '地图',
                    type: 'map'
                },
                {
                    imgSrc: '/static/images/route_map.png',
                    name: '路径图',
                    type: 'lines'
                },
            ]
        },
        {
            name: '3D',
            icon: <i className="fa fa-cubes" aria-hidden="true"></i>,
            data: []
        }
    ];
    const dropdownItemClick = (item) => {
        const defaultOption = find(defaultChartsOptions, { type: item.type });
        if (defaultOption) {
            screenCharts.push(defaultOption.option);
            setScreenCharts(screenCharts);
        }
        console.log('dropdownItemClick', item, defaultOption, screenCharts);
    }
    const dropdownListComponent = dropdownListData.map((dropdown) => {
        const dropdownList = dropdown.data.length > 0 ? <div className="edit-dropdown"><List
            size="small"
            grid={{ gutter: 16, column: dropdown.data.length >= 3 ? 3 : dropdown.data.length }}
            dataSource={dropdown.data}
            renderItem={item => (
                <List.Item >
                    <Card hoverable onClick={(e) => { dropdownItemClick(item) }}><img src={item.imgSrc} className="chart-icon"></img><span className="chart-text">{item.name}</span></Card>
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


    return (
        <React.Fragment>
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
            <div className="screen-charts-content">
                <ReactEcharts
                    className='chart-widget-item'
                    option={screenCharts[0]}
                    style={{ height: '300px', width: '300px' }}
                />
                {screenCharts.length > 0 && screenCharts.map((option) => {
                    <ReactEcharts
                        className='chart-widget-item'
                        option={option}
                        style={{ height: '300px', width: '300px' }}
                    />
                })}
            </div>
        </React.Fragment>
    )
}

export default routeWithUserSession({
    path: "/screen",
    title: '编辑大屏',
    render: pageProps => <Screen {...pageProps} />,
    bodyClass: "screen",
});