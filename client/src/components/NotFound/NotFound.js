import notFoundSvg from '../../assets/404.svg';
import { NavLink } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div>
            <div className="mt-5 center">
                <img className="not-found-img" src={notFoundSvg} alt="" />
            </div>
            <NavLink className="remove-underline center" to="/" >
                <button type="button" className="btn btn-primary btn-lg w-50">Back to main page</button>
            </NavLink>
        </div>
    );
}

export default NotFound;