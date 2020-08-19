import React from "react";
import enzyme from "enzyme";

import getOptions from "../getOptions";
import DataLabelsSettings from "./DataLabelsSettings";

function findByTestID(wrapper, testId) {
  return wrapper.find(`[data-test="${testId}"]`);
}

function mount(options, done) {
  options = getOptions(options);
  return enzyme.mount(
    <DataLabelsSettings
      visualizationName="Test"
      data={{ columns: [], rows: [] }}
      options={options}
      onOptionsChange={changedOptions => {
        expect(changedOptions).toMatchSnapshot();
        done();
      }}
    />
  );
}

// 2020-8-18 寒芜 修改chart图 显示数据标签选项
describe("Visualizations -> Chart -> Editor -> Data Labels Settings", () => {
  //test("Sets Show Data Labels option", done => {
  test("显示数据标签选项", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        showDataLabels: false,
      },
      done
    );

    findByTestID(el, "Chart.DataLabels.ShowDataLabels")
      .last()
      .find("input")
      .simulate("change", { target: { checked: true } });
  });

  //test("Changes number format", done => {
  test("改变数字格式", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        numberFormat: "0[.]0000",
      },
      done
    );

    findByTestID(el, "Chart.DataLabels.NumberFormat")
      .last()
      .simulate("change", { target: { value: "0.00" } });
  });

  test("Changes percent values format", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        percentFormat: "0[.]00%",
      },
      done
    );

    findByTestID(el, "Chart.DataLabels.PercentFormat")
      .last()
      .simulate("change", { target: { value: "0.0%" } });
  });

  test("Changes date/time format", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
      },
      done
    );

    findByTestID(el, "Chart.DataLabels.DateTimeFormat")
      .last()
      .simulate("change", { target: { value: "YYYY MMM DD" } });
  });

  test("Changes data labels format", done => {
    const el = mount(
      {
        globalSeriesType: "column",
        textFormat: null,
      },
      done
    );

    findByTestID(el, "Chart.DataLabels.TextFormat")
      .last()
      .simulate("change", { target: { value: "{{ @@x }} :: {{ @@y }} / {{ @@yPercent }}" } });
  });
});
