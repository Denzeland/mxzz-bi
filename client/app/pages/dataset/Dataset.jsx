import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { Steps, Button, message, Row, Col, Card, Typography, Input, Radio, Form, Tooltip, Icon, DatePicker, TimePicker, Select } from 'antd';
import { isEmpty, reject, includes, intersection, isArray, capitalize, map, find, extend, join, cloneDeep } from "lodash";
import DataSource, { IMG_ROOT } from "@/services/data-source";
import CreateSourceDialog from "@/components/CreateSourceDialog";
import { policy } from "@/services/policy";
import LoadingState from "@/components/items-list/components/LoadingState";
import helper from "@/components/dynamic-form/dynamicFormHelper";
import navigateTo from "@/components/ApplicationArea/navigateTo";
import moment from "moment";
import { secondsToInterval, durationHumanize, pluralize, IntervalEnum, localizeTime } from "@/lib/utils";
import { clientConfig } from "@/services/auth";
import { TimeEditor } from "@/components/queries/ScheduleDialog";
import useQuery from "@/pages/queries/hooks/useQuery";
import useQueryDataSources from "@/pages/queries/hooks/useQueryDataSources";
import useDataSourceSchema from "@/pages/queries/hooks/useDataSourceSchema";
import useQueryFlags from "@/pages/queries/hooks/useQueryFlags";
import useQueryParameters from "@/pages/queries/hooks/useQueryParameters";
import useUpdateQuery from "@/pages/queries/hooks/useUpdateQuery";
import useUpdateQueryDescription from "@/pages/queries/hooks/useUpdateQueryDescription";
import useEditScheduleDialog from "@/pages/queries/hooks/useEditScheduleDialog";
import SchemaBrowser from "./SchemaBrowser";
import Resizable from "@/components/Resizable";
import EditInPlace from "@/components/EditInPlace";
import { Query } from "@/services/query";
import wrapQueryPage from "@/pages/queries/components/wrapQueryPage";
import useMedia from "use-media";
import cx from "classnames";
import { useDrop } from 'react-dnd';
import G6 from '@antv/g6';

import "./dataset.less";

const { Step } = Steps;
const { Search } = Input;
const WEEKDAYS_SHORT = moment.weekdaysShort();
const WEEKDAYS_FULL = moment.weekdays();
const DATE_FORMAT = "YYYY-MM-DD";
const HOUR_FORMAT = "HH:mm";
const { Option, OptGroup } = Select;


function DataSourceSelect({ onError, selectChange, selectedDataSourceId, radioRef }) {
    const [dataSources, setDataSources] = useState([]);
    const [dataSourceTypes, setDataSourceTypes] = useState([]);
    const [loading, setLoding] = useState(true);
    const [searchText, setSearchText] = useState("");
    const newDataSourceDialog = null;

    useEffect(() => {
        Promise.all([DataSource.query(), DataSource.types()])
            .then(values => {
                console.log('加载数据源', values);
                setDataSources(values[0]);
                setDataSourceTypes(values[1]);
                setLoding(false);
            }
            )
            .catch(error => onError(error));
        return () => {
            if (newDataSourceDialog) {
                newDataSourceDialog.dismiss();
            }
        }
    }, []);

    function createDataSource(selectedType, values) {
        const target = { options: {}, type: selectedType.type };
        helper.updateTargetWithValues(target, values);

        return DataSource.create(target).then(dataSource => {
            setLoding(true);
            DataSource.query().then(dataSources => {
                setDataSources(dataSources);
                setLoding(false);
            });
            return dataSource;
        });
    }

    function showCreateSourceDialog() {
        newDataSourceDialog = CreateSourceDialog.showModal({
            types: reject(dataSourceTypes, "deprecated"),
            sourceType: "数据源",
            imageFolder: IMG_ROOT,
            helpTriggerPrefix: "DS_",
            onCreate: createDataSource,
        }).onClose((result = {}) => {
            newDataSourceDialog = null;
            if (result.success) {
                navigateTo("dataset/new");
            }
        })
            .onDismiss(() => {
                newDataSourceDialog = null;
                navigateTo("dataset/new", true);
            });
    }

    function onSelectChange(e) {
        selectChange(e.target.value);
    }

    function renderSelection() {
        console.log('查看数据源', selectedDataSourceId, dataSources);
        const filteredItems = dataSources.filter(
            item => isEmpty(searchText) || includes(item.name.toLowerCase(), searchText.toLowerCase())
        );
        return isEmpty(dataSources) ? (
            policy.isCreateDataSourceEnabled() && <Empty
                description={
                    <span>
                        您还没有创建过数据源
                </span>
                }
            >
                <Button type="primary" onClick={showCreateSourceDialog}>创建一个数据源</Button>
            </Empty>) : (
                <div className="data-source-radio-content">
                    <Search placeholder="搜索数据源" onChange={e => setSearchText(e.target.value)} autoFocus className="data-source-radio-search-input" />
                    <Radio.Group defaultValue={dataSources[0].id} size="large" buttonStyle="solid" onChange={onSelectChange} value={selectedDataSourceId ? selectedDataSourceId : dataSources[0].id} ref={radioRef}>
                        {filteredItems.map(dataSource => (
                            <Radio.Button value={dataSource.id} style={{ margin: '10px 15px', borderRadius: '3px' }} key={dataSource.id}>
                                <img src={`${IMG_ROOT}/${dataSource.type}.png`} style={{ width: 30, height: 30, }} />
                                <span>{dataSource.name}</span>
                            </Radio.Button>))}
                    </Radio.Group>
                </div>
            )
    }

    return loading ? <LoadingState className="" /> : renderSelection()
}

function DataSetSettingForm(props) {
    const { getFieldDecorator } = props.form;
    return (
        <Row>
            <Col span={6}></Col>
            <Col span={12}>
                <Form layout="vertical">
                    <Form.Item label="数据集名称">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '名称是必填项!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label={
                        <span>
                            数据集描述&nbsp;
                            <Tooltip title="数据集的一个较详细的说明">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }>
                        {getFieldDecorator('description')(<Input type="textarea" />)}
                    </Form.Item>
                    <Form.Item label={
                        <span>
                            数据集标签&nbsp;
                            <Tooltip title="用来对数据集进行分类">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }>
                        {getFieldDecorator('tag')(<Input type="textarea" />)}
                    </Form.Item>
                </Form>
            </Col>
            <Col span={6}></Col>
        </Row>
    )
}

function onFieldsChange(props, changedFields, allFields) {
    console.log('onFieldsChange', props, changedFields, allFields);
    props.onChange(changedFields);
}

function mapPropsToFields(props) {
    return {
        title: Form.createFormField({
            ...props.title,
            value: props.title.value,
        }),
        description: Form.createFormField({
            ...props.description,
            value: props.description.value,
        }),
        tag: Form.createFormField({
            ...props.tag,
            value: props.tag.value,
        }),
    };
}

const WrappedDataSetSettingForm = Form.create({ name: 'dataset_setting', onFieldsChange, mapPropsToFields })(DataSetSettingForm);

//组件状态保存在父级组件
function ScheduleSetting({ scheduleState, setScheduleState }) {
    const clientConfigIntervals = clientConfig.queryRefreshIntervals;
    const allowedIntervals = policy.getQueryRefreshIntervals();
    const refreshOptions = isArray(allowedIntervals) ? intersection(clientConfigIntervals, allowedIntervals) : clientConfigIntervals;

    function getIntervals() {
        const ret = {
            [IntervalEnum.NEVER]: [],
        };
        refreshOptions.forEach(seconds => {
            const { count, interval } = secondsToInterval(seconds);
            if (!(interval in ret)) {
                ret[interval] = [];
            }
            ret[interval].push([count, seconds]);
        });
        return ret;
    }

    const intervals = getIntervals();

    function setInterval(newSeconds) {
        const { newSchedule } = scheduleState;
        const { interval: newInterval } = secondsToInterval(newSeconds);

        // resets to defaults
        if (newInterval === IntervalEnum.NEVER) {
            newSchedule.until = null;
        }
        if ([IntervalEnum.NEVER, IntervalEnum.MINUTES, IntervalEnum.HOURS].indexOf(newInterval) !== -1) {
            newSchedule.time = null;
        }
        if (newInterval !== IntervalEnum.WEEKS) {
            newSchedule.day_of_week = null;
        }
        if (
            (newInterval === IntervalEnum.DAYS || newInterval === IntervalEnum.WEEKS) &&
            (!scheduleState.minute || !scheduleState.hour)
        ) {
            newSchedule.time = moment()
                .hour("00")
                .minute("15")
                .utc()
                .format(HOUR_FORMAT);
        }
        if (newInterval === IntervalEnum.WEEKS && !scheduleState.dayOfWeek) {
            newSchedule.day_of_week = WEEKDAYS_FULL[0];
        }

        newSchedule.interval = newSeconds;

        const [hour, minute] = newSchedule.time ? localizeTime(newSchedule.time).split(":") : [null, null];

        setScheduleState({
            interval: newInterval,
            seconds: newSeconds,
            hour,
            minute,
            newSchedule,
            dayOfWeek: newSchedule.day_of_week ? WEEKDAYS_SHORT[WEEKDAYS_FULL.indexOf(newSchedule.day_of_week)] : null,
        });
    };

    function setTime(time) {
        setScheduleState({ time: moment(time).utc().format(HOUR_FORMAT) });
    };

    function setWeekday(e) {
        const dayOfWeek = e.target.value;
        setScheduleState({
            dayOfWeek,
            newSchedule: {
                day_of_week: dayOfWeek ? WEEKDAYS_FULL[WEEKDAYS_SHORT.indexOf(dayOfWeek)] : null,
            },
        });
    }

    function setUntilToggle(e) {
        const date = e.target.value ? moment().format(DATE_FORMAT) : null;
        console.log('格式化日期', date, e, scheduleState);
        setScheduleUntil(null, date);
    }

    function setScheduleUntil(_, date) {
        setScheduleState({
            newSchedule: Object.assign(scheduleState.newSchedule, { until: date }),
        });
    }

    const {
        interval,
        minute,
        hour,
        seconds,
        newSchedule: { until },
    } = scheduleState;

    return (
        <React.Fragment>
            <div className="schedule-component">
                <h5>刷新间隔</h5>
                <div data-testid="interval">
                    <Select className="input" value={seconds} onChange={setInterval} dropdownMatchSelectWidth={false}>
                        <Option value={null} key="never">
                            从不
                        </Option>
                        {Object.keys(intervals).map(int => (
                            <OptGroup label={capitalize(pluralize(int))} key={int}>
                                {intervals[int].map(([cnt, secs]) => (
                                    <Option value={secs} key={cnt}>
                                        {durationHumanize(secs)}
                                    </Option>
                                ))}
                            </OptGroup>
                        ))}
                    </Select>
                </div>
            </div>
            {[IntervalEnum.DAYS, IntervalEnum.WEEKS].indexOf(interval) !== -1 ? (
                <div className="schedule-component">
                    <h5>准时</h5>
                    <div data-testid="time">
                        <TimeEditor
                            defaultValue={
                                hour
                                    ? moment()
                                        .hour(hour)
                                        .minute(minute)
                                    : null
                            }
                            onChange={setTime}
                        />
                    </div>
                </div>
            ) : null}
            {IntervalEnum.WEEKS === interval ? (
                <div className="schedule-component">
                    <h5>在一天</h5>
                    <div data-testid="weekday">
                        <Radio.Group size="medium" defaultValue={scheduleState.dayOfWeek} onChange={setWeekday}>
                            {WEEKDAYS_SHORT.map(day => (
                                <Radio.Button value={day} key={day} className="input">
                                    {day}
                                </Radio.Button>
                            ))}
                        </Radio.Group>
                    </div>
                </div>
            ) : null}
            {interval !== IntervalEnum.NEVER ? (
                <div className="schedule-component">
                    <h5>结束</h5>
                    <div className="ends" data-testid="ends">
                        <Radio.Group size="medium" value={!!until} onChange={setUntilToggle}>
                            <Radio value={false}>从不</Radio>
                            <Radio value>结束时间</Radio>
                        </Radio.Group>
                        {until ? (
                            <DatePicker
                                size="small"
                                className="datepicker"
                                value={moment(until)}
                                allowClear={false}
                                format={DATE_FORMAT}
                                onChange={setScheduleUntil}
                            />
                        ) : null}
                    </div>
                </div>
            ) : null}
        </React.Fragment>
    )
}

function DatasetSetting({ onError, onSettingFinished }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedDataSourceId, setSelectedDataSourceId] = useState(null);
    const reducer = (prevState, updatedProperty) => ({
        ...prevState,
        ...updatedProperty,
    });
    const [formState, setFormState] = useReducer(reducer, {
        title: {
            value: ''
        },
        description: {
            value: ''
        },
        tag: {
            value: ''
        }
    });
    const [scheduleState, setScheduleState] = useReducer(reducer, {
        dayOfWeek: null,
        hour: null,
        interval: "从不",
        minute: null,
        newSchedule: { interval: null, time: null, day_of_week: null, until: null },
        seconds: null,
    });

    function selectChange(id) {
        setSelectedDataSourceId(id);
        setCurrentStep(currentStep + 1);
    }

    function radioRef(el) {
        el && setSelectedDataSourceId(el.state.value);
    }

    function onFormChange(changedFields) {
        console.log('表单字段change', changedFields);
        setFormState(changedFields);
    }

    const steps = [
        {
            title: '第一步',
            subTitle: "选择数据源",
            content: <DataSourceSelect onError={onError} selectChange={selectChange} selectedDataSourceId={selectedDataSourceId} radioRef={radioRef} />,
        },
        {
            title: '第二步',
            subTitle: "数据集名称",
            content: <WrappedDataSetSettingForm {...formState} onChange={onFormChange} />,
        },
        {
            title: '第三步',
            subTitle: "更新调度设置",
            content: <ScheduleSetting scheduleState={scheduleState} setScheduleState={setScheduleState} />,
        },
    ];
    function settingFinish() {
        DataSource.get({ id: selectedDataSourceId }).then((result) => {
            const settingState = {
                selectedDataSource: result,
                formState,
                scheduleState
            };
            console.log('步骤完成', settingState);
            onSettingFinished(true, settingState);
        });
    }
    return (
        <div className="dataset-guide">
            <Row>
                <Col span={4}></Col>
                <Col span={16}>
                    <Card title={<Typography.Title level={4}>开始你的数据集配置</Typography.Title>} bordered={false} >
                        <Steps current={currentStep} type="navigation" onChange={(current) => setCurrentStep(current)}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} subTitle={item.subTitle} />
                            ))}
                        </Steps>
                        <div className="steps-content">{steps[currentStep].content}</div>
                        <div className="steps-action">
                            {currentStep < steps.length - 1 && (
                                <Button type="primary" onClick={() => {
                                    setCurrentStep(currentStep + 1);
                                }}>
                                    下一步
                                </Button>
                            )}
                            {currentStep === steps.length - 1 && (
                                <Button type="primary" onClick={settingFinish}>
                                    完成
                                </Button>
                            )}
                            {currentStep > 0 && (
                                <Button style={{ marginLeft: 8 }} onClick={() => setCurrentStep(currentStep - 1)}>
                                    上一步
                                </Button>
                            )}
                        </div>
                    </Card>
                </Col>
                <Col span={4}></Col>
            </Row>
        </div>
    );
}

function DatasetEdit(props) {
    const { query, setQuery, isDirty, saveQuery } = useQuery(Query.newQuery());
    const dataSource = props.dataSource;
    const [schema, refreshSchema] = useDataSourceSchema(dataSource);
    const queryFlags = useQueryFlags(query, dataSource);
    const [parameters, areParametersDirty, updateParametersDirtyFlag] = useQueryParameters(query);
    const updateQuery = useUpdateQuery(query, setQuery);
    const updateQueryDescription = useUpdateQueryDescription(query, setQuery);
    const editSchedule = useEditScheduleDialog(query, setQuery);
    const isMobile = !useMedia({ minWidth: 768 });
    console.log('schema', schema);
    const reducer = (prevState, updatedProperty) => ({
        ...prevState,
        ...updatedProperty,
    });
    const [joinData, setJoinData] = useReducer(reducer, {
        nodes: [],
        edges: []
    });

    const graphRef = React.useRef(null);

    const [graph, setGraph] = useState(null);
    // let graph = null;

    useEffect(() => {
        if (!graph) {
            let graphObj = new G6.Graph({
                container: graphRef.current,
                width: 1200,
                height: 260,
                modes: {
                    default: ['drag-canvas', 'zoom-canvas']
                },
                defaultNode: {
                    type: 'modelRect',
                    size: [80, 40],
                    style: {
                        fill: '#f0f5ff',
                        stroke: '#adc6ff',
                        lineWidth: 2
                    }
                },
                defaultEdge: {
                    type: 'polyline',
                    style: {
                        radius: 10,
                        stroke: 'steelblue',
                    },
                },
                layout: {
                    type: 'dagre',
                    rankdir: 'LR'
                }
            });
            if (joinData.nodes.length > 0) {
                graphObj.data(cloneDeep(joinData));
                graphObj.render();
            }
            setGraph(graphObj);
        }
        console.log('执行副作用');
    }, []);

    // useEffect(() => {
    //     if (graph) {
    //         graph.read(cloneDeep(joinData));
    //     }
    // }, [joinData]);

    const [{ isOver }, dropRef] = useDrop({
        accept: 'dataset',
        drop: (item, monitor) => {
            console.log('上次数据', joinData);
            let nodes = joinData.nodes;
            let node = { id: nodes.length, data: item, label: item.data.name };
            nodes.push(node);
            // graph.addItem('node', cloneDeep(node));
            if (nodes.length > 1) {
                let edge = {
                    source: nodes[nodes.length - 2].id,
                    target: nodes[nodes.length - 1].id
                };
                joinData.edges.push(edge);
                // graph.addItem('edge', cloneDeep(edge));
            }
            console.log('本次数据', joinData);
            graph.clear();
            graph.read(cloneDeep(joinData));
            // graph.changeData(cloneDeep(joinData), false);
            // graph.render();
            setJoinData(joinData);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div className={cx("query-page-wrapper dataset-edit", { "query-fixed-layout": !isMobile })}>
            <main className="query-fullscreen edit-drag-drop">
                <Resizable direction="horizontal" sizeAttribute="flex-basis" toggleShortcut="Alt+Shift+D, Alt+D">
                    <nav>
                        <div className="editor__left__schema">
                            <SchemaBrowser
                                schema={schema}
                                onRefresh={() => refreshSchema(true)}
                            />
                        </div>
                        <div className="query-page-query-description">
                            <EditInPlace
                                isEditable={queryFlags.canEdit}
                                markdown
                                ignoreBlanks={false}
                                placeholder={__("Add description")}
                                value={query.description}
                                onDone={updateQueryDescription}
                                multiline
                            />
                        </div>
                    </nav>
                </Resizable>
                <div className={cx("content", { "drop-hover": isOver })} ref={dropRef}>
                    <div ref={graphRef}>
                        {joinData.nodes.length == 0 && <Typography.Title level={4}>把左侧数据集拖入此区域</Typography.Title>}
                    </div>
                </div>
            </main>
        </div>
    )
}


function Dataset(props) {
    const [isSettingFinshed, setIsSettingFinshed] = useState(false);
    const [settingState, setSettingState] = useState(null);

    function settingFinished(falg, settingState) {
        console.log('传入的数据', settingState);
        setIsSettingFinshed(falg);
        setSettingState(settingState);
    }

    return isSettingFinshed && settingState ? <DatasetEdit dataSource={settingState.selectedDataSource} /> : <DatasetSetting onError={props.onError} onSettingFinished={settingFinished} />
}


export default routeWithUserSession({
    path: "/dataset/new",
    render: pageProps => <Dataset {...pageProps} />,
    bodyClass: "fixed-layout",
});