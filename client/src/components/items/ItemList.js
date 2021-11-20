import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';
import { getItems } from '../../api/item';
import Item from './item/Item';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormModal from './FormModal';

const ItemList = () => {
    const [items, setItems] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [addModalShow, setAddModalShow] = useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (location.state === null){
            navigate('/categories');
            return null;
        }
        getItems(location.state.id).then(response => response.json()).then(data => {
            data && setItems(data)
        })
    }, [location.state, navigate])

    return (
        <Container className="mt-5">
            {user.loggedIn && user.data.role === "Admin" ? (
                <div>
                    <Button variant="success" onClick={() => setAddModalShow(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-plus" viewBox="0 0 16 16">
                            <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z" />
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                        </svg>
                        Add item
                    </Button>
                    <FormModal
                        show={addModalShow}
                        edit={0}
                        onHide={() => setAddModalShow(false)}
                        category={location.state}
                    />
                </div>
            ) : ''}
            <center><h2>{location?.state?.name}</h2></center>
            <Row xs={1} md={4} className="g-1">
                {items && items.map((item, _) => (
                    <div key={item.id}>
                        <Col>
                            <Item category={location.state} item={item} ></Item>
                        </Col>
                    </div>
                ))}
            </Row>
        </Container>
    )
}

export default ItemList;