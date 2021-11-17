import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { getItems } from '../../api/item';
import Item from './item/Item';
import { useLocation, useNavigate } from 'react-router-dom';

const ItemList = () => {
    const [items, setItems] = useState();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(location.state === null) {
            navigate('/categories');
            return null;
        }
        getItems(location.state.category.id).then(response => response.json()).then(data => {
            data && setItems(data)
        })
    }, [location.state, navigate])

    return (
        <Container className="mt-5">
            <Row xs={1} md={4} className="g-1">
                {items && items.map((item, _) => (
                    <div key={item.id}>
                        <Col>
                            <Item categoryId={location.state.category.id} id={item.id} name={item.name} description={item.description} imageUrl={item.imageURL} ></Item>
                        </Col>
                    </div>
                ))}
            </Row>
        </Container>
    )
}

export default ItemList;