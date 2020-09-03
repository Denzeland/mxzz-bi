import { includes } from "lodash";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Section, Input, Checkbox, ContextHelp } from "@/components/visualizations/editor";
import { EditorPropTypes } from "@/visualizations/prop-types";

export default function DataLabelsSettings({ options, onOptionsChange }) {
  const isShowDataLabelsAvailable = includes(
    ["line", "area", "column", "scatter", "pie", "heatmap"],
    options.globalSeriesType
  );

  const [debouncedOnOptionsChange] = useDebouncedCallback(onOptionsChange, 200);

  // 2020-8-18 寒芜 修改Chart 数据显示标签
  return (
    <React.Fragment>
      {isShowDataLabelsAvailable && (
        <Section>
          <Checkbox
            data-test="Chart.DataLabels.ShowDataLabels"
            defaultChecked={options.showDataLabels}
            onChange={event => onOptionsChange({ showDataLabels: event.target.checked })}>
            显示数据标签
          </Checkbox>
        </Section>
      )}

      <Section>
        <Input
          label={
            <React.Fragment>
              数值格式
              <ContextHelp.NumberFormatSpecs />
            </React.Fragment>
          }
          data-test="Chart.DataLabels.NumberFormat"
          defaultValue={options.numberFormat}
          onChange={e => debouncedOnOptionsChange({ numberFormat: e.target.value })}
        />
      </Section>

      <Section>
        <Input
          label={
            <React.Fragment>
              百分比值的格式
              <ContextHelp.NumberFormatSpecs />
            </React.Fragment>
          }
          data-test="Chart.DataLabels.PercentFormat"
          defaultValue={options.percentFormat}
          onChange={e => debouncedOnOptionsChange({ percentFormat: e.target.value })}
        />
      </Section>

      <Section>
        <Input
          label={
            <React.Fragment>
              日期/时间值的格式
              <ContextHelp.DateTimeFormatSpecs />
            </React.Fragment>
          }
          data-test="Chart.DataLabels.DateTimeFormat"
          defaultValue={options.dateTimeFormat}
          onChange={e => debouncedOnOptionsChange({ dateTimeFormat: e.target.value })}
        />
      </Section>

      <Section>
        <Input
          label={
            <React.Fragment>
              数据标签
              <ContextHelp placement="topRight" arrowPointAtCenter>
                <div style={{ paddingBottom: 5 }}>使用特殊名称访问其他属性:</div>
                <div>
                  <code>{"{{ @@name }}"}</code> series name;
                </div>
                <div>
                  <code>{"{{ @@x }}"}</code> x-value;
                </div>
                <div>
                  <code>{"{{ @@y }}"}</code> y-value;
                </div>
                <div>
                  <code>{"{{ @@yPercent }}"}</code> relative y-value;
                </div>
                <div>
                  <code>{"{{ @@yError }}"}</code> y deviation;
                </div>
                <div>
                  <code>{"{{ @@size }}"}</code> bubble size;
                </div>
                <div style={{ paddingTop: 5 }}>
                  此外，可以引用所有查询结果列
                  <br />
                  使用
                  <code style={{ whiteSpace: "nowrap" }}>{"{{ 列名 }}"}</code> 语法.
                </div>
              </ContextHelp>
            </React.Fragment>
          }
          data-test="Chart.DataLabels.TextFormat"
          placeholder="(自定义)"
          defaultValue={options.textFormat}
          onChange={e => debouncedOnOptionsChange({ textFormat: e.target.value })}
        />
      </Section>
    </React.Fragment>
  );
}

DataLabelsSettings.propTypes = EditorPropTypes;
