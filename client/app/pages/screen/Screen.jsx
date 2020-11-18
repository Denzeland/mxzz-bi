import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { PageHeader, Row, Col, Card, Typography, List, Icon, Dropdown, Tabs, Empty, Affix, Input, Table, Drawer, Button, Select, Tree, Badge } from 'antd';
import { max, sum, isNumber, isString, endsWith, throttle, map, find, toNumber, range, cloneDeep, findIndex, extend, forEach, floor, assignIn, has } from "lodash";
import NewScreenDialog from './NewScreenDialog';
import location from "@/services/location";
import ReactEcharts from 'echarts-for-react';
import './Screen.less';
import { Rnd } from 'react-rnd';
import { defaultChartsOptions } from './defaultChartsOptions';
import moment from "moment";
import cx from "classnames";
import bmap from 'echarts/extension/bmap/bmap';
import "echarts/map/js/china.js";
import 'echarts/theme/vintage';
import 'echarts/theme/shine';
import 'echarts/theme/roma';
import 'echarts/theme/macarons';
import 'echarts/theme/infographic';
import './theme-data/chalk';
import './theme-data/essos';
import './theme-data/purple-passion';
import './theme-data/walden';
import './theme-data/westeros';
import './theme-data/wonderland';
import './theme-data/science';
import useUnsavedChangesAlert from "@/pages/queries/hooks/useUnsavedChangesAlert";
import { createBrowserHistory } from "history";
import 'echarts-gl';

import DataSource, { SCHEMA_NOT_SUPPORTED } from "@/services/data-source";
import { Query } from "@/services/query";
import SchemaBrowser from "@/pages/queries/components/SchemaBrowser";
import useDataSourceSchema from "@/pages/queries/hooks/useDataSourceSchema";
import { axios } from "@/services/axios";
import LoadingState from "@/components/items-list/components/LoadingState";

const history = createBrowserHistory();
const { TreeNode } = Tree;

function Screen(props) {
    // console.log('编辑大屏查询search', location.search);
    const search = location.search;
    const theme = search.template;
    const arryReducer = (prevState, updatedProperty) => {
        if (updatedProperty.length > 0) {
            return [...updatedProperty];
        } else {
            return [];
        }
    };
    const objReducer = (prevState, updatedProperty) => ({ ...prevState, ...updatedProperty });
    const replaceObjReducer = (prevState, updatedProperty) => ({ ...updatedProperty });
    const [activeChartIndex, setActiveChartIndex] = useState(null);
    const [screenViewMode, setScreenViewMode] = useState('edit');
    const [chartItemInEdit, setChartItemInEdit] = useState(false);
    const [currentEditChartOption, setCurrentEditChartOption] = useReducer(replaceObjReducer, null);

    const [allDataSources, setAllDataSources] = useState([]);
    const [currentQueryResultColumns, setCurrentQueryResultColumns] = useReducer(arryReducer, []);
    const [currentQueryResultData, setCurrentQueryResultData] = useReducer(arryReducer, []);
    const [queryResultColumnsLoaded, setQueryResultColumnsLoaded] = useState(true);
    const [dataSourcesLoaded, setDataSourcesLoaded] = useState(false);
    const [currentDataSource, setCurrentDataSource] = useReducer(replaceObjReducer, null);
    // const [schema, refreshSchema] = useDataSourceSchema(currentDataSource);
    const [treeData, setTreeData] = useReducer(arryReducer, [
        { title: '未处理数据集', key: '1' },
        { title: '已建立数据集', key: '2' },
    ]);

    console.log('抽屉dataSources', allDataSources, treeData);

    document.addEventListener("fullscreenchange", function (event) {
        if (document.fullscreenElement) {
            setScreenViewMode('preview');
        } else {
            setScreenViewMode('edit');
        }
    });
    document.body.classList.add(theme);
    /**
     * screenCharts = [{
     *  id: moment().unix(),
     *  chartOption: option,
     *  zIndex: zIndex,
     *  widgetSize: { width, height },
     *  widgetPosition: { x, y },
     *  engine: 'echarts' or 'antd-*',
    }]
     */
    /**
     * screenChartsVisualSettings = [{
     *      chartId: ,
     *      expandedKeys: [],
     *      selectedKeys: [],
     *      columnSetting: {
     *           xAxis: 'columnName',
     *           yAxis: ['columnName', 'columnName'],
     *      },
     *      dataFiltering: null
     * }]
     */
    const [screenSize, setScreenSize] = useReducer(objReducer, { width: 'auto', height: 'auto' });
    const [screenCharts, setScreenCharts] = useReducer(arryReducer, []);
    const [screenChartsVisualSettings, setScreenChartsVisualSettings] = useReducer(arryReducer, []);
    const [currentChartVisualSetting, setCurrentChartVisualSetting] = useReducer(objReducer, null);
    useUnsavedChangesAlert(screenCharts.length > 0);
    const dropdownListData = [
        {
            name: '基础',
            icon: <Icon type="bar-chart" />,
            data: [
                {
                    imgSrc: '/static/images/line_chart.png',
                    name: '折线图',
                    type: 'line',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/bar_chart.png',
                    name: '直方图',
                    type: 'bar',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/pie_chart.png',
                    name: '饼图',
                    type: 'pie',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/scatter_plot.png',
                    name: '散点图',
                    type: 'scatter',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/bubble_chart.png',
                    name: '涟漪气泡图',
                    type: 'effectScatter',
                    engine: 'echarts'
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
                    type: 'heatmap',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/relate.png',
                    name: '关系图',
                    type: 'graph',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/themeRiver.png',
                    name: '河流图',
                    type: 'themeRiver',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/radar.png',
                    name: '雷达图',
                    type: 'radar',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/tree_chart.png',
                    name: '树图',
                    type: 'tree',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/treemap.png',
                    name: '矩形树图',
                    type: 'treemap',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/sunburst.png',
                    name: '旭日图',
                    type: 'sunburst',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/sankey.png',
                    name: '桑基图',
                    type: 'sankey',
                    engine: 'echarts'
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
                    type: 'candlestick',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/boxplot.png',
                    name: '盒须图',
                    type: 'boxplot',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/funnel.png',
                    name: '漏斗图',
                    type: 'funnel',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/gauge.png',
                    name: '仪表盘',
                    type: 'gauge',
                    engine: 'echarts'
                },
            ]
        },
        {
            name: '地图',
            icon: <i className="fa fa-map" aria-hidden="true"></i>,
            data: [
                {
                    imgSrc: '/static/images/map_chart.png',
                    name: '百度地图',
                    type: 'bmap',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/china_map.png',
                    name: '中国地图',
                    type: 'china-map',
                    engine: 'echarts'
                },
                {
                    imgSrc: '/static/images/route_map.png',
                    name: '路径图',
                    type: 'lines',
                    engine: 'echarts'
                },
            ]
        },
        {
            name: '3D',
            icon: <i className="fa fa-cubes" aria-hidden="true"></i>,
            data: [{
                imgSrc: '/static/images/globe-echarts-gl-hello-world.jpg',
                name: '3D地球',
                type: 'globe-base',
                engine: 'echarts'
            },]
        },
        {
            name: '其他',
            icon: <i className="fa fa-list" aria-hidden="true"></i>,
            data: [{
                imgSrc: '/static/images/table_chart.png',
                name: '表格',
                type: 'table',
                engine: 'antd-table'
            }, {
                imgSrc: '/static/images/text_chart.png',
                name: '文字',
                type: 'text',
                engine: 'antd-text'
            },]
        }
    ];
    const dropdownItemClick = (item) => {
        const defaultOption = find(defaultChartsOptions, { type: item.type });
        if (defaultOption) {
            if (item.engine !== 'antd-text') {
                screenCharts.push({
                    id: moment().unix(),
                    zIndex: screenCharts.length,
                    chartOption: cloneDeep(defaultOption),
                    widgetSize: { width: 480, height: 270 },
                    widgetPosition: { x: 10, y: 0 },
                    engine: item.engine
                });
            } else {
                screenCharts.push({
                    id: moment().unix(),
                    zIndex: screenCharts.length,
                    chartOption: cloneDeep(defaultOption),
                    widgetSize: { width: 300, height: 100 },
                    widgetPosition: { x: 10, y: 0 },
                    engine: item.engine
                });
            }
            // setScreenCharts(screenCharts);
            setScreenCharts(screenCharts);
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

    const widgetResize = throttle((e, id, refToElement, position) => {
        // e.preventDefault();
        // e.stopPropagation();
        const widgetSize = { width: refToElement.style.width, height: refToElement.style.height };
        const widgetPosition = { x: position.x, y: position.y };
        const widgetOption = find(screenCharts, { id: id });
        widgetOption.widgetSize = widgetSize;
        widgetOption.widgetPosition = widgetPosition;
        setScreenCharts(screenCharts);
        // console.log('尺寸调整', id, screenCharts);
    }, 500)

    const widgetResizeStop = (e, id, refToElement, position, dir) => {
        // e.preventDefault();
        // e.stopPropagation();
        const widgetSize = { width: refToElement.style.width, height: refToElement.style.height };
        const widgetPosition = { x: position.x, y: position.y };
        const widgetOption = find(screenCharts, { id: id });
        widgetOption.widgetSize = widgetSize;
        widgetOption.widgetPosition = widgetPosition;
        setScreenCharts(screenCharts);
        console.log('尺寸调整停止', id, screenCharts);
    }

    const widgetDragStop = (e, id, data) => {
        // e.preventDefault();
        // e.stopPropagation();
        const widgetPosition = { x: data.x, y: data.y };
        const widgetOption = find(screenCharts, { id: id });
        widgetOption.widgetPosition = widgetPosition;
        setScreenCharts(screenCharts);
    }

    const resetZindex = (index) => {
        setActiveChartIndex(index);
        const clickChart = screenCharts[index];
        // console.log('重新调整zinde', index, clickChart);
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
        setScreenCharts(screenCharts);
    }

    const onPreview = () => {
        setActiveChartIndex(null);
        document.querySelector('.mxbi-content').requestFullscreen();
    }

    const cancleActive = (e) => {
        e.stopPropagation();
        if (e.target.getAttribute('class') == "screen-charts-content") {
            setActiveChartIndex(null);
        }
    }

    const activeChartItem = (e, index) => {
        if (screenViewMode == 'edit' && e.target.tagName !== "I") {
            resetZindex(index);
        }
    }

    const deleteChartItem = (e, index) => {
        e.stopPropagation();
        setActiveChartIndex(null);
        screenCharts.splice(index, 1);
        setScreenCharts(screenCharts);
    }

    const copyChartItem = (e, option) => {
        e.stopPropagation();
        screenCharts.push(assignIn(cloneDeep(option), {
            id: moment().unix(),
            zIndex: screenCharts.length,
        }));
        resetZindex(screenCharts.length - 1);
    }

    const freshChartItem = (e, index) => {
        e.stopPropagation();
    }

    useEffect(() => {
        if (screenCharts.length > 0) {
            const widthArr = map(map(map(screenCharts, 'widgetSize'), 'width'), (width) => {
                if (isNumber(width)) {
                    return width;
                } else if (isString(width)) {
                    if (endsWith(width, 'px')) {
                        return toNumber(width.slice(0, (width.length - 2)));
                    }
                }
            });
            const heightArr = map(map(map(screenCharts, 'widgetSize'), 'height'), (height) => {
                if (isNumber(height)) {
                    return height;
                } else if (isString(height)) {
                    if (endsWith(height, 'px')) {
                        return toNumber(height.slice(0, (height.length - 2)));
                    }
                }
            });
            const maxOffsetX = max(map(map(screenCharts, 'widgetPosition'), 'x'));
            const maxOffsetY = max(map(map(screenCharts, 'widgetPosition'), 'y'));
            const maxOffsetXIndex = findIndex(screenCharts, (item) => {
                return item.widgetPosition.x == maxOffsetX
            });
            const maxOffsetYIndex = findIndex(screenCharts, (item) => {
                return item.widgetPosition.y == maxOffsetY
            });
            const widthByMaxOffsetX = maxOffsetX + widthArr[maxOffsetXIndex];
            const heightByMaxOffsetY = maxOffsetY + heightArr[maxOffsetYIndex];
            const widthByMaxWidth = screenCharts[findIndex(widthArr, (item) => { return item === max(widthArr) })].widgetPosition.x + max(widthArr);
            const heightByMaxHeight = screenCharts[findIndex(heightArr, (item) => { return item === max(heightArr) })].widgetPosition.y + max(heightArr);
            const finalScreenWidth = max([widthByMaxOffsetX, widthByMaxWidth]);
            const finalScreenHeight = max([heightByMaxOffsetY, heightByMaxHeight]);
            setScreenSize({ width: finalScreenWidth + 100, height: finalScreenHeight + 100 });
            console.log('调整大屏尺寸', maxOffsetX, maxOffsetY, sum(widthArr), sum(heightArr));
        }

    }, [screenCharts]);

    useEffect(() => {
        return () => {
            document.body.classList.remove(theme);
        };
    }, [theme])

    const renderChartItem = (option) => {
        let widget;
        if (option.engine == 'echarts') {
            widget = <ReactEcharts
                className='chart-widget-item'
                option={option.chartOption.option}
                style={option.widgetSize}
                theme={theme}
            // showLoading={true}
            />;
        } else if (option.engine == 'antd-text') {
            widget = <Input  {...option.chartOption.option} style={option.widgetSize} />
        } else if (option.engine == 'antd-table') {
            const widgetHeight = option.widgetSize.height;
            const widgetHeightNum = endsWith(widgetHeight, 'px') ? toNumber(widgetHeight.slice(0, (widgetHeight.length - 2))) : widgetHeight;
            const pageSize = floor((widgetHeightNum - 100) / 35);
            widget = <Table  {...option.chartOption.option} style={option.widgetSize} pagination={false} scroll={{ y: widgetHeightNum - 50 }} />
        }
        return widget;
    }

    const editChartItem = (e, option) => {
        e.stopPropagation();
        const editChartOption = cloneDeep(option);
        const visualSetting = find(screenChartsVisualSettings, { chartId: option.id });
        if (visualSetting) {
            setCurrentChartVisualSetting(cloneDeep(visualSetting));
        } else {
            setCurrentChartVisualSetting({
                chartId: option.id,
                expandedKeys: [],
                selectedKeys: [],
                columnSetting: {
                    xAxis: null,
                    yAxis: null,
                },
                dataFiltering: null
            });
        }
        setCurrentEditChartOption(editChartOption);
        prepareTreeNodeRender();
        setChartItemInEdit(true);
    }

    const onDimensionChange = (value) => {
        setCurrentChartVisualSetting({
            columnSetting: {
                xAxis: value
            }
        });
        console.log("维度", currentChartVisualSetting);
    }

    const onIndicatorChange = (value) => {
        setCurrentChartVisualSetting({
            columnSetting: {
                yAxis: value
            }
        });
        console.log("指标", currentChartVisualSetting);
    }

    function getSchema(dataSource, refresh = undefined) {
        if (!dataSource) {
            return Promise.resolve([]);
        }

        const fetchSchemaFromJob = data => {
            return axios.get(`api/jobs/${data.job.id}`).then(data => {
                if (data.job.status < 3) {
                    return sleep(1000).then(() => fetchSchemaFromJob(data));
                } else if (data.job.status === 3) {
                    return data.job.result;
                } else if (data.job.status === 4 && data.job.error.code === SCHEMA_NOT_SUPPORTED) {
                    return [];
                } else {
                    return Promise.reject(new Error(data.job.error));
                }
            });
        };

        return DataSource.fetchSchema(dataSource, refresh)
            .then(data => {
                if (has(data, "job")) {
                    return fetchSchemaFromJob(data);
                }
                return has(data, "schema") ? data.schema : Promise.reject();
            })
            .catch(() => {
                notification.error(__("Schema refresh failed."), __("Please try again later."));
                return Promise.resolve([]);
            });
    }

    const onTreeNodeExpand = (expandedKeys, {expanded: bool, node}) => {
        console.log('展开树节点', expandedKeys, expanded, node);
    }

    const onTreeNodeSelect = (selectedKeys, info) => {
        const dataRef = info.node.props.dataRef
        if (has(dataRef, 'query')) {
            const query = dataRef.query;
            let queryResult;
            setQueryResultColumnsLoaded(false);
            if (query.isNew()) {
                const sqlText = `select * from ${dataRef.title};`;
                queryResult = query.getQueryResultByText(0, sqlText);
            } else {
                queryResult = query.getQueryResult(0);
            }
            queryResult.toPromise().then(data => {
                console.log('promise结果', data.getColumns(), data.getData());
                setCurrentQueryResultColumns(data.getColumns());
                setCurrentQueryResultData(data.getData());
                setQueryResultColumnsLoaded(true);
            });
        }
    };

    const renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode {...item} title={item.title} key={item.key} dataRef={item}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} {...item} dataRef={item} />;
        });

    const prepareTreeNodeRender = () => {
        Promise.all([DataSource.query(), Query.query()]).then(([dataSource, query]) => {
            console.log('并发获取数据', dataSource, query);
            setAllDataSources(dataSource);
            if (dataSource.length > 0) {
                const dataSourceToTree = map(dataSource, (data) => ({
                    key: `1-${data.id}`,
                    title: data.name,
                    dataSource: data
                }));
                Promise.all(map(dataSource, (data) => {
                    return getSchema(data);
                })).then(schemas => {
                    console.log('schemas', schemas);
                    forEach(schemas, (schema, index) => {
                        const query = extend(Query.newQuery(), { data_source_id: dataSource[index].id });
                        const schemaTree = map(schema, (schemaItem, schemaIndex) => {
                            return {
                                title: schemaItem.name,
                                key: `1-${dataSource[index].id}-${schemaItem.name}`,
                                isLeaf: true,
                                query
                            }
                        });
                        dataSourceToTree[index].children = schemaTree;
                    });
                    treeData[0].children = dataSourceToTree;
                    setDataSourcesLoaded(true);
                });
            }

            if (query.results.length > 0) {
                const queryToTree = map(query.results, (data) => {
                    console.log('getQueryResult', data.getQueryResult(0));
                    return {
                        key: `2-${data.id}`,
                        title: data.name,
                        query: data,
                        isLeaf: true,
                    }
                });
                treeData[1].children = queryToTree;
            }
            setTreeData(treeData);
        });
    }

    return (
        <React.Fragment>
            <Affix offsetTop={80} style={{ height: 'auto' }} className="edit-header">
                <PageHeader
                    // ghost={false}
                    className={cx("screen-page-header", { [`${theme}`]: true })}
                    onBack={() => { history.goBack(); }}
                    title={<Typography.Title level={3}>{search.title}</Typography.Title>}
                    subTitle={search.description}
                    extra={
                        <React.Fragment>
                            <ul className="screen-edit-btn-wrap">
                                {dropdownListComponent}
                            </ul>
                            <ul className="screen-edit-extra">
                                <li onClick={onPreview}>
                                    <Icon type="fullscreen" />
                                    <span>预览</span>
                                </li>
                                <li onClick={onPreview}>
                                    <Icon type="save" />
                                    <span>保存</span>
                                </li>
                            </ul>
                        </React.Fragment>}
                ></PageHeader>
            </Affix>
            <div className="screen-charts-content" style={screenSize} onClick={cancleActive}>
                {screenCharts.length > 0 && screenCharts.map((option, index) => {
                    return (
                        <Rnd
                            default={{
                                x: index * 10,
                                y: document.documentElement.scrollTop,
                                width: option.widgetSize.width,
                                height: option.widgetSize.height,
                            }}
                            style={{ zIndex: option.zIndex }}
                            key={option.id}
                            // lockAspectRatio={16 / 9}
                            bounds="parent"
                            dragHandleClassName='drag-handle'
                            dragGrid={[100, 100]}
                            enableResizing={screenViewMode == 'edit' ? true : false}
                            disableDragging={screenViewMode == 'preview' ? true : false}
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
                            // onResizeStart={(e, dir, refToElement) => { resetZindex(index); }}
                            onResize={(e, dir, refToElement, delta, position) => { widgetResize(e, option.id, refToElement, position) }}
                            onResizeStop={(e, dir, refToElement, delta, position) => { widgetResizeStop(e, option.id, refToElement, position, dir) }}
                            // onDragStart={(e, data) => { resetZindex(index) }}
                            // onDrag={(e, data) => { widgetDrag(e, option.id, data) }}
                            onDragStop={(e, data) => { widgetDragStop(e, option.id, data) }}
                        >
                            <div onClick={(e) => { activeChartItem(e, index); }}>
                                {renderChartItem(option)}
                                {(index == activeChartIndex) &&
                                    <React.Fragment>
                                        <div className="chart-item-edit">
                                            <Icon type="delete" onClick={(e) => { deleteChartItem(e, index) }} />
                                            <Icon type="copy" onClick={(e) => { copyChartItem(e, option) }} />
                                            <Icon type="sync" onClick={(e) => { freshChartItem(e, index) }} />
                                            <Icon type="edit" onClick={(e) => { editChartItem(e, option) }} />
                                        </div>
                                        <Icon type="drag" className='drag-handle' />
                                    </React.Fragment>
                                }
                            </div>
                        </Rnd>
                    )
                })}
            </div>
            <Drawer
                title="配置图表"
                width={720}
                visible={chartItemInEdit}
                bodyStyle={{ height: 'calc(100vh - 100px)' }}
                onClose={() => { setChartItemInEdit(false) }}
                className={theme}
            >
                <div className="chart-item-edit-wraper">
                    <div className="chart-item-preview">
                        {chartItemInEdit && (currentEditChartOption ? renderChartItem(currentEditChartOption) : null)}
                    </div>
                    <div className="chart-item-edit-content">
                        <Row gutter={16} style={{ height: '100%' }}>
                            <Col span={8} style={{ height: '100%' }}>
                                <Card title="配置数据集" hoverable={true} className="chart-item-edit-card" bodyStyle={{ maxHeight: 'calc(100% - 55px)', overflow: 'auto' }}>
                                    {chartItemInEdit && !dataSourcesLoaded && <LoadingState />}
                                    {chartItemInEdit && dataSourcesLoaded && (
                                        <Tree onSelect={onTreeNodeSelect} defaultExpandedKeys={['1']} onExpand={onTreeNodeExpand} expandedKeys={currentChartVisualSetting.expandedKeys} selectedKeys={currentChartVisualSetting.selectedKeys}>{renderTreeNodes(treeData)}</Tree>
                                    )}
                                </Card>
                            </Col>
                            <Col span={8} style={{ height: '100%' }}>
                                <Card title="配置数据指标" hoverable={true} className="chart-item-edit-card" bodyStyle={{ maxHeight: 'calc(100% - 55px)', overflow: 'auto' }}>
                                    {!queryResultColumnsLoaded && <LoadingState />}
                                    {
                                        queryResultColumnsLoaded &&
                                        <React.Fragment>
                                            <div className="dimension">
                                                <Typography.Title level={4}>维度：</Typography.Title>
                                                <Select
                                                    style={{ width: '90%' }}
                                                    placeholder="选择一个字段作为维度"
                                                    // optionFilterProp="children"
                                                    onChange={onDimensionChange}
                                                    optionLabelProp="label"
                                                >
                                                    {currentQueryResultColumns.map(column => {
                                                        return <Select.Option label={column.name} value={column.name} key={column.name}>{column.name}<Badge count={column.type} /></Select.Option>
                                                    })}
                                                </Select>
                                            </div>
                                            <div className="indicator">
                                                <Typography.Title level={4}>指标：</Typography.Title>
                                                <Select
                                                    mode="multiple"
                                                    style={{ width: '90%' }}
                                                    placeholder="指标可以选择多个"
                                                    // defaultValue={['china']}
                                                    onChange={onIndicatorChange}
                                                    optionLabelProp="label"
                                                >
                                                    {currentQueryResultColumns.map(column => {
                                                        return <Select.Option label={column.name} value={column.name} key={column.name}>{column.name}<Badge count={column.type} /></Select.Option>
                                                    })}
                                                </Select>
                                            </div>
                                        </React.Fragment>
                                    }
                                </Card>
                            </Col>
                            <Col span={8} style={{ height: '100%' }}>
                                <Card title="配置数据过滤" hoverable={true} className="chart-item-edit-card" bodyStyle={{ maxHeight: 'calc(100% - 55px)', overflow: 'auto' }}>
                                    <Empty />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={() => { setChartItemInEdit(false) }} style={{ marginRight: 8 }}>
                        取消
                    </Button>
                    <Button onClick={() => { setChartItemInEdit(false) }} type="primary">
                        确定
                    </Button>
                </div>
            </Drawer>
        </React.Fragment>
    )
}

export default routeWithUserSession({
    path: "/screen",
    title: '编辑大屏',
    render: pageProps => <Screen {...pageProps} />,
    bodyClass: cx("screen")
});