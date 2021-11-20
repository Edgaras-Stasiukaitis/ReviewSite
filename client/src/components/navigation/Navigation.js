import React, { useState } from 'react';
import './Navigation.css'
import { NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { logoutAction } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../api/user';
import { loginAction } from '../../redux/actions/userActions';

const Navigation = () => {
    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const localUser = JSON.parse(localStorage.getItem("user"));

    if (!user.loggedIn && localUser && Object.keys(localUser).length !== 0) dispatch(loginAction(localUser));

    const signOut = async () => {
        await logout(user.token);
        dispatch(logoutAction());
        setExpanded(false);
    }

    return (
        <Navbar bg="dark" variant="dark" expand="md" expanded={expanded} sticky="top">
            <Container fluid>
                <Navbar.Brand>
                    <NavLink className="nav-link d-inline p-2 text-white" to="/">
                        Review
                    </NavLink>
                </Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink onClick={() => setExpanded(false)} className="nav-link d-inline p-2 bg-dark text-white" to="/categories">
                            Categories
                        </NavLink>
                    </Nav>
                    <Nav>
                        {user.loggedIn ? (
                            <div>
                                <span className="d-inline-flex justify-content-center align-items-center text-white" >Logged in as:<b>{user.data.UserName}</b></span>
                                <NavLink className="nav-link d-inline p-2" to="/">
                                    <button onClick={signOut} className="btn btn-danger btn-sm d-inline-flex justify-content-center align-items-center" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                        </svg>
                                        <span> Sign out</span>
                                    </button>
                                </NavLink>
                            </div>
                        ) : (
                            <div>
                                <NavLink onClick={() => setExpanded(false)} className="nav-link d-inline p-2" to="/register">
                                    <button className="btn btn-primary btn-sm d-inline-flex justify-content-center align-items-center" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                                        </svg>
                                        Register
                                    </button>
                                </NavLink>
                                <NavLink onClick={() => setExpanded(false)} className="nav-link d-inline p-2" to="/login">
                                    <button className="btn btn-success btn-sm d-inline-flex justify-content-center align-items-center" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z" />
                                            <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                        </svg>
                                        Login
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