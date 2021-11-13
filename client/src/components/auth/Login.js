import React from 'react';
import { useNavigate } from 'react-router-dom'
import loginImg from '../../assets/login.png';
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
        } else{
            toast.error("Username or password is incorrect.")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="base-container">
                <div className="header">Login</div>
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
                            <label htmlFor="password">Password<span> *</span></label>
                            <input type="password" name="password" placeholder="password" {...register('password')} />
                            <span>{errors?.password?.message}</span>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </div>
        </form>
    )
}

export default Login;