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
        { width: 500, itemsToShow: 1},
        { width: 768, itemsToShow: 2},
        { width: 1200, itemsToShow: 3},
        { width: 1500, itemsToShow: 4}
    ];

    useEffect(() => {
        getRecentReviews(homePageReviewCount).then(response => response.json()).then(data => {
            data && setRecentReviews(data)
        })
        getPopularReviews(homePageReviewCount).then(response => response.json()).then(data => {
            data && setPopularReviews(data)
        })
    }, [])

    return (
        <div>
            <Container className="mt-5">
                <center>
                    <h1>Express your mind!</h1>
                    <img src={reviewImage} alt="LandingLogo" />
                </center>
                <NavLink className="remove-underline center" to="/Categories" >
                    <button type="button" className="mt-5 btn btn-primary btn-lg w-50">Begin by exploring the categories!</button>
                </NavLink>
            </Container>
            <div className="mt-5 top shadow">
                <label>Popular user reviews</label>
            </div>
            <Container className="mt-3">
                <Carousel breakPoints={breakPoints}>
                    {popularReviews && popularReviews.map((r, _) => (
                        <DisplayedReview {...r}></DisplayedReview>
                    ))}
                </Carousel>
            </Container>
            <div className="mt-5 top shadow">
                <label>Recent user reviews</label>
            </div>
            <Container className="mt-3">
                <Carousel breakPoints={breakPoints}>
                    {recentReviews && recentReviews.map(((r, _) => (
                        <DisplayedReview className="card" {...r}></DisplayedReview>
                    )))}
                </Carousel>
            </Container>
        </div>
    )
}

export default Home;