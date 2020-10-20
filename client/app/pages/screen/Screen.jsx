import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { PageHeader, Row, Col, Card, Typography, List, Icon, Dropdown, Tabs, Empty } from 'antd';
import { max, sum, isNumber, isString, endsWith, throttle, map, find, toNumber, range, cloneDeep, uniqueId, trim, compact, uniq } from "lodash";
import NewScreenDialog from './NewScreenDialog';
import location from "@/services/location";
import ReactEcharts from 'echarts-for-react';
import './Screen.less';
import { Rnd } from 'react-rnd';
import { defaultChartsOptions } from './defaultChartsOptions';
import moment from "moment";

function Screen(props) {
    // console.log('编辑大屏查询search', location.search);
    const search = location.search;
    const reducer = (prevState, updatedProperty) => ([...updatedProperty]);
    const sizeReducer = (prevState, updatedProperty) => ({ ...prevState, ...updatedProperty });
    const [activeChartIndex, setActiveChartIndex] = useState(null);
    /**
     * screenCharts = [{
     *  id: uniqueId(),
     *  echartOption: option,
     *  zIndex: zIndex,
     *  widgetSize: { width, height },
     *  widgetPosition: { x, y }
    }]
     */
    const [screenSize, setScreenSize] = useReducer(sizeReducer, { width: 'auto', height: 'auto' });
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
            screenCharts.push({
                id: moment().unix(),
                zIndex: screenCharts.length,
                echartOption: defaultOption.option,
                widgetSize: { width: 480, height: 270 },
                widgetPosition: { x: 10, y: 0 }
            });
            setScreenCharts(cloneDeep(screenCharts));
            // setScreenCharts(screenCharts);
        }
        console.log('dropdownItemClick', item, defaultOption, screenCharts);
    }
    const dropdownListComponent = dropdownListData.map((dropdown, index) => {
        const dropdownList = dropdown.data.length > 0 ? <div className="edit-dropdown" key={index}><List
            size="small"
            grid={{ gutter: 16, column: dropdown.data.length >= 3 ? 3 : dropdown.data.length }}
            dataSource={dropdown.data}
            renderItem={item => (
                <List.Item key={item.type}>
                    <Card hoverable onClick={(e) => { dropdownItemClick(item) }}><img src={item.imgSrc} className="chart-icon"></img><span className="chart-text">{item.name}</span></Card>
                </List.Item>
            )}
        />
        </div> : <div className="edit-dropdown"><Empty /></div>;
        return (
            <Dropdown placement="bottomCenter" overlay={dropdownList} key={index}>
                <li>
                    {dropdown.icon}
                    <span>{dropdown.name}</span>
                </li>
            </Dropdown>
        )
    });

    const widgetResize = throttle((id, refToElement, position) => {
        const widgetSize = { width: refToElement.style.width, height: refToElement.style.height };
        const widgetPosition = { x: position.x, y: position.y };
        const widgetOption = find(screenCharts, { id: id });
        widgetOption.widgetSize = widgetSize;
        widgetOption.widgetPosition = widgetPosition;
        setScreenCharts(cloneDeep(screenCharts));
        // console.log('尺寸调整', id, screenCharts);
    }, 500)

    const widgetResizeStop = (id, refToElement, position, dir) => {
        const widgetSize = { width: refToElement.style.width, height: refToElement.style.height };
        const widgetPosition = { x: position.x, y: position.y };
        const widgetOption = find(screenCharts, { id: id });
        widgetOption.widgetSize = widgetSize;
        widgetOption.widgetPosition = widgetPosition;
        setScreenCharts(cloneDeep(screenCharts));
        console.log('尺寸调整停止', id, screenCharts);
    }

    const widgetDrag = throttle((e, id, data) => {
        console.log('位置调整', e);
        const widgetPosition = { x: data.x, y: data.y };
        const widgetOption = find(screenCharts, { id: id });
        widgetOption.widgetPosition = widgetPosition;
        setScreenCharts(cloneDeep(screenCharts));
    }, 500)

    const widgetDragStop = (e, id, data) => {
        const widgetPosition = { x: data.x, y: data.y };
        const widgetOption = find(screenCharts, { id: id });
        widgetOption.widgetPosition = widgetPosition;
        setScreenCharts(cloneDeep(screenCharts));
        console.log('位置调整停止', id, screenCharts);
        const scrollLeft = e.target.getBoundingClientRect().right - document.documentElement.clientWidth;
        const scrollTop = e.target.getBoundingClientRect().bottom - document.documentElement.clientHeight;
        document.documentElement.scrollTop = scrollTop;
        document.documentElement.scrollLeft = scrollLeft;
    }

    const widgetClick = (index) => {
        setActiveChartIndex(index);
        const clickChart = screenCharts[index];
        console.log('重新调整zinde', index, clickChart);
        clickChart.zIndex = screenCharts.length - 1;
        const sortRange = range(screenCharts.length);
        let j = 0;
        for (let i = 0; i < sortRange.length; i++) {
            if (i == index) {
                continue;
            } else {
                screenCharts[i].zIndex = sortRange[j];
                j++;
            }
        }
        setScreenCharts(cloneDeep(screenCharts));
    }

    useEffect(() => {
        if (screenCharts.length > 0) {
            const widthArr = map(map(map(screenCharts, 'widgetSize'), 'width'), (width) => {
                if (isNumber(width)) {
                    return width;
                } else if (isString(width)) {
                    if (endsWith(width), 'px') {
                        return toNumber(width.slice(0, (width.length - 2)));
                    }
                }
            });
            const heightArr = map(map(map(screenCharts, 'widgetSize'), 'height'), (height) => {
                if (isNumber(height)) {
                    return height;
                } else if (isString(height)) {
                    if (endsWith(height), 'px') {
                        return toNumber(height.slice(0, (height.length - 2)));
                    }
                }
            });
            const maxOffsetX = max(map(map(screenCharts, 'widgetPosition'), 'x'));
            const maxOffsetY = max(map(map(screenCharts, 'widgetPosition'), 'y'));
            setScreenSize({ width: maxOffsetX + 10 + sum(widthArr), height: maxOffsetY + 10 + sum(heightArr) });
            console.log('调整大屏尺寸', maxOffsetX, maxOffsetY, sum(widthArr), sum(heightArr));
        }
    }, [screenCharts]);


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
                                <i className="fa fa-text-width" aria-hidden="true"></i>
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
            <div className="screen-charts-content" style={screenSize}>
                {screenCharts.length > 0 && screenCharts.map((option, index) => {
                    return (
                        <Rnd
                            default={{
                                x: index * 10,
                                y: 0,
                                width: 480,
                                height: 270,
                            }}
                            style={{ zIndex: option.zIndex }}
                            key={option.id}
                            lockAspectRatio={16 / 9}
                            bounds="parent"
                            onClick={() => {
                                widgetClick(index);
                            }}
                            resizeHandleClasses={(index == activeChartIndex) && {
                                bottom: 'resize-edge resize-edge-bottom',
                                bottomLeft: 'resize-corner resize-corner-bottomLeft',
                                bottomRight: 'resize-corner resize-corner-bottomRight',
                                left: 'resize-edge resize-edge-left',
                                right: 'resize-edge resize-edge-right',
                                top: 'resize-edge resize-edge-top',
                                topLeft: 'resize-corner resize-corner-topLeft',
                                topRight: 'resize-corner resize-corner-topRight',
                            }}
                            onResize={(e, dir, refToElement, delta, position) => { widgetResize(option.id, refToElement, position) }}
                            onResizeStop={(e, dir, refToElement, delta, position) => { widgetResizeStop(option.id, refToElement, position, dir) }}
                            onDrag={(e, data) => { widgetDrag(e, option.id, data) }}
                            onDragStop={(e, data) => { widgetDragStop(e, option.id, data) }}
                        >
                            <ReactEcharts
                                className='chart-widget-item'
                                option={option.echartOption}
                                style={option.widgetSize}
                            />
                        </Rnd>
                    )
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