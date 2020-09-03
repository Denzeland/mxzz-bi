import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import ColumnsSettings from "./ColumnsSettings";
import GridSettings from "./GridSettings";

import "./editor.less";

export default createTabbedEditor([
  { key: "Columns", title: __("Columns"), component: ColumnsSettings },
  { key: "Grid", title: __("Grid"), component: GridSettings },
]);
