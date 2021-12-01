import React from 'react';
import { Card, Dropdown } from 'react-bootstrap';
import './category.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import FormModal from '../FormModal';
import DeleteModal from '../../../utilities/DeleteModal';
import { NavLink } from 'react-router-dom';
import defaultCategoryImage from '../../../assets/defaultCategory.svg';

const Category = (props) => {
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const user = useSelector(state => state.user);

    return (
        <Card className="text-center shadow zoom">
            <NavLink className="remove-underline" to="/items" state={{ ...props }} >
                <Card.Img className="fixed-image" variant="top" src={props.imageURL ? props.imageURL : defaultCategoryImage} />
                <Card.Body>
                    <Card.Title className="title">{props.name}</Card.Title>
                </Card.Body>
            </NavLink>
            {user.loggedIn && user.data.role === "Admin" ? (
                    <Card.Body className="admin-buttons">
                        <Dropdown className="full-opacity">
                            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
                                <i className="fas fa-cog"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={() => setEditModalShow(true)}><i className="fas fa-edit"></i> Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => setDeleteModalShow(true)}><i className="fas fa-trash"></i> Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <FormModal
                            show={editModalShow}
                            edit={1}
                            onHide={() => setEditModalShow(false)}
                            {...props}
                        />
                        <DeleteModal
                            show={deleteModalShow}
                            onHide={() => setDeleteModalShow(false)}
                            categoryId={props.id}
                            name={props.name}
                            type='categories'
                        />
                    </Card.Body>
            ) : ''}
        </Card>
    );
}

export default Category;