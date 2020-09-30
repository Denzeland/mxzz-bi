import React from "react";
import ReactDOM from "react-dom";
import ApplicationArea from "@/components/ApplicationArea";

import "@/config";

import offlineListener from "@/services/offline-listener";

import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

<<<<<<< HEAD
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

=======
>>>>>>> 7c31801bf8ff4b7d19b4d13a1c9cadf8c9b559a0
ReactDOM.render(<DndProvider backend={HTML5Backend}><ConfigProvider locale={zhCN}><ApplicationArea /></ConfigProvider></DndProvider>, document.getElementById("application-root"), () => {
  offlineListener.init();
});
