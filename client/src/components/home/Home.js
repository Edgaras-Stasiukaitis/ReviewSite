import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Carousel from 'react-elastic-carousel';
import reviewImage from '../../assets/review.svg';
import { getRecentReviews, getPopularReviews } from '../../api/home';
import DisplayedReview from './DisplayedReview';
import { NavLink } from 'react-router-dom';
import './home.css';

const Home = () => {
    const [recentReviews, setRecentReviews] = useState();
    const [popularReviews, setPopularReviews] = useState();
    const homePageReviewCount = 9;
    const breakPoints = [
        { width: 500, itemsToShow: 1 },
        { width: 768, itemsToShow: 2 },
        { width: 1200, itemsToShow: 3 },
        { width: 1500, itemsToShow: 4 }
    ];

    useEffect(() => {
        let isMounted = true;
        getRecentReviews(homePageReviewCount).then(response => response.json()).then(data => {
            if (isMounted && data) setRecentReviews(data)
        })
        getPopularReviews(homePageReviewCount).then(response => response.json()).then(data => {
            if (isMounted && data) setPopularReviews(data)
        })
        return () => { isMounted = false };
    }, [])

    return (
        <div>
            <Container className="mt-5 landing-page-background">
                <center>
                    <label className="landing-page-label">Express your mind!</label>
                    <img className="landing-page-image" src={reviewImage} alt="LandingLogo" />
                </center>
                <NavLink className="remove-underline center" to="/Categories" >
                    <button type="button" className="mt-5 btn btn-primary btn-lg explore-button">Begin by exploring the categories!</button>
                </NavLink>
            </Container>
            {popularReviews != null ? (
                <div>
                    <div className="mt-5 top">
                        <label><i className="far fa-star"></i> Popular user reviews</label>
                    </div>
                    <Container className="mt-3">
                        <Carousel breakPoints={breakPoints}>
                            {popularReviews && popularReviews.map((r, idx) => (
                                <DisplayedReview key={idx} {...r}></DisplayedReview>
                            ))}
                        </Carousel>
                    </Container>
                </div>
            ) : ''}
            {recentReviews != null ? (
                <div>
                    <div className="mt-5 top">
                        <label><i className="far fa-clock"></i> Recent user reviews</label>
                    </div>
                    <Container className="mt-3">
                        <Carousel breakPoints={breakPoints}>
                            {recentReviews && recentReviews.map(((r, idx) => (
                                <DisplayedReview className="card" key={idx} {...r}></DisplayedReview>
                            )))}
                        </Carousel>
                    </Container>
                </div>
            ) : ''}
        </div>
    )
}

export default Home;