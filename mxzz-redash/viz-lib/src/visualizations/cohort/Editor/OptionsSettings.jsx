import { map } from "lodash";
import React from "react";
import { Section, Select } from "@/components/visualizations/editor";
import { EditorPropTypes } from "@/visualizations/prop-types";

const CohortTimeIntervals = {
  daily: "每天",
  weekly: "每周",
  monthly: "每月",
};

const CohortModes = {
  //diagonal: "Fill gaps with zeros",
  diagonal: "用0填充空白",
  simple: "按原样显示数据",
  //simple: "Show data as is",
};

export default function OptionsSettings({ options, onOptionsChange }) {
  return (
    <React.Fragment>
      <Section>
        <Select
          layout="horizontal"
          label="时间间隔"
          data-test="Cohort.TimeInterval"
          value={options.timeInterval}
          onChange={timeInterval => onOptionsChange({ timeInterval })}>
          {map(CohortTimeIntervals, (name, value) => (
            <Select.Option key={value} data-test={"Cohort.TimeInterval." + value}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Section>

      <Section>
        <Select
          layout="horizontal"
          label="模式"
          data-test="Cohort.Mode"
          value={options.mode}
          onChange={mode => onOptionsChange({ mode })}>
          {map(CohortModes, (name, value) => (
            <Select.Option key={value} data-test={"Cohort.Mode." + value}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Section>
    </React.Fragment>
  );
}

OptionsSettings.propTypes = EditorPropTypes;
