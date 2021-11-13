import React, { useState } from 'react';
import './Navigation.css'
import { NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { logoutAction } from '../../redux/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../api/user';

const Navigation = () => {
    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const signOut = async () => {
        const result = await logout(user.token);
        if(result.ok) dispatch(logoutAction());
        setExpanded(false);
    }

    return (
        <Navbar bg="dark" variant="dark" expand="md" expanded={expanded} sticky="top">
            <Container fluid>
                <Navbar.Brand>
                    <NavLink className="nav-link d-inline p-2 bg-dark text-white" to="/">
                        Review
                    </NavLink>
                </Navbar.Brand>
                <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <NavLink onClick={() => setExpanded(false)} className="nav-link d-inline p-2 bg-dark text-white" to="/categories">
                            Categories
                        </NavLink>
                        <NavLink onClick={() => setExpanded(false)} className="nav-link d-inline p-2 bg-dark text-white" to="/items">
                            Items
                        </NavLink>
                        <NavLink onClick={() => setExpanded(false)} className="nav-link d-inline p-2 bg-dark text-white" to="/reviews">
                            Reviews
                        </NavLink>
                    </Nav>
                    <Nav>
                        {user.loggedIn ? (
                            <><span className="d-inline p-2 bg-dark text-white" >Logged in as: <b>{user.data.UserName}</b></span>
                            <NavLink className="d-inline p-2" to="/">
                                <button onClick={signOut} className="btn btn-danger btn-sm" type="button">
                                    Logout
                                </button>
                            </NavLink></>
                        ) : (
                            <>
                            <NavLink onClick={() => setExpanded(false)} className="d-inline p-2" to="/register">
                                <button className="btn btn-primary btn-sm" type="button">
                                    Register
                                </button>
                            </NavLink>
                            <NavLink onClick={() => setExpanded(false)} className="d-inline p-2" to="/login">
                                <button className="btn btn-success btn-sm" type="button">
                                    Login
                                </button>
                            </NavLink></>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation;