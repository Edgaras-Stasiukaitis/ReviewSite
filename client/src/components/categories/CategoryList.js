import React from 'react';
import { getCategories } from '../../api/category';
import { Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Category from './category/Category';
import FormModal from './FormModal';
import ItemFormModal from '../items/FormModal';

const CategoryList = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState();
    const [addModalShow, setAddModalShow] = useState(false);
    const [addItemModalShow, setAddItemModalShow] = useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        getCategories().then(response => response.json()).then(data => {
            data && setCategories(data)
        })
    }, [])

    return (
        <div>
            <div className="shadow top">
                <Breadcrumb className="breadcrumb-bar">
                    <Breadcrumb.Item onClick={() => navigate('/')}><i className="fas fa-home"></i></Breadcrumb.Item>
                    <Breadcrumb.Item active>Categories</Breadcrumb.Item>
                </Breadcrumb>
                <label><i className="fas fa-layer-group"></i> Categories</label>
            </div>
            <Container fluid="sm" className="mt-4">
                {user.loggedIn && user.data.role === "Admin" ? (
                    <div>
                        <div className="flex-gap">
                            <div>
                                <Button variant="success" onClick={() => setAddModalShow(true)}>
                                    <i className="fas fa-plus"></i> Add category
                                </Button>
                            </div>
                            <div>
                                <Button variant="warning" onClick={() => setAddItemModalShow(true)}>
                                    <i className="fas fa-plus"></i> Add item
                                </Button>
                            </div>
                        </div>
                        <FormModal
                            show={addModalShow}
                            edit={0}
                            onHide={() => setAddModalShow(false)}
                        />
                        <ItemFormModal
                            show={addItemModalShow}
                            edit={0}
                            type="categories"
                            onHide={() => setAddItemModalShow(false)}
                            categories={categories}
                        />
                    </div>
                ) : ''}
                <Row xs={1} md={3} className="mt-3 g-4">
                    {categories && categories.map((cat, _) => (
                        <div key={cat.id}>
                            <Col>
                                <Category {...cat} ></Category>
                            </Col>
                        </div>
                    ))}
                </Row>
            </Container>
        </div>
    )
}

export default CategoryList;