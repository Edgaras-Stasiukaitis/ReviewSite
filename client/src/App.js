import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/navigation/Navigation.js';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Home from './components/Home';
import Categories from './components/categories/Categories';
import Items from './components/Items';
import Reviews from './components/Reviews';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <Router>
        <Navigation />
        <Routes>
          <Route path='/' element={<Home />} exact />
          <Route path='/categories' element={<Categories />} />
          <Route path='/items' element={<Items />} />
          <Route path='/reviews' element={<Reviews />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
      <ToastContainer/>
    </div>
  );
}

export default App;
