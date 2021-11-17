import notFoundSvg from '../../assets/404.svg';
import { NavLink } from 'react-router-dom';
import './NotFound.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const NotFound = () => {
    return (
        <div>
            <div className="mt-5 center">
                <img src={notFoundSvg} alt="" />
            </div>
            <NavLink className="nav-link" to="/" >
                <button type="button" className="btn btn-primary btn-lg w-100">Back to main page</button>
            </NavLink>
        </div>
    );
}

export default NotFound;