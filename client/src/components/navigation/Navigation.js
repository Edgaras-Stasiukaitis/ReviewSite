import './Navigation.css'
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Container, Nav, Badge } from 'react-bootstrap';
import { logoutAction } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../api/user';
import { loginAction, refreshTokenAction } from '../../redux/actions/userActions';
import { DropdownMenu, MenuItem } from 'react-bootstrap-dropdown-menu';

const Navigation = () => {
    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!user.loggedIn && localUser && Object.keys(localUser).length !== 0) dispatch(loginAction(localUser));

    const signOut = async () => {
        const newToken = await dispatch(refreshTokenAction(user));
        await logout(newToken == null ? user.token : newToken.token);
        dispatch(logoutAction());
        setExpanded(false);
    }

    return (
        <Navbar bg="dark" variant="dark" expand="md" expanded={expanded} sticky="top">
            <Container fluid>
                <Navbar.Brand>
                    <NavLink className="remove-underline d-inline p-2 text-white" to="/">
                        Review
                    </NavLink>
                </Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink onClick={() => setExpanded(false)} className="nav-link p-2 bg-dark text-white" to="/">
                            <div className="nav-link-text nav-link-text-ltr">
                                <i className="fas fa-home"></i> Home
                            </div>
                        </NavLink>
                        <NavLink onClick={() => setExpanded(false)} className="nav-link p-2 bg-dark text-white" to="/categories">
                            <div className="nav-link-text nav-link-text-ltr">
                                <i className="fas fa-layer-group"></i> Categories
                            </div>
                        </NavLink>
                        {user.loggedIn ? (
                            <NavLink onClick={() => setExpanded(false)} className="nav-link p-2 bg-dark text-white" to="/user/reviews">
                                <div className="nav-link-text nav-link-text-ltr">
                                    <i className="fas fa-binoculars"></i> Reviews
                                </div>
                            </NavLink>
                        ) : ''}
                        {user.loggedIn && user.data.role === "Admin" ? (
                            <NavLink onClick={() => setExpanded(false)} className="nav-link p-2 bg-dark text-white" to="/users">
                                <div className="nav-link-text nav-link-text-ltr">
                                    <i className="fas fa-users"></i> Users
                                </div>
                            </NavLink>
                        ) : ''}
                    </Nav>
                    <Nav>
                        {user.loggedIn ? (
                            <div>
                                <DropdownMenu userName="Chris Smith" iconColor='#00FF00'>
                                    <MenuItem text="Home" location="/home" />
                                    <MenuItem text="Edit Profile" location="/profile" />
                                    <MenuItem text="Change Password" location="/change-password" />
                                    <MenuItem text="Privacy Settings" location="/privacy-settings" />
                                    <MenuItem text="Logout" />
                                </DropdownMenu>
                                <Navbar.Text className="remove-underline d-inline p-2 text-white">
                                    <Badge bg={user.data.role === "Admin" ? "primary" : "secondary"}>{user.data.role}</Badge> <b>{user.data.UserName}</b>
                                </Navbar.Text>
                                <NavLink className="remove-underline d-inline p-2" to="/">
                                    <button onClick={signOut} className="btn btn-outline-danger" type="button">
                                        <i className="fas fa-sign-out-alt"></i> Sign out
                                    </button>
                                </NavLink>
                            </div>
                        ) : (
                            <div>
                                <NavLink onClick={() => setExpanded(false)} className="remove-underline d-inline p-2" to="/register">
                                    <button className="btn btn-primary" type="button">
                                        <i className="fas fa-user-plus"></i> Register
                                    </button>
                                </NavLink>
                                <NavLink onClick={() => setExpanded(false)} className="remove-underline d-inline p-2" to="/login">
                                    <button className="btn btn-success" type="button">
                                        <i className="fas fa-sign-in-alt"></i> Login
                                    </button>
                                </NavLink>
                            </div>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;