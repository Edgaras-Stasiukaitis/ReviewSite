import React from 'react';
import { useNavigate } from 'react-router-dom'
import loginImg from '../../assets/login.png';
import { toast } from 'react-toastify';
import './style.scss';
import { registration } from '../../api/user';
import { useForm } from 'react-hook-form';
import { registerSchema } from '../../utilities/schemas';
import { yupResolver } from "@hookform/resolvers/yup";

const Register = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(registerSchema)
    });

    const onSubmit = async (data) => {
        const result = await registration(data.username, data.password, data.email, data.firstname, data.lastname);
        if (result.ok) {
            toast.success("User successfully registered!")
            navigate('/login');
        } else
            toast.error("Error");
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="base-container">
                <div className="header">Register</div>
                <div className="content">
                    <div className="image">
                        <img src={loginImg} alt="" />
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username<span> *</span></label>
                            <input type="text" name="username" placeholder="username" {...register('username')} />
                            <span>{errors?.username?.message}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email<span> *</span></label>
                            <input type="email" name="email" placeholder="email" {...register('email')} />
                            <span>{errors?.email?.message}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstname">First name<span> *</span></label>
                            <input type="text" name="firstname" placeholder="firstname" {...register('firstname')} />
                            <span>{errors?.firstname?.message}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastname">Last name<span> *</span></label>
                            <input type="text" name="lastname" placeholder="lastname" {...register('lastname')} />
                            <span>{errors?.lastname?.message}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password<span> *</span></label>
                            <input type="password" name="password" placeholder="password" {...register('password')} />
                            <span>{errors?.password?.message}</span>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button type="submit" className="btn btn-primary">Register</button>
                </div>
            </div>
        </form>
    )
}

export default Register;