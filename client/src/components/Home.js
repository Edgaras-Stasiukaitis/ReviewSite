import React from 'react'
import { useSelector } from 'react-redux';

const Home = () => {
    const token = useSelector(state => state.user);
    console.log(token);
    return (
        <div className="container mt-5 d-flex justify-content-left">
            Home Page
        </div>
    )
}

export default Home;