import { Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const Item = (props) => {
    const user = useSelector(state => state.user);
    return (
        <Card>
            <Card.Body>
                <Card.Title>{props.rating}</Card.Title>
                <Card.Text>{props.description}</Card.Text>
                { user.loggedIn ? (<Button variant="success">Upvote</Button>) : ''}
            </Card.Body>
        </Card>
    );
}

export default Item;