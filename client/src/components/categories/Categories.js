import React from 'react'
import { getCategories } from '../../api/category';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Category from './category/Category';

const Categories = () => {
    const [categories, setCategories] = useState();

    useEffect(() => {
        getCategories().then(response => response.json()).then(data => {
            data && setCategories(data)
        })
    }, [])

    return (
        <Container className="mt-5">
            <Row xs={1} md={3} className="g-4">
                {categories && categories.map((cat, idx) => (
                    <Col>
                        <Category id={cat.id} name={cat.name} imageUrl={cat.imageURL} ></Category>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default Categories;