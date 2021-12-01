import React, { useEffect, useState } from 'react';
import { Container, Table, Row, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../../api/user';
import { useSelector, useDispatch } from 'react-redux';
import { refreshTokenAction } from '../../redux/actions/userActions';
import UserData from './UserData';

const UserList = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.user);
    
    useEffect(() => {
        if (!currentUser.loggedIn && currentUser.data?.role !== "Admin") {
            navigate('/');
            return null;
        }
        const fetchData = async () => {
            const newToken = await dispatch(refreshTokenAction(currentUser));
            getUsers(newToken == null ? currentUser.token : newToken.token).then(response => response.json()).then(data => {
                data && setUsers(data)
            })
        }
        fetchData();
    }, [dispatch, navigate, currentUser])

    return (
        <div>
            <div className="top shadow">
                <Breadcrumb className="breadcrumb-bar">
                    <Breadcrumb.Item onClick={() => navigate('/')}><i className="fas fa-home"></i></Breadcrumb.Item>
                    <Breadcrumb.Item active>Users</Breadcrumb.Item>
                </Breadcrumb>
                <label><i className="fas fa-users"></i> User management</label>
            </div>
            <Container className="mt-5">
                <Row>
                    <Table responsive striped bordered hover variant="dark">
                        <thead>
                            <tr>
                                <th>Nr.</th>
                                <th>Role</th>
                                <th>First name</th>
                                <th>Last name</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.map((user, idx) => (
                                <UserData id={idx} user={user} currentUser={currentUser} />
                            ))}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </div>
    )
}

export default UserList;