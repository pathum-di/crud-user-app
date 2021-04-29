import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Col, Modal, Form, Input, Typography } from 'antd';
import { EditOutlined, HeartOutlined, HeartFilled, DeleteFilled, MailOutlined, PhoneOutlined, GlobalOutlined } from '@ant-design/icons';
import CONFIG from '../configs/endPoints.json';

const { Title } = Typography;

const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

export default class UserDataCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpenConfirmModal: false,
            isOpenEditModal: false,
            errorList: [],
            selectedUser: {},
        }
        this.wrapper = React.createRef();
    }

    handleConfirmModal = () => {
        this.setState({ isOpenConfirmModal: !this.state.isOpenConfirmModal });
    }

    handleEditModal = () => {
        this.setState({ isOpenEditModal: !this.state.isOpenEditModal, selectedUser: this.props.userData });
    }

    handleChange = (name, e) => {
        this.setState({ selectedUser: { ...this.state.selectedUser, [name]: e.target.value } })
    }

    getHeartButton = () => {
        const { userData } = this.props;
        return userData.isWishlisted === true ?
            <HeartFilled style={{ color: 'red' }} onClick={() => { this.props.handleWishListUser(userData.id) }} key="remove-wishlist" /> :
            <HeartOutlined style={{ color: 'red' }} onClick={() => { this.props.handleWishListUser(userData.id) }} key="add-wishlist" />
    }

    render() {

        const { isOpenConfirmModal, isOpenEditModal, /* errorList, */ selectedUser } = this.state;
        const { userData } = this.props;

        return (
            <Col ref={this.wrapper} xs={24} sm={24} md={12} lg={8} xl={6}>
                <Card cover={
                    <img
                        alt="user-profile"
                        src={`${CONFIG.avatar_url}/${userData.username}.svg?options[mood][]=happy`}
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                }

                    actions={[this.getHeartButton(),
                    <EditOutlined onClick={this.handleEditModal} key="edit" />,
                    <DeleteFilled onClick={this.handleConfirmModal} key="delete" />]
                    }>
                    <Title level={5}>{userData.name}</Title>
                    <div style={{ dispaly: 'flex', flexDirection: 'row' }}><p><MailOutlined />&nbsp;{userData.email}</p></div>
                    <div style={{ dispaly: 'flex', flexDirection: 'row' }}><p><PhoneOutlined /> &nbsp;{userData.phone}</p></div>
                    <div style={{ dispaly: 'flex', flexDirection: 'row' }}><p><GlobalOutlined />  &nbsp;{'http://' + userData.website}</p></div>

                </Card>

                {/* delete model confirmation */}

                <Modal
                    title='Please Confirm'
                    visible={isOpenConfirmModal}
                    onOk={() => { this.setState({ isOpenConfirmModal: false }, this.props.handleRemoveUser(userData)) }}
                    onCancel={this.handleConfirmModal}
                    destroyOnClose
                >
                    <p>Are you sure to delete ?</p>
                </Modal>

                {/* edit model */}

                <Modal
                    title="Edit User"
                    visible={isOpenEditModal}
                    onCancel={() => this.setState({ isOpenEditModal: false })}
                    onOk={() => { this.setState({ isOpenEditModal: false }, () => this.props.handleEditUser(selectedUser)) }}
                    destroyOnClose
                >
                    <Form
                        {...formLayout}
                        name="basic"
                        initialValues={selectedUser}
                    >
                        <Form.Item
                            value={selectedUser.name}
                            type="text"
                            name="name"
                            label="Name"
                            onChange={(e) => this.handleChange("name", e)}
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            value={selectedUser.email}
                            type="email"
                            onChange={(e) => this.handleChange("email", e)}
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Invalid email',
                                },
                                {
                                    required: true,
                                    message: 'This field is required',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            value={selectedUser.phone}
                            type="text"
                            onChange={(e) => this.handleChange("phone", e)}
                            label="Phone"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            value={selectedUser.website}
                            type="text"
                            onChange={(e) => this.handleChange("website", e)}
                            label="Website"
                            name="website"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>

            </Col>
        )
    }
}

UserDataCard.propTypes = {
    userData: PropTypes.object,
    handleWishListUser: PropTypes.func,
    handleEditUser: PropTypes.func,
    handleRemoveUser: PropTypes.func,
}
