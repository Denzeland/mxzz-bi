import { isString, map, uniq, flatten, filter, sortBy, keys } from "lodash";
import React from "react";
import PropTypes from "prop-types";
import { Section, Select } from "@/components/visualizations/editor";

const MappingTypes = {
  x: { label: __("X Column") },
  y: { label: __("Y Columns"), multiple: true },
  series: { label: __("Group by") },
  yError: { label: __("Errors column") },
  size: { label: __("Bubble Size Column") },
  zVal: { label: __("Color Column") },
};

export default function ColumnMappingSelect({ value, availableColumns, type, onChange }) {
  const options = sortBy(filter(uniq(flatten([availableColumns, value])), v => isString(v) && v !== ""));
  const { label, multiple } = MappingTypes[type];

  return (
    <Section>
      <Select
        label={label}
        data-test={`Chart.ColumnMapping.${type}`}
        mode={multiple ? "multiple" : "default"}
        allowClear
        showSearch
        placeholder={multiple ? "选择列..." : "选择列..."}
        value={value || undefined}
        onChange={column => onChange(column || null, type)}>
        {map(options, c => (
          <Select.Option key={c} value={c} data-test={`Chart.ColumnMapping.${type}.${c}`}>
            {c}
          </Select.Option>
        ))}
      </Select>
    </Section>
  );
}

ColumnMappingSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  availableColumns: PropTypes.arrayOf(PropTypes.string),
  type: PropTypes.oneOf(keys(MappingTypes)),
  onChange: PropTypes.func,
};

ColumnMappingSelect.defaultProps = {
  value: null,
  availableColumns: [],
  type: null,
  onChange: () => {},
};

ColumnMappingSelect.MappingTypes = MappingTypes;
