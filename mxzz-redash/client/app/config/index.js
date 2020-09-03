import moment from "moment";
import 'moment/locale/zh-cn';
import * as Pace from "pace-progress";
import { isFunction } from "lodash";
import url from "@/services/url";

// Ensure that this image will be available in assets folder
import "@/assets/images/avatar.svg";

// Register visualizations
import "@redash/viz/lib";

import "./antd-spinner";

Pace.options.shouldHandlePushState = (prevUrl, newUrl) => {
  // Show pace progress bar only if URL path changed; when query params
  // or hash changed - ignore that history event
  prevUrl = url.parse(prevUrl);
  newUrl = url.parse(newUrl);
  return prevUrl.pathname !== newUrl.pathname;
};

moment.locale('zh-cn');
moment.updateLocale("en", {
  relativeTime: {
    future: "%s",
    past: "%s",
    s: __("just now"),
    m: __("a minute ago"),
    mm: __("%d minutes ago"),
    h: __("an hour ago"),
    hh: __("%d hours ago"),
    d: __("a day ago"),
    dd: __("%d days ago"),
    M: __("a month ago"),
    MM: __("%d months ago"),
    y: __("a year ago"),
    yy: __("%d years ago"),
  },
});

function requireImages() {
  // client/app/assets/images/<path> => /images/<path>
  const ctx = require.context("@/assets/images/", true, /\.(png|jpe?g|gif|svg)$/);
  ctx.keys().forEach(ctx);
}

function registerExtensions() {
  const context = require.context("extensions", true, /^((?![\\/.]test[\\./]).)*\.jsx?$/);
  const modules = context
    .keys()
    .map(context)
    .map(module => module.default);

  return modules
    .filter(isFunction)
    .filter(f => f.init)
    .map(f => f());
}

requireImages();
registerExtensions();
