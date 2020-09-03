import createTabbedEditor from "@/components/visualizations/editor/createTabbedEditor";

import GeneralSettings from "./GeneralSettings";
import GroupsSettings from "./GroupsSettings";
import FormatSettings from "./FormatSettings";
import StyleSettings from "./StyleSettings";

export default createTabbedEditor([
  { key: "General", title: __("General"), component: GeneralSettings },
  { key: "Groups", title: __("Groups"), component: GroupsSettings },
  { key: "Format", title: __("Format"), component: FormatSettings },
  { key: "Style", title: __("Style"), component: StyleSettings },
]);
