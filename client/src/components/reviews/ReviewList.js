import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { Container, Row, Col, Button, Breadcrumb, Alert } from 'react-bootstrap';
import { getReviews } from '../../api/review';
import Review from './review/Review';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { averageRating } from '../../utilities/calculators';
import './reviewList.css';

const ReviewList = () => {
    const [reviews, setReviews] = useState();
    const [width, setWidth] = useState(window.innerWidth);
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (location.state == null) return <Navigate to='/' />;
        getReviews(location.state?.category?.id, location.state?.item?.id).then(response => response.json()).then(data => {
            data && setReviews(data)
        })
    }, [location.state, navigate])

    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth));
        return () => window.removeEventListener("resize", () => setWidth(window.innerWidth))
    }, []);

    if (location.state == null) return <Navigate to='/' />;

    return (
        <div>
            <div className="top shadow">
                <Breadcrumb className="breadcrumb-bar">
                    <Breadcrumb.Item onClick={() => navigate('/')}><i className="fas fa-home"></i></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate('/categories')}>Categories</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate('/items', { state: location.state?.category })}>{location.state?.category?.name}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{location?.state?.item?.name}</Breadcrumb.Item>
                </Breadcrumb>
                <label>{location?.state?.item?.name} reviews <label className="count">({reviews?.length})</label></label>
                <p className="description">{location?.state?.item?.description}</p>
                <StarRatings
                    name="ratings"
                    starDimension="50px"
                    starSpacing="5px"
                    rating={averageRating(reviews)}
                    starRatedColor="#eff312"
                    numberOfStars={5}
                />
            </div>
            {reviews && reviews.length === 0 ? (
                <Container className={width >= 768 ? "mt-5 w-50" : "mt-4 w-100"}>
                    <Alert variant="info">
                        There are no reviews yet! Be the first one to <Button variant="primary" size="sm" onClick={() => user.loggedIn ? navigate("/reviews/form", { state: { from: "/reviews", edit: 0, ...location.state } }) : navigate('/login')}>
                            <i className="fas fa-pen"></i> review</Button> this item!
                    </Alert>
                </Container>
            ) : (
                <Container className={width >= 768 ? "mt-4 w-50" : "mt-4 w-100"}>
                    {user.loggedIn ? (
                        <div className="d-flex justify-content-start">
                            <Button variant="primary" onClick={() => navigate('/reviews/form', { state: {from: '/reviews', edit: 0, ...location.state} })}>
                                <i className="fas fa-pen"></i> Write a review
                            </Button>
                        </div>
                    ) : ''}
                    <Row className="mt-1 g-4">
                        {reviews && reviews.map((rev, _) => (
                            <div key={rev.review.id}>
                                <Col>
                                    <Review {...location.state} {...rev} ></Review>
                                </Col>
                            </div>
                        ))}
                    </Row>
                </Container>
            )}
        </div>
    )
}

export default ReviewList;