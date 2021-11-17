import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { getReviews } from '../../api/review';
import Review from './review/Review';
import { useLocation, useNavigate } from 'react-router-dom';

const ReviewList = () => {
    const [reviews, setReviews] = useState();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(location.state === null) {
            navigate('/categories');
            return null;
        }
        getReviews(location.state.item.categoryId, location.state.item.id).then(response => response.json()).then(data => {
            data && setReviews(data)
        })
    }, [location.state, navigate])

    return (
        <Container className="mt-5">
            <Row xs={1} md={4} className="g-1">
                {reviews && reviews.map((review, _) => (
                    <div key={review.id}>
                        <Col>
                            <Review id={review.id} description={review.description} rating={review.rating} ></Review>
                        </Col>
                    </div>
                ))}
            </Row>
        </Container>
    )
}

export default ReviewList;