import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap';
import { getReviews } from '../../api/user';
import { useNavigate } from 'react-router-dom';
import UserReview from './UserReview';

const UserReviewList = () => {
    const [reviews, setReviews] = useState();
    const [width, setWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (!user.loggedIn) {
            navigate('/');
            return null;
        }
        getReviews(user.data?.UserId).then(response => response.json()).then(data => {
            data && setReviews(data)
        })
    }, [navigate, user.loggedIn, user.data?.UserId])

    useEffect(() => {
        window.addEventListener("resize", () => setWidth(window.innerWidth));
        return () => window.removeEventListener("resize", () => setWidth(window.innerWidth))
    }, []);

    return (
        <div>
            <div className="top shadow">
                <Breadcrumb className="breadcrumb-bar">
                    <Breadcrumb.Item onClick={() => navigate('/')}><i className="fas fa-home"></i></Breadcrumb.Item>
                    <Breadcrumb.Item active>Reviews</Breadcrumb.Item>
                </Breadcrumb>
                <label><i className="fas fa-binoculars"></i> My reviews</label>
            </div>
            <Container className={width >= 850 ? "mt-4 w-50" : "mt-4 w-100"}>
                <Row className="mt-1 g-4">
                    {reviews && reviews.map((rev, _) => (
                        <div key={rev.review?.id}>
                            <Col>
                                <UserReview {...rev}></UserReview>
                            </Col>
                        </div>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default UserReviewList;