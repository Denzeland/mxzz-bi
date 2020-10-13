import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { Steps, Button, Modal, Row, Col, Card, Typography, Input, Radio, Form, Tooltip, Icon, DatePicker, Divider, Select, message, Tabs, Empty } from 'antd';
import NewScreenDialog from './NewScreenDialog';
import location from "@/services/location";

function Screen(props) {
    console.log('编辑大屏查询search', location.search);
    return (
        <Typography.Title level={2}>大屏编辑界面</Typography.Title>
        // NewScreenDialog.showModal()
    )
}

export default routeWithUserSession({
    path: "/screen",
    title: '编辑大屏',
    render: pageProps => <Screen {...pageProps} />,
    bodyClass: "fixed-layout",
});