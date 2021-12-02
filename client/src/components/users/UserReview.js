import React from 'react';
import { Card, Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import StarRatings from "react-star-ratings";
import DeleteModal from "../../utilities/DeleteModal";
import { useDispatch } from "react-redux";
import { refreshTokenAction } from "../../redux/actions/userActions";
import { getReactions, addReaction, updateReaction, deleteReaction } from "../../api/reaction";
import { useEffect, useState } from "react";
import { timeSince } from "../../utilities/calculators";
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import "../reviews/review/review.css";

const UserReview = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [reactions, setReactions] = useState();
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [downvoteCount, setDownvoteCount] = useState(0);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        getReactions(props.category.id, props.item.id, props.review.id).then(response => response.json()).then(data => {
            data && setReactions(data)
        })
    }, [props.category.id, props.item.id, props.review.id])

    const userReaction = reactions?.find(x => x?.user?.id === user?.data?.UserId);

    useEffect(() => {
        if (reactions != null) {
            const reactionCounts = reactions && reactions.reduce((cnt, cur) => (cnt[cur.reactionState] = cnt[cur.reactionState] + 1 || 1, cnt), {});
            setUpvoteCount(reactionCounts[1] == null ? 0 : reactionCounts[1]);
            setDownvoteCount(reactionCounts[2] == null ? 0 : reactionCounts[2]);
        }
    }, [reactions]);

    const vote = async (upvote) => {
        const newToken = await dispatch(refreshTokenAction(user));
        const payload = {
            categoryId: props?.category?.id,
            itemId: props?.item?.id,
            reviewId: props?.review?.id,
            reactionState: upvote ? 1 : 2,
            token: newToken == null ? user.token : newToken.token
        }
        if (userReaction != null) {
            if (upvote && userReaction.reactionState === 1) await deleteReaction({ ...payload, reactionId: userReaction.id });
            else if (!upvote && userReaction.reactionState === 2) await deleteReaction({ ...payload, reactionId: userReaction.id });
            else await updateReaction({ ...payload, reactionId: userReaction.id, reactionState: upvote ? 1 : 2 });
        }
        else await addReaction(payload);
        getReactions(props.category.id, props.item.id, props.review.id).then(response => response.json()).then(data => {
            data && setReactions(data)
        })
    }

    return (
        <Card className="shadow">
            <Card.Body>
                <div className="one-line">
                    <Card.Text>
                        <b>You</b> reviewed <b><NavLink className="remove-underline" to="/reviews" state={{ ...props }} >{props.item.name}</NavLink></b> in <b>
                            <NavLink className="remove-underline" to="/items" state={{ ...props.category }} >{props.category.name}</NavLink>
                        </b>
                    </Card.Text>
                    <div className="button-group">
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
                                <i className="fas fa-cog"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => navigate("/reviews/form", { state: { from: "/user/reviews", edit: 1, ...props } })}><i className="fas fa-edit"></i> Edit</Dropdown.Item>
                                <Dropdown.Item onClick={() => setDeleteModalShow(true)}><i className="fas fa-trash"></i> Delete</Dropdown.Item>
                                <DeleteModal
                                    show={deleteModalShow}
                                    onHide={() => setDeleteModalShow(false)}
                                    categoryId={props.category.id}
                                    itemId={props.item.id}
                                    reviewId={props.review.id}
                                    name={props.review.title}
                                    type='user/reviews'
                                />
                            </Dropdown.Menu>
                        </Dropdown>
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
                    <Card.Text className="creation-date">{timeSince(new Date(props.review.creationDate))} ago</Card.Text>
                </div>
                <Card.Text></Card.Text>
                <Card.Title>{props.review.title}</Card.Title>
                <Card.Text>{props.review.description}</Card.Text>
                <hr />
                <i onClick={() => vote(true)} className={"fas fa-thumbs-up fa-lg " + (userReaction && userReaction.reactionState === 1 ? "thumbs-active" : "thumbs")}></i>
                <span className="vote-count"> {upvoteCount} </span>
                <i onClick={() => vote(false)} className={"fas fa-thumbs-down fa-lg " + (userReaction && userReaction.reactionState === 2 ? "thumbs-active" : "thumbs")}></i>
                <span className="vote-count"> {downvoteCount} </span>
            </Card.Body>
        </Card >
    );
}

export default UserReview;