import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";
import AppearanceSettings from "./AppearanceSettings";

export default createTabbedEditor([
  { key: "General", title: "常规", component: GeneralSettings },
  { key: "Appearance", title: "格式", component: AppearanceSettings },
]);
