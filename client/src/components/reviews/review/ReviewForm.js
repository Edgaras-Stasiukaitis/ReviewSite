import "./reviewForm.scss";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { reviewSchema } from "../../../utilities/schemas";
import { useForm } from "react-hook-form";
import { addReview, updateReview } from "../../../api/review";
import { refreshTokenAction } from "../../../redux/actions/userActions";
import { toast } from "react-toastify";
import StarRatings from 'react-star-ratings';

const ReviewForm = () => {
    const location = useLocation();
    const category = location?.state?.category;
    const item = location?.state?.item;
    const review = location?.state?.review;
    const [rating, setRating] = useState(review?.rating != null ? review.rating : 0);
    const [title, setTitle] = useState(review?.title != null ? review.title : '');
    const [description, setDescription] = useState(review?.description != null ? review.description : '');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(reviewSchema)
    });

    const onSubmit = async (data) => {
        console.log(data)
        const newToken = await dispatch(refreshTokenAction(user));
        const payload = {
            categoryId: category?.id,
            itemId: item?.id,
            reviewId: review?.id,
            title: data.title,
            description: data.description,
            rating: data.uniqueRating,
            token: newToken == null ? user.token : newToken.token
        }
        const result = location.state.edit ? await updateReview(payload) : await addReview(payload);
        if (result.ok) {
            toast.success("Review published!");
            navigate('/reviews', {state: location.state});
            return null;
        }
        else toast.error("Invalid data provided.");
    }

    return (
        <div>
            <div className="top shadow">
                <img src="https://picsum.photos/1920/1080" alt="" />
                <label>{item?.name}</label>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="base shadow">
                    <div className="group">
                        <label htmlFor="uniqueRating">Rate your experience</label>
                        <input
                            name="uniqueRating"
                            type="number"
                            value={rating}
                            {...register('uniqueRating')}
                        />
                        <StarRatings
                            name="starRating"
                            rating={rating}
                            starHoverColor="#eff312"
                            starRatedColor="#eff312"
                            numberOfStars={5}
                            changeRating={e => setRating(e)}
                        />
                        <span className="error">{errors?.uniqueRating?.message}</span>
                    </div>
                    <div className="group">
                        <label htmlFor="title">Name your review</label>
                        <input
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
                    <div className="submit-button">
                        <button type="submit" className="btn btn-success">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ReviewForm;