import { Card, Badge, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import { NavLink } from "react-router-dom";
import DeleteModal from "../../../utilities/DeleteModal";
import { useState } from "react";
import "./review.css";

const Review = (props) => {
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const user = useSelector(state => state.user);
    
    return (
        <Card>
            <Card.Body>
                <div className="one-line">
                    <Card.Text className="writer">{props.user.firstName} {props.user.lastName} <Badge bg={props.user.role === "Admin" ? "primary" : "secondary"}>{props.user.role}</Badge></Card.Text>
                    <div className="button-group">
                        {user.loggedIn && (user.data.role === "Admin" || user.data.UserId === props.user.id) ? (
                            <div>
                                <Button variant="outline-danger" onClick={() => setDeleteModalShow(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                    </svg>
                                </Button>
                                <DeleteModal
                                    show={deleteModalShow}
                                    onHide={() => setDeleteModalShow(false)}
                                    categoryId={props.category.id}
                                    itemId={props.item.id}
                                    reviewId={props.review.id}
                                    type='REVIEW'
                                />
                            </div>
                        ) : ''}
                        {user.loggedIn && user.data.UserId === props.user.id ? (
                            <NavLink to="/reviews/form" state={{ edit: 1, ...props }} >
                                <Button variant="outline-warning">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                                    </svg>
                                </Button>
                            </NavLink>
                        ) : ''}
                    </div>
                </div>
                <hr />
                <div className="one-line">
                    <StarRatings
                        name="ratings"
                        starDimension="22px"
                        starSpacing="1px"
                        rating={props.review.rating}
                        starRatedColor="#eff312"
                        numberOfStars={5}
                    />
                    <Card.Text className="creation-date">{props.review.creationDate}</Card.Text>
                </div>
                <Card.Text></Card.Text>
                <Card.Title>{props.review.title}</Card.Title>
                <Card.Text>{props.review.description}</Card.Text>
                <hr />
                {user.loggedIn ? (
                    <div>
                        <button type="button" className="btn btn-success">Upvote</button>
                        <button type="button" className="btn btn-danger">Downvote</button>
                    </div>
                ) : ''}
            </Card.Body>
        </Card >
    );
}

export default Review;