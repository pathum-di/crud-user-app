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

const emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
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

    handleChange = (e) => {
        const name = e.target.name;
        this.setState({ selectedUser: { ...this.state.selectedUser, [name]: e.target.value } }, () => { this.checkValidations(name); })
    }

    checkValidations = (name) => {
        const { selectedUser, errorList } = this.state;
        const er = errorList.find(error => error.name === name);

        if (er) {
            const errIndex = errorList.indexOf(er);

            if (selectedUser[name] !== '' && name !== 'email') {
                errorList.splice(errIndex, 1);
                this.setState({ errorList });
                return;
            }

            if (name === 'email' && selectedUser.email !== '' && emailReg.test(selectedUser.email)) {
                errorList.splice(errIndex, 1);
                this.setState({ errorList });
                return;
            }

            if (selectedUser[name] === '') {
                errorList[errIndex] = { name, mesage: 'This field is required' };
                this.setState({ errorList });
                return;
            }

            if (name === 'email' && selectedUser.email !== '' && !emailReg.test(selectedUser.email)) {
                errorList[errIndex] = { name, mesage: 'Invalid email' };
                this.setState({ errorList });
                return;
            }

        }

        else {

            if (selectedUser[name] === '') {
                errorList.push({ name, mesage: 'This field is required' });
                this.setState({ errorList });
                return;
            }

            if (name === 'email' && selectedUser.email !== '' && !emailReg.test(selectedUser.email)) {
                errorList.push({ name, mesage: 'Invalid email' });
                this.setState({ errorList });
                return;
            }
        }

    }

    getErrorMessage = (compName) => {
        const errObj = this.state.errorList.find(err => err.name === compName);
        return errObj ? errObj.mesage : '';
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
        // console.log('state in render ', this.state);
        return (
            <Col ref={this.wrapper} span={{ xs: 12, sm: 12, md: 12, lg: 8, xl: 6 }}>
                <Card cover={
                    <img
                        alt="user-profile"
                        src={`${CONFIG.avatar_url}/${userData.username}.svg?options[mood][]=happy`}
                        style={{ backgroundColor: '#f5f5f5' }}
                    />
                }
                    // title={userData.name}

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
                >
                    <p>Are you sure to delete ?</p>
                </Modal>

                {/* edit model */}

                <Modal
                    title="Edit User"
                    visible={isOpenEditModal}
                    onCancel={() => this.setState({ isOpenEditModal: false })}
                    onOk={() => { this.setState({ isOpenEditModal: false }, this.props.handleEditUser(selectedUser)) }}
                >
                    <Form
                        {...formLayout}
                        name="basic"
                        initialValues={selectedUser}
                    // onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            value={selectedUser.name}
                            type="text"
                            onChange={this.handleChange}
                            label="Name"
                            name="name"
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
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
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
                    {/* <Modal.Header closeButton>
                        <Modal.Title id="confirm-modal"> {'Edit User'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="validationCustom01">
                                <Form.Row>
                                    <Form.Label sm="2" column>{'Name'}</Form.Label>
                                    <Col>
                                        <Form.Control isInvalid={errorList.find(err => err.name === "name")} name="name" required value={selectedUser.name} onChange={this.handleChange} size="sm" type="text" />
                                        <Form.Control.Feedback type="invalid">{this.getErrorMessage("name")}</Form.Control.Feedback>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                            <Form.Group>
                                <Form.Row>
                                    <Form.Label sm="2" column>{'Email'}</Form.Label>
                                    <Col>
                                        <Form.Control isInvalid={errorList.find(err => err.name === "email")} onChange={this.handleChange} name="email" required value={selectedUser.email} size="sm" type="email" />
                                        <Form.Control.Feedback type="invalid">{this.getErrorMessage("email")}</Form.Control.Feedback>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                            <Form.Group>
                                <Form.Row>
                                    <Form.Label sm="2" column>{'Phone'}</Form.Label>
                                    <Col>
                                        <Form.Control isInvalid={errorList.find(err => err.name === "phone")} onChange={this.handleChange} name="phone" required value={selectedUser.phone} size="sm" type="text" />
                                        <Form.Control.Feedback type="invalid">{this.getErrorMessage("phone")}</Form.Control.Feedback>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                            <Form.Group>
                                <Form.Row>
                                    <Form.Label sm="2" column>{'Website'}</Form.Label>
                                    <Col>
                                        <Form.Control isInvalid={errorList.find(err => err.name === "website")} onChange={this.handleChange} name="website" required value={selectedUser.website} size="sm" type="text" />
                                        <Form.Control.Feedback type="invalid">{this.getErrorMessage("website")}</Form.Control.Feedback>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                            <div style={{ display: 'flex', flexDirection: 'row', float: "right" }}>
                                <Button className="m-1" variant="outline-primary" onClick={this.handleEditModal} size="sm">Cancel</Button>
                                <Button className="m-1" onClick={() => { this.setState({ isOpenEditModal: false }, this.props.handleEditUser(selectedUser)) }} disabled={errorList.length > 0 ? true : false} variant="primary" size="sm">OK</Button>
                            </div>
                        </Form>
                    </Modal.Body> */}
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
