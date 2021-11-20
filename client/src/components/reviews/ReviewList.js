import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { getReviews } from '../../api/review';
import Review from './review/Review';
import { useLocation, useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';

const ReviewList = () => {
    const [reviews, setReviews] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(location.state === null) {
            navigate('/items');
            return null;
        }
        getReviews(location.state.category.id, location.state.item.id).then(response => response.json()).then(data => {
            data && setReviews(data)
        })
    }, [location.state, navigate])
    
    const averageRating = (reviews) => {
        if(reviews == null) return 0;
        return (reviews.map((r, _) => r.review.rating).reduce((sum, a) => sum + a, 0)) / reviews.length;
    }

    return (
        <Container className="mt-5">
            <center>
                <h2>{location?.state?.item?.name}</h2>
                <StarRatings
                        name="ratings"
                        starDimension="50px"
                        starSpacing="5px"
                        rating={averageRating(reviews)}
                        starRatedColor="#eff312"
                        numberOfStars={5}
                    />
            </center>
            <Row className="mt-3 g-4 justify-content-md-center">
                {reviews && reviews.map((rev, _) => (
                    <div key={rev.review.id}>
                        <Col xs lg="8">
                            <Review {...location.state} {...rev} ></Review>
                        </Col>
                    </div>
                ))}
            </Row>
        </Container>
    )
}

export default ReviewList;