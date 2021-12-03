import './Navigation.css'
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, NavDropdown, Container, Nav, Badge } from 'react-bootstrap';
import { logoutAction } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../api/user';
import { loginAction, refreshTokenAction } from '../../redux/actions/userActions';

const Navigation = () => {
    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const localUser = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    if (!user.loggedIn && localUser && Object.keys(localUser).length !== 0) dispatch(loginAction(localUser));

    const signOut = async () => {
        navigate('/');
        const newToken = await dispatch(refreshTokenAction(user));
        await logout(newToken == null ? user.token : newToken.token);
        dispatch(logoutAction());
        setExpanded(false);
    }

    return (
        <Navbar bg="dark" variant="dark" expand="md" expanded={expanded} sticky="top">
            <Container>
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
                                    <i className="fas fa-star"></i> Reviews
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
                            <NavDropdown className="text-white" title={<span className="text-white p-2 my-auto"><i className="fas fa-user"></i> {user.data.UserName}</span>} id="basic-nav-dropdown">
                                <NavDropdown.Item>Logged in as:</NavDropdown.Item>
                                <NavDropdown.Item><b>{user.data.FirstName} {user.data.LastName}</b></NavDropdown.Item>
                                <br />
                                <NavDropdown.Item>
                                    Role: {<Badge bg={user.data.role === "Admin" ? "primary" : "secondary"}>{user.data.role}</Badge>}
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={signOut}>
                                    <label className="nav-drop-down-sign-out"><i className="fas fa-sign-out-alt"></i> Sign out</label>
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <div>
                                <NavLink onClick={() => setExpanded(false)} className="remove-underline d-inline p-2" to="/register">
                                    <button className="btn btn-primary btn-sm" type="button">
                                        <i className="fas fa-user-plus"></i> Register
                                    </button>
                                </NavLink>
                                <NavLink onClick={() => setExpanded(false)} className="remove-underline d-inline p-2" to="/login">
                                    <button className="btn btn-success btn-sm" type="button">
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