import React from "react";
import { Card } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { timeSince } from "../../utilities/calculators";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../reviews/review/review.css";

const DisplayedReview = (props) => {
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);

    useEffect(() => {
        const reactionCounts = props.reactions && props.reactions.reduce((cnt, cur) => { cnt[cur.reactionState] = cnt[cur.reactionState] + 1 || 1; return cnt }, {});
        setUpvoteCount(reactionCounts[1] === undefined ? 0 : reactionCounts[1]);
        setDownvoteCount(reactionCounts[2] === undefined ? 0 : reactionCounts[2]);
    }, [props.reactions]);

    return (
        <Card className="shadow card-item">
            <Card.Body>
                <div className="one-line">
                    <Card.Text><b>{props.user.firstName} {props.user.lastName}</b> reviewed <b>
                        <NavLink className="remove-underline" to="/reviews" state={{ ...props }} >{props.item.name}</NavLink>
                    </b> in <b><NavLink className="remove-underline" to="/items" state={{ ...props.category }} >{props.category.name}</NavLink></b>
                    </Card.Text>
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
                    <Card.Text className="creation-date">{timeSince(new Date(props.review.creationDate))} ago</Card.Text>
                </div>
                <Card.Text></Card.Text>
                <Card.Title className="card-item-italic">{props.review.title}</Card.Title>
                <Card.Text className="card-item-italic">{props.review.description}</Card.Text>
                <hr />
                <i className="fas fa-thumbs-up thumbs"></i>
                <span className="vote-count"> {upvoteCount} </span>
                <i className={"fas fa-thumbs-down thumbs"}></i>
                <span className="vote-count"> {downvoteCount} </span>
            </Card.Body>
        </Card >
    );
}

export default DisplayedReview;