import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './components/NotFound/NotFound';
import Navigation from './components/navigation/Navigation.js';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/Home';
import CategoryList from './components/categories/CategoryList';
import ItemList from './components/items/ItemList';
import ReviewList from './components/reviews/ReviewList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} exact />
          <Route path='/categories' element={<CategoryList />} />
          <Route path='/items' element={<ItemList />} />
          <Route path='/reviews' element={<ReviewList />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right" />
    </div>
  );
}

export default App;
