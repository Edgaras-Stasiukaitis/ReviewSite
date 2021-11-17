import { Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Item = (props) => {
    const user = useSelector(state => state.user);
    return (
        <Card className="shadow">
            <Card.Img variant="top" src="https://picsum.photos/1920/1080" />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>{props.description}</Card.Text>
                <NavLink to="/reviews" state={{item: props}} >
                    <Button variant="success">View reviews</Button>{' '}
                </NavLink>
                { user.loggedIn ? (<Button variant="outline-primary">Write review</Button>) : ''}
            </Card.Body>
        </Card>
    );
}

export default Item;