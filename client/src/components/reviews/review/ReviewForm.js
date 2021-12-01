import "./reviewForm.scss";
import React, { useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { reviewSchema } from "../../../utilities/schemas";
import { useForm } from "react-hook-form";
import { addReview, updateReview } from "../../../api/review";
import { refreshTokenAction } from "../../../redux/actions/userActions";
import { toast } from "react-toastify";
import StarRatings from 'react-star-ratings';
import defaultItemImage from '../../../assets/defaultCategory.svg';

const ReviewForm = () => {
    const location = useLocation();
    const category = location?.state?.category;
    const item = location?.state?.item;
    const review = location?.state?.review;
    const [rating, setRating] = useState(review?.rating != null ? review.rating : 0);
    const [title, setTitle] = useState(review?.title != null ? review.title : '');
    const [description, setDescription] = useState(review?.description != null ? review.description : '');
    const [submitted, setSubmitted] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(reviewSchema)
    });

    if(location.state == null) return <Navigate to='/'/>;

    const onSubmit = async (data) => {
        if (rating === 0) return;
        const newToken = await dispatch(refreshTokenAction(user));
        const payload = {
            categoryId: category?.id,
            itemId: item?.id,
            reviewId: review?.id,
            title: data.title,
            description: data.description,
            rating: rating,
            token: newToken == null ? user.token : newToken.token
        }
        const result = location.state.edit ? await updateReview(payload) : await addReview(payload);
        if (result.ok) {
            toast.success("Review published!");
            navigate(location.state?.from != null ? location.state.from : "/reviews", { state: location.state });
            return null;
        }
        else toast.error("Invalid data provided.");
    }

    return (
        <div>
            <div className="top shadow">
                <Breadcrumb className="breadcrumb-bar">
                    <Breadcrumb.Item onClick={() => navigate('/')}><i className="fas fa-home"></i></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate('/categories')}>Categories</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate('/items', { state: location.state?.category })}>{location.state?.category?.name}</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate('/reviews', { state: location.state })}>{location?.state?.item?.name}</Breadcrumb.Item>
                    <Breadcrumb.Item active>Review</Breadcrumb.Item>
                </Breadcrumb>
                <img src={item?.imageURL ? item.imageURL : defaultItemImage} alt="" />
                <label>{item?.name}</label>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="base shadow">
                    <div className="group">
                        <label htmlFor="uniqueRating">Rate your experience <span className="error">*</span></label>
                        <StarRatings
                            name="starRating"
                            rating={rating}
                            starHoverColor="#eff312"
                            starRatedColor="#eff312"
                            numberOfStars={5}
                            changeRating={e => setRating(e)}
                        />
                        <span className="error">{submitted && rating === 0 ? "Rating is required" : ""}</span>
                    </div>
                    <div className="group">
                        <label htmlFor="title">Name your review <span className="error">*</span></label>
                        <input
                            className={errors?.title?.message ? "invalid-field" : ""}
                            type="text"
                            name="title"
                            placeholder="Write your review title"
                            defaultValue={title}
                            onChange={e => setTitle(e.target.value)}
                            {...register('title')}
                        />
                        <span className="error">{errors?.title?.message}</span>
                    </div>
                    <div className="group">
                        <label htmlFor="description">Give your review a description</label>
                        <textarea
                            type="text"
                            placeholder="Write your description here"
                            defaultValue={description}
                            onChange={e => setDescription(e.target.value)}
                            {...register('description')}
                        />
                        <span className="error">{errors?.description?.message}</span>
                    </div>
                    <div className="inline-buttons">
                        <button onClick={() => navigate(location.state?.from != null ? location.state.from : "reviews" , { state: location.state })} type="button" className="btn btn-secondary">Back to reviews</button>
                        <button onClick={() => setSubmitted(true)} type="submit" className="btn btn-success">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ReviewForm;