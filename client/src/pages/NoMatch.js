import React from 'react';
import { Row, Col } from 'react-materialize';

export function NoMatch() {
  return (
    <Row>
      <Col s={12} className='center'>
        <h1>404 Page Not Found</h1>
      </Col>
    </Row>
  );
}
