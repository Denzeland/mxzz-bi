﻿import DetailsRenderer from "./DetailsRenderer";

const DEFAULT_OPTIONS = {};

export default {
  type: "DETAILS",
  name: "详情视图",
  getOptions: options => ({ ...DEFAULT_OPTIONS, ...options }),
  Renderer: DetailsRenderer,
  defaultColumns: 2,
  defaultRows: 2,
};
