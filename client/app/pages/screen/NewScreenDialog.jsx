import { wrap as wrapDialog, DialogPropType } from "@/components/DialogWrapper";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Modal, Form, Icon, Input, Button, Tooltip, Row, Col, Radio } from 'antd';
import navigateTo from "@/components/ApplicationArea/navigateTo";
import Slider from "react-slick";
import './ScreenDialog.less';

function WizardForm(props) {
    const { getFieldDecorator } = props.form;
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        initialSlide: 0,
        centerMode: true,
    };

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
                            initialValue: "a",
                            rules: [{ required: true, message: '模板是必填项!' }],
                        })(<Radio.Group buttonStyle="solid" className="radio-slider-content">
                            <Slider {...settings}>
                                <div>
                                    <Radio.Button value="a" style={{ height: '100px', width: '100px', padding: 0, margin: 15 }}><img src="/static/images/empty.png" style={{ height: '100%', width: '100%', borderRadius: '4px 0 0 4px' }} /></Radio.Button>
                                </div>
                                <div>
                                    <Radio.Button value="b" style={{ height: '100px', width: '100px', padding: 0, margin: 15 }}><img src="/static/images/empty.png" style={{ height: '100%', width: '100%', borderRadius: '4px 0 0 4px' }} /></Radio.Button>
                                </div>
                                <div>
                                    <Radio.Button value="c" style={{ height: '100px', width: '100px', padding: 0, margin: 15 }}><img src="/static/images/empty.png" style={{ height: '100%', width: '100%', borderRadius: '4px 0 0 4px' }} /></Radio.Button>
                                </div>
                                <div>
                                    <Radio.Button value="d" style={{ height: '100px', width: '100px', padding: 0, margin: 15 }}><img src="/static/images/empty.png" style={{ height: '100%', width: '100%', borderRadius: '4px 0 0 4px' }} /></Radio.Button>
                                </div>
                                <div>
                                    <Radio.Button value="e" style={{ height: '100px', width: '100px', padding: 0, margin: 15 }}><img src="/static/images/empty.png" style={{ height: '100%', width: '100%', borderRadius: '4px 0 0 4px' }} /></Radio.Button>
                                </div>
                                <div>
                                    <Radio.Button value="f" style={{ height: '100px', width: '100px', padding: 0, margin: 15 }}><img src="/static/images/empty.png" style={{ height: '100%', width: '100%', borderRadius: '4px 0 0 4px' }} /></Radio.Button>
                                </div>
                            </Slider>
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
    const handleWizardFormRef = (ref) => {
        console.log('大屏向导表单', ref);
    }

    const save = () => {
        console.log('向导表单保存');
    }

    const dismiss = () => {
        dialog.dismiss();
    }

    return (
        <Modal
            {...dialog.props}
            wrapClassName="ant-modal-fullscreen"
            title="大屏初始化向导"
            okText={__("Save")}
            onOk={save}
            onCancel={dismiss}>
            <WrappedWizardForm ref={handleWizardFormRef} />
        </Modal>
    );
}

export default wrapDialog(NewScreenDialog);