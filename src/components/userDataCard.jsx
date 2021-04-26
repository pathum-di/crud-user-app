import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Modal, Form } from 'react-bootstrap';
import { AiFillEdit, AiOutlineHeart, AiFillHeart, AiFillDelete, AiOutlineMail, AiOutlinePhone, AiOutlineGlobal } from "react-icons/ai";
import CONFIG from '../configs/endPoints.json';

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

    render() {

        const { isOpenConfirmModal, isOpenEditModal, errorList, selectedUser } = this.state;
        const { userData } = this.props;
        // console.log('state in render ', this.state);
        return (
            <Col ref={this.wrapper} xs={12} md={3}>
                <Card className="m-1">
                    <Card.Img style={{ backgroundColor: '#f5f5f5' }} variant="top" src={`${CONFIG.avatar_url}/${userData.username}.svg?options[mood][]=happy`} />
                    <Card.Body>
                        <Card.Title>{userData.name}</Card.Title>
                        <AiOutlineMail /><Card.Text>  &nbsp;{userData.email}</Card.Text>
                        <AiOutlinePhone /><Card.Text>  &nbsp;{userData.phone}</Card.Text>
                        <AiOutlineGlobal /><Card.Text>  &nbsp;{'http://' + userData.website}</Card.Text>

                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={() => { this.props.handleWishListUser(userData.id) }} className="m-1" variant="danger" size="sm">
                            {userData.isWishlisted ? <AiFillHeart /> : <AiOutlineHeart />}
                        </Button>
                        <Button onClick={this.handleEditModal} className="m-1" variant="primary" size="sm">
                            <AiFillEdit />
                        </Button>
                        <Button onClick={this.handleConfirmModal} className="m-1" variant="secondary" size="sm">
                            <AiFillDelete />
                        </Button>
                    </Card.Footer>
                </Card>

                {isOpenConfirmModal ?
                    <Modal
                        animation={false}
                        size="sm"
                        show={isOpenConfirmModal}
                        onHide={this.handleConfirmModal}
                        centered
                        aria-labelledby="confirm-modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="confirm-modal"> {'Are you sure?'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleConfirmModal}>Cancel</Button>
                            <Button variant="primary" onClick={() => { this.setState({ isOpenConfirmModal: false }, this.props.handleRemoveUser(userData)) }}>Confirm</Button>
                        </Modal.Footer>
                    </Modal>
                    : false}




                {isOpenEditModal ?
                    <Modal
                        animation={false}
                        size="md"
                        show={isOpenEditModal}
                        onHide={() => this.setState({ isOpenEditModal: false })}
                        centered
                        aria-labelledby="confirm-modal"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="confirm-modal"> {'Edit User'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="validationCustom01">
                                    <Form.Row>
                                        <Form.Label sm="2" column>{'Name'}</Form.Label>
                                        <Col>
                                            <Form.Control isInvalid={errorList.find(err => err.name === "name")} name="name" required value={selectedUser.name} onChange={this.handleChange} size="sm" type="text" />
                                            <Form.Control.Feedback type="invalid">{errorList.find(err => err.name === "name") ? errorList.find(err => err.name === "name").mesage : ''}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row>
                                        <Form.Label sm="2" column>{'Email'}</Form.Label>
                                        <Col>
                                            <Form.Control isInvalid={errorList.find(err => err.name === "email")} onChange={this.handleChange} name="email" required value={selectedUser.email} size="sm" type="email" />
                                            <Form.Control.Feedback type="invalid">{errorList.find(err => err.name === "email") ? errorList.find(err => err.name === "email").mesage : ''}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row>
                                        <Form.Label sm="2" column>{'Phone'}</Form.Label>
                                        <Col>
                                            <Form.Control isInvalid={errorList.find(err => err.name === "phone")} onChange={this.handleChange} name="phone" required value={selectedUser.phone} size="sm" type="text" />
                                            <Form.Control.Feedback type="invalid">{errorList.find(err => err.name === "phone") ? errorList.find(err => err.name === "phone").mesage : ''}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Row>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Row>
                                        <Form.Label sm="2" column>{'Website'}</Form.Label>
                                        <Col>
                                            <Form.Control isInvalid={errorList.find(err => err.name === "website")} onChange={this.handleChange} name="website" required value={selectedUser.website} size="sm" type="text" />
                                            <Form.Control.Feedback type="invalid">{errorList.find(err => err.name === "website") ? errorList.find(err => err.name === "website").mesage : ''}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Row>
                                </Form.Group>
                                <Button variant="secondary" onClick={this.handleEditModal}>Cancel</Button>
                                <Button onClick={() => { this.setState({ isOpenEditModal: false }, this.props.handleEditUser(selectedUser)) }} disabled={errorList.length > 0 ? true : false} variant="primary">OK</Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    : false
                }
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
