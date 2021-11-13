import React from 'react';
import { Card } from 'react-bootstrap';

const Category = (props) => {
    return (
        <Card>
            <Card.Img variant="top" src="https://picsum.photos/175/80" />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
            </Card.Body>
        </Card>
    );
}

export default Category;