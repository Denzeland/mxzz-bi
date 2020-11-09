import React from "react";
import ReactDOM from "react-dom";
import ApplicationArea from "@/components/ApplicationArea";

import "@/config";

import offlineListener from "@/services/offline-listener";

import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

ReactDOM.render(<DndProvider backend={HTML5Backend}><ConfigProvider locale={zhCN}><ApplicationArea /></ConfigProvider></DndProvider>, document.getElementById("application-root"), () => {
  offlineListener.init();
});
