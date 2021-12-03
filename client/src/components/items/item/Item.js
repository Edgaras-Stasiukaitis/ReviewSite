import React, { useEffect } from 'react';
import { Card, Button, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import FormModal from "../FormModal";
import DeleteModal from '../../../utilities/DeleteModal';
import './item.css';
import defaultItemImage from '../../../assets/defaultCategory.svg';
import StarRatings from 'react-star-ratings';
import { averageRating } from "../../../utilities/calculators";
import { getReviews } from '../../../api/review';

const Item = (props) => {
    const [reviews, setReviews] = useState();
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        getReviews(props.category.id, props.item.id).then(response => response.json()).then(data => {
            data && setReviews(data)
        })
    }, [props.category.id, props.item.id])

    return (
        <Card className="shadow">
            <NavLink className="remove-underline zoom-item" to="/reviews" state={{ ...props }} >
                <Card.Img className="fixed-image" variant="top" src={props.item.imageURL ? props.item.imageURL : defaultItemImage} />
            </NavLink>
            <Card.Body>
                <NavLink className="remove-underline" to="/reviews" state={{ ...props }} >
                    <Card.Title className="title" >{props.item.name}</Card.Title>
                </NavLink>
                <StarRatings
                    name="ratings"
                    starDimension="20px"
                    starSpacing="1px"
                    rating={averageRating(reviews)}
                    starRatedColor="#eff312"
                    numberOfStars={5}
                />
                <Card.Text></Card.Text>
                {user.loggedIn ? (
                    <NavLink className="remove-underline" to="/reviews/form" state={{ edit: 0, ...props }} >
                        <Button variant="primary"><i className="fas fa-pen"></i> Write a review</Button>
                    </NavLink>
                ) : ''}
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
                            categoryId={props.category.id}
                            itemId={props.item.id}
                            name={props.item.name}
                            type='items'
                        />
                    </Card.Body>
                ) : ''}
            </Card.Body>
        </Card>
    );
}

export default Item;