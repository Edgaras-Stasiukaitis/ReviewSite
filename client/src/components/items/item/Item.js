import { Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import FormModal from "../FormModal";
import DeleteModal from '../../../utilities/DeleteModal';

const Item = (props) => {
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const user = useSelector(state => state.user);

    return (
        <Card className="shadow">
            <Card.Img variant="top" src="https://picsum.photos/1920/1080" />
            <Card.Body>
                <Card.Title>{props.item.name}</Card.Title>
                <Card.Text>{props.item.description}</Card.Text>
                <NavLink to="/reviews" state={{ ...props }} >
                    <Button variant="success">View reviews</Button>{' '}
                </NavLink>
                {user.loggedIn ? (
                    <NavLink to="/reviews/form" state={{ edit: 0, ...props }} >
                        <Button variant="outline-primary">Write review</Button>
                    </NavLink>
                    ) : ''}
                {user.loggedIn && user.data.role === "Admin" ? (
                    <div>
                        <Button variant="outline-warning" onClick={() => setEditModalShow(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                            </svg>
                        </Button>
                        <Button variant="outline-danger" onClick={() => setDeleteModalShow(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                        </Button>
                        <FormModal
                            show={editModalShow}
                            edit={1}
                            onHide={() => setEditModalShow(false)}
                            {...props}
                        />
                        <DeleteModal
                            show={deleteModalShow}
                            onHide={() => setDeleteModalShow(false)}
                            categoryId={props.category.id}
                            itemId={props.item.id}
                            type='ITEM'
                        />
                    </div>
                ) : ''}
            </Card.Body>
        </Card>
    );
}

export default Item;