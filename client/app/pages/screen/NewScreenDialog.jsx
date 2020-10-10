import { wrap as wrapDialog, DialogPropType } from "@/components/DialogWrapper";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Modal, Form, Icon, Input, Button, Tooltip } from 'antd';

function WizardForm(props) {
    const { getFieldDecorator } = props.form;

    return (
        <Row>
            <Col span={6}></Col>
            <Col span={12}>
                <Form layout="vertical">
                    <Form.Item label="数据大屏名称">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '名称是必填项!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label={
                        <span>
                            数据集描述&nbsp;
                            <Tooltip title="数据集的一个较详细的说明">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }>
                        {getFieldDecorator('description')(<Input type="textarea" />)}
                    </Form.Item>
                    <Form.Item label="数据大屏模板">
                        {getFieldDecorator('template', {
                            rules: [{ required: true, message: '模板是必填项!' }],
                        })(<Radio.Group defaultValue="a" buttonStyle="solid">
                            <Radio.Button value="a" style={{ height: '60px', width: '60px', padding: 0, margin: 15 }}><img src="/static/images/empty.png" style={{ height: '100%', width: '100%', borderRadius: '4px 0 0 4px' }} /></Radio.Button>
                        </Radio.Group>)}
                    </Form.Item>
                </Form>
            </Col>
            <Col span={6}></Col>
        </Row>
    )
}

const WrappedWizardForm = Form.create({ name: 'newScreenForm' })(WizardForm);

function NewScreenDialog({ dialog }) {
    return (
        <Modal
            {...dialog.props}
            wrapClassName="ant-modal-fullscreen"
            title="大屏初始化向导"
            okText={__("Save")}
            onOk={save}
            onCancel={dismiss}>
            <WrappedWizardForm />
        </Modal>
    );
}

export default wrapDialog(NewScreenDialog);

