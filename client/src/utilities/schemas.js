import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    username: yup.string()
        .required('Username is required.'),
    password: yup.string()
        .required('Password is required.')
        .min(4, 'Password should be 4 chars minimum.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
});

export const registerSchema = yup.object().shape({
    username: yup.string()
        .required('Username is required.'),
    password: yup.string()
        .required('Password is required.')
        .min(4, 'Password should be 4 chars minimum.')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, 'Password must contain a number.'),
    email: yup.string()
        .required('Email is required.')
        .email('Invalid email format.'),
    firstname: yup.string()
        .required("First name is required."),
    lastname: yup.string()
        .required("Last name is required.")
});