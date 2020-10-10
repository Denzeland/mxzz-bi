import React, { useState, useEffect, useReducer, useCallback } from "react";
import routeWithUserSession from "@/components/ApplicationArea/routeWithUserSession";
import { Steps, Button, Modal, Row, Col, Card, Typography, Input, Radio, Form, Tooltip, Icon, DatePicker, Divider, Select, message, Tabs, Empty } from 'antd';

function Screen(props) {
    return (
        <Typography.Title level={2}>大屏编辑界面</Typography.Title>
    )
}

export default routeWithUserSession({
    path: "/screen/new",
    title: '编辑大屏',
    render: pageProps => <Screen {...pageProps} />,
    bodyClass: "fixed-layout",
});