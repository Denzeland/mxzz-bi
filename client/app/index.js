import React from "react";
import ReactDOM from "react-dom";
import ApplicationArea from "@/components/ApplicationArea";

import "@/config";

import offlineListener from "@/services/offline-listener";

import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';

ReactDOM.render(<ConfigProvider locale={zhCN}><ApplicationArea /></ConfigProvider>, document.getElementById("application-root"), () => {
  offlineListener.init();
});
