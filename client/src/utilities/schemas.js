import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    username: yup.string()
        .required('Username is required.'),
    password: yup.string()
        .required('Password is required.')
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

export const categorySchema = yup.object().shape({
    name: yup.string()
        .required('Name is required.'),
    imageUrl: yup.string()
});

export const reviewSchema = yup.object().shape({
    title: yup.string()
        .required("Title is required.").max(64, "Maximum 64 symbols allowed in title."),
    description: yup.string(),
    uniqueRating: yup.number()
        .min(1, "Rating is required.")
        .max(5, "Rating can not bet greater than 5")
        .required("Rating is required.")
});