import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import { getItems } from '../../api/item';
import Item from './item/Item';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FormModal from './FormModal';

const ItemList = () => {
    const [items, setItems] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [addModalShow, setAddModalShow] = useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        if (location.state == null) return <Navigate to='/' />;
        getItems(location.state.id).then(response => response.json()).then(data => {
            data && setItems(data)
        })
    }, [location.state, navigate])

    if (location.state == null) return <Navigate to='/' />;

    return (
        <div>
            <div className="top shadow">
                <Breadcrumb className="breadcrumb-bar">
                    <Breadcrumb.Item onClick={() => navigate('/')}><i className="fas fa-home"></i></Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => navigate('/categories')}>Categories</Breadcrumb.Item>
                    <Breadcrumb.Item active>{location?.state?.name}</Breadcrumb.Item>
                </Breadcrumb>
                <label>{location?.state?.name}</label>
            </div>
            <Container fluid="sm" className="mt-4">
                {user.loggedIn && user.data.role === "Admin" ? (
                    <div>
                        <div className="d-flex justify-content-start">
                            <Button variant="success" onClick={() => setAddModalShow(true)}>
                                <i className="fas fa-plus"></i> Add item
                            </Button>
                        </div>
                        <FormModal
                            show={addModalShow}
                            edit={0}
                            onHide={() => setAddModalShow(false)}
                            category={location.state}
                        />
                    </div>
                ) : ''}
                <Row xs={1} md={4} className="mt-3 g-1">
                    {items && items.map((item, _) => (
                        <div key={item.id}>
                            <Col>
                                <Item category={location.state} item={item} ></Item>
                            </Col>
                        </div>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default ItemList;