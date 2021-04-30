import React, { Component } from 'react';
import { Row, Alert } from 'antd';
import './spinner.css';
import UserDataCard from './userDataCard';
import CONFIG from '../configs/endPoints.json';

export default class userList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userDataList: [],
            isLoading: false,
            selectedUserObj: {}
        }
    }

    componentDidMount() {
        this.initUserData();
    }

    initUserData = () => {
        this.setState({ isLoading: true });

        const apiUrl = `${CONFIG.server_url}/users`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(
                (data) => {
                    if (Array.isArray(data))
                        this.setState({ userDataList: data, isLoading: false });
                    else
                        this.setState({ userDataList: [], isLoading: false });
                },
                (error) => {
                    this.setState({ isLoading: false });
                    console.log('user fetch err ', error);
                })
    }

    handleEditUser = (selectedUser) => {

        const { userDataList } = this.state;
        let selectedUserIndex;

        for (let i = 0; i < userDataList.length; i++) {
            const user = userDataList[i];

            if (user.id === selectedUser.id) {
                selectedUserIndex = i;
            }
        }

        userDataList[selectedUserIndex] = selectedUser

        this.setState({ userDataList });

    }

    handleRemoveUser = (user) => {

        const { userDataList } = this.state;

        userDataList.splice(userDataList.indexOf(user), 1);
        this.setState({ userDataList });

    }

    handleWishListUser = (userId) => {

        const { userDataList } = this.state;
        let selectedUserIndex;
        let selectedUser;

        for (let i = 0; i < userDataList.length; i++) {
            const user = userDataList[i];

            if (user.id === userId) {
                selectedUser = user;
                selectedUserIndex = i;
            }
        }

        if (selectedUser && selectedUser.isWishlisted)
            selectedUser.isWishlisted = false;
        else
            selectedUser.isWishlisted = true;

        userDataList[selectedUserIndex] = selectedUser

        this.setState({ userDataList });

    }

    render() {
        const { isLoading, userDataList } = this.state;
        return (
            <div style={{ marginTop: '10px', marginLeft: '10px' }}>
                {isLoading ?
                    <div className="spinner"></div>
                    :
                    userDataList && userDataList.length > 0 ?

                        <Row gutter={[16, 16]} style={{width:'100%'}}>
                            {userDataList.map((user, index) =>
                                <UserDataCard key={index}
                                    userData={user}
                                    handleWishListUser={this.handleWishListUser}
                                    handleEditUser={this.handleEditUser}
                                    handleRemoveUser={this.handleRemoveUser} />)
                            }
                        </Row>
                        :
                        <Alert message="No users to show" type="info" />
                }

            </div>
        )
    }
}
