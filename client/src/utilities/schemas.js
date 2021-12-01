import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    username: yup.string()
        .trim()
        .required('Username is required.'),
    password: yup.string()
        .trim()
        .required('Password is required.')
        .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
});

export const registerSchema = yup.object().shape({
    username: yup.string()
        .trim()
        .required('Username is required.'),
    password: yup.string()
        .trim()
        .required('Password is required.')
        .min(4, 'Password should be 4 chars minimum.')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/, 'Password must contain a letter and a digit.'),
    email: yup.string()
        .trim()
        .required('Email is required.')
        .email('Invalid email format.'),
    firstname: yup.string()
        .trim()
        .required("First name is required."),
    lastname: yup.string()
        .trim()
        .required("Last name is required.")
});

export const categorySchema = yup.object().shape({
    name: yup.string()
        .trim()
        .required('Name is required.'),
    imageUrl: yup.string()
});

export const reviewSchema = yup.object().shape({
    title: yup.string()
        .trim()
        .required("Title is required.").max(64, "Maximum 64 symbols allowed in title."),
    description: yup.string()
});