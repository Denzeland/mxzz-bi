import React from "react";
import { useDebouncedCallback } from "use-debounce";
import { Section, Input, Checkbox, ContextHelp } from "@/components/visualizations/editor";
import { EditorPropTypes } from "@/visualizations/prop-types";

export default function AppearanceSettings({ options, onOptionsChange }) {
  const [debouncedOnOptionsChange] = useDebouncedCallback(onOptionsChange, 200);

  return (
    <React.Fragment>
      <Section>
        <Input
          layout="horizontal"
          label="时间标题"
          defaultValue={options.timeColumnTitle}
          onChange={e => debouncedOnOptionsChange({ timeColumnTitle: e.target.value })}
        />
      </Section>
      <Section>
        <Input
          layout="horizontal"
          label="统计值标题"
          defaultValue={options.peopleColumnTitle}
          onChange={e => debouncedOnOptionsChange({ peopleColumnTitle: e.target.value })}
        />
      </Section>
      <Section>
        <Input
          layout="horizontal"
          label={
            <React.Fragment>
              层级标题格式
              <ContextHelp placement="topRight" arrowPointAtCenter>
                <div>
                  用 <code>{"{{ @ }}"}</code> 插入一个阶段编号
                </div>
              </ContextHelp>
            </React.Fragment>
          }
          defaultValue={options.stageColumnTitle}
          onChange={e => debouncedOnOptionsChange({ stageColumnTitle: e.target.value })}
        />
      </Section>

      <Section>
        <Input
          layout="horizontal"
          label={
            <React.Fragment>
              数值格式
              <ContextHelp.NumberFormatSpecs />
            </React.Fragment>
          }
          defaultValue={options.numberFormat}
          onChange={e => debouncedOnOptionsChange({ numberFormat: e.target.value })}
        />
      </Section>
      <Section>
        <Input
          layout="horizontal"
          label={
            <React.Fragment>
              百分比值的格式
              <ContextHelp.NumberFormatSpecs />
            </React.Fragment>
          }
          defaultValue={options.percentFormat}
          onChange={e => debouncedOnOptionsChange({ percentFormat: e.target.value })}
        />
      </Section>

      <Section>
        <Input
          layout="horizontal"
          label="没有值占位符"
          defaultValue={options.noValuePlaceholder}
          onChange={e => debouncedOnOptionsChange({ noValuePlaceholder: e.target.value })}
        />
      </Section>

      <Section>
        <Checkbox
          defaultChecked={options.showTooltips}
          onChange={event => onOptionsChange({ showTooltips: event.target.checked })}>
          显示工具提示
        </Checkbox>
      </Section>
      <Section>
        <Checkbox
          defaultChecked={options.percentValues}
          onChange={event => onOptionsChange({ percentValues: event.target.checked })}>
          将值标准化到百分比
        </Checkbox>
      </Section>
    </React.Fragment>
  );
}

AppearanceSettings.propTypes = EditorPropTypes;
