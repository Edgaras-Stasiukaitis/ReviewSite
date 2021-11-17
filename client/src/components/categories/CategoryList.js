import React from 'react'
import { getCategories } from '../../api/category';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Category from './category/Category';
import FormModal from './FormModal';

const CategoryList = () => {
    const [categories, setCategories] = useState();
    const [addModalShow, setAddModalShow] = useState(false);
    const user = useSelector(state => state.user);

    useEffect(() => {
        getCategories().then(response => response.json()).then(data => {
            data && setCategories(data)
        })
    }, [])

    return (
        <Container fluid="sm" className="mt-5">
            {user.loggedIn && user.data.role === "Admin" ? (
                <div>
                    <Button variant="success" onClick={() => setAddModalShow(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-plus" viewBox="0 0 16 16">
                            <path d="M8.5 6a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V10a.5.5 0 0 0 1 0V8.5H10a.5.5 0 0 0 0-1H8.5V6z" />
                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z" />
                        </svg>
                        Add category
                    </Button>
                    <FormModal
                        show={addModalShow}
                        edit={0}
                        onHide={() => setAddModalShow(false)}
                    />
                </div>
            ) : ''}
            <center><h2>Categories</h2></center>
            <Row xs={1} md={3} className="mt-3 g-4">
                {categories && categories.map((cat, _) => (
                    <div key={cat.id}>
                        <Col>
                            <Category id={cat.id} name={cat.name} imageUrl={cat.imageURL} ></Category>
                        </Col>
                    </div>
                ))}
            </Row>
        </Container>
    )
}

export default CategoryList;