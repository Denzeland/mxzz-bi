import { wrap as wrapDialog, DialogPropType } from "@/components/DialogWrapper";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Modal, Form, Icon, Input, Button, Tooltip, Row, Col, Radio, Card } from 'antd';
import navigateTo from "@/components/ApplicationArea/navigateTo";
import Slider from "react-slick";
import './ScreenDialog.less';
import { template } from "lodash";

function WizardForm(props) {
    const { getFieldDecorator } = props.form;
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        // initialSlide: 0,
        // centerMode: true,
    };
    const templateAvailable = [{
        name: 'blank',
        imgSrc: '/static/images/empty.png'
    }, {
        name: 'templet01',
        imgSrc: '/static/images/templet-templet01-1.png'
    }];
    const templateRadios = templateAvailable.map((template) => {
        return (
            <div key={template.name}>
                <Radio.Button value={template.name} className='template-radio'><img src={template.imgSrc} style={{ height: '100%', width: '100%' }} /></Radio.Button>
            </div>
        )
    })

    return (
        <Row>
            <Col span={5}></Col>
            <Col span={14}>
                <Form layout="vertical">
                    <Form.Item label="数据大屏名称">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: '名称是必填项!' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label={
                        <span>
                            数据大屏描述&nbsp;
                            <Tooltip title="大屏的一个较详细的说明">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }>
                        {getFieldDecorator('description')(<Input type="textarea" />)}
                    </Form.Item>
                    <Form.Item label="数据大屏模板">
                        {getFieldDecorator('template', {
                            initialValue: templateAvailable[0].name,
                            rules: [{ required: true, message: '模板是必填项!' }],
                        })(<Radio.Group buttonStyle="solid" className="radio-slider-content">
                            <Slider {...settings}>
                                {templateRadios}
                                <div key="more">
                                    <Radio.Button disabled className='template-radio'>更多模板，敬请期待...</Radio.Button>
                                </div>
                            </Slider>
                        </Radio.Group>)}
                    </Form.Item>
                </Form>
            </Col>
            <Col span={5}></Col>
        </Row>
    )
}

const WrappedWizardForm = Form.create({ name: 'newScreenForm' })(WizardForm);

function NewScreenDialog({ dialog }) {
    let wizardFormRef = null;
    const handleWizardFormRef = (ref) => {
        console.log('大屏向导表单', ref);
        wizardFormRef = ref;
    }

    const save = () => {
        console.log('向导表单保存', wizardFormRef);
        const title = wizardFormRef.getForm().getFieldValue('title');
        const description = wizardFormRef.getForm().getFieldValue('description');
        const template = wizardFormRef.getForm().getFieldValue('template');
        dialog.close({
            title,
            description,
            template
        });
        navigateTo(`/screen?title=${title}&description=${description}&template=${template}`);
    }

    const dismiss = () => {
        dialog.dismiss();
    }

    return (
        <Modal
            {...dialog.props}
            wrapClassName="screen-modal-fullscreen"
            title="大屏初始化向导"
            okText={__("Save")}
            onOk={save}
            onCancel={dismiss}>
            <WrappedWizardForm ref={handleWizardFormRef} />
        </Modal>
    );
}

export default wrapDialog(NewScreenDialog);