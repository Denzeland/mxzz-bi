import Renderer from "./Renderer";
import Editor from "./Editor";

export default {
  type: "SANKEY",
  name: __("Sankey"),
  getOptions: options => ({ ...options }),
  Renderer,
  Editor,

  defaultRows: 7,
};
