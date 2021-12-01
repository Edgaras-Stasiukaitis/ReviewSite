import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './components/notFound/NotFound';
import Navigation from './components/navigation/Navigation.js';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/home/Home';
import CategoryList from './components/categories/CategoryList';
import ItemList from './components/items/ItemList';
import ReviewList from './components/reviews/ReviewList';
import ReviewForm from './components/reviews/review/ReviewForm';
import UserList from './components/users/UserList';
import UserReviewList from './components/users/UserReviewList';
import { ToastContainer } from 'react-toastify';
import Footer from './components/footer/Footer';

function App() {
  return (
    <div className="page-container">
      <div className="content-wrap">
        <Router>
          <Navigation />
          <Routes>
            <Route path='/' element={<Home />} exact />
            <Route path='/categories' element={<CategoryList />} />
            <Route path='/items' element={<ItemList />} />
            <Route path='/reviews' element={<ReviewList />} />
            <Route path='/users' element={<UserList />} />
            <Route path='/user/reviews' element={<UserReviewList />} />
            <Route path='/reviews/form' element={<ReviewForm />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Router>
        <ToastContainer
          position="bottom-right" />
      </div>
      <Footer />
    </div>
  );
}

export default App;
