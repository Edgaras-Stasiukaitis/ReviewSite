import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom'
import loginSvg from '../../assets/login.svg';
import './style.scss';
import { toast } from 'react-toastify';
import { loginAction } from '../../redux/actions/userActions';
import { useDispatch } from 'react-redux'
import { login } from '../../api/user';
import { useForm } from 'react-hook-form';
import { loginSchema } from '../../utilities/schemas';
import { yupResolver } from "@hookform/resolvers/yup";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema)
    });
    
    const onSubmit = async (data) => {
        const result = await login(data.username, data.password);
        if (result.ok) {
            dispatch(loginAction(await result.json()));
            toast.success("Successfully logged in!");
            navigate('/');
        } else toast.error("Invalid credentials.")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="base-container">
                <div className="header">Login</div>
                <div className="content">
                    <div className="image">
                        <img src={loginSvg} alt="" />
                    </div>
                    <div className="form">
                        <div className="form-group">
                            <label htmlFor="username">Username<span> *</span></label>
                            <input className={errors?.username?.message ? "invalid-field" : ""} type="text" name="username" placeholder="username" {...register('username')} />
                            <span>{errors?.username?.message}</span>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password<span> *</span></label>
                            <input className={errors?.password?.message ? "invalid-field" : ""} type="password" name="password" placeholder="password" {...register('password')} />
                            <span>{errors?.password?.message}</span>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button type="submit" className="btn btn-success w-100">Login</button>
                    <p>Don't have an account?</p>
                    <NavLink to="/register">
                        <button type="button" className="btn btn-primary w-100">Register</button>
                    </NavLink>
                </div>
            </div>
        </form>
    )
}

export default Login;