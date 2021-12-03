import React, { useState } from "react";
import DeleteModal from '../../utilities/DeleteModal';
import { Badge, Button } from 'react-bootstrap';

const UserData = (props) => {
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    
    return (
        <tr>
            <td>{props.id + 1}</td>
            <td><Badge bg={props.user.role === "Admin" ? "primary" : "secondary"}>{props.user.role}</Badge></td>
            <td>{props.user.firstName}</td>
            <td>{props.user.lastName}</td>
            <td>{props.user.userName}</td>
            <td>{props.user.email}</td>
            <td>
                <Button disabled={props.currentUser.data.UserId === props.user.id ? true : false} variant="outline-danger" size="sm" onClick={() => setDeleteModalShow(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                </Button>
            </td>
            <DeleteModal
                show={deleteModalShow}
                onHide={() => setDeleteModalShow(false)}
                userId={props.user.id}
                name={props.user.userName}
                type='users'
            />
        </tr>
    );
}

export default UserData;