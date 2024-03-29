﻿/* eslint-disable react/prop-types */
import React from "react";
import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";
import XAxisSettings from "./XAxisSettings";
import YAxisSettings from "./YAxisSettings";
import SeriesSettings from "./SeriesSettings";
import ColorsSettings from "./ColorsSettings";
import DataLabelsSettings from "./DataLabelsSettings";
import CustomChartSettings from "./CustomChartSettings";

import "./editor.less";

const isCustomChart = options => options.globalSeriesType === "custom";
const isPieChart = options => options.globalSeriesType === "pie";

export default createTabbedEditor([
  {
    key: "General",
    title: "常规",
    component: props => (
      <React.Fragment>
        <GeneralSettings {...props} />
        {isCustomChart(props.options) && <CustomChartSettings {...props} />}
      </React.Fragment>
    ),
  },
  {
    key: "XAxis",
    title: "X轴",
    component: XAxisSettings,
    isAvailable: options => !isCustomChart(options) && !isPieChart(options),
  },
  {
    key: "YAxis",
    title: "Y轴",
    component: YAxisSettings,
    isAvailable: options => !isCustomChart(options) && !isPieChart(options),
  },
  {
    key: "Series",
    title: "图表系列",
    component: SeriesSettings,
    isAvailable: options => !isCustomChart(options),
  },
  {
    key: "Colors",
    title: "颜色",
    component: ColorsSettings,
    isAvailable: options => !isCustomChart(options),
  },
  {
    key: "DataLabels",
    title: "数据标签",
    component: DataLabelsSettings,
    isAvailable: options => !isCustomChart(options),
  },
]);
