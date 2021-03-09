import React from 'react';
import 'materialize-css';
import {
  Card,
  CardTitle,
  Button,
  Icon,
  Row,
  Col,
} from 'react-materialize';

export function Home() {
  return (
    <Row>
      <Col offset={'xl2'} m={12} s={12} l={12} xl={8}>
        <Card
          actions={[
            <Button
              large
              node='a'
              waves='light'
              key='1'
              href='/register'
              style={{
                backgroundColor: 'green',
                color: 'red',
                fontWeight: 'bold',
              }}
            >
              Sign Up
              <Icon left>show_chart</Icon>
            </Button>,
          ]}
          className='transperant darken-1 center'
          header={
            <CardTitle image='./jumbo-bg.jpg'>Welcome to FakeTrade!</CardTitle>
          }
          textClassName='black-text'
        >
          <Row className='valign-wrapper'>
            <Col s={3}>
              <h6>Learn</h6>
            </Col>
            <Col className='left-align' s={9}>
              <p>
                With our FakeTrade sandbox environment you can learn to day
                trade without having to use any of your hard earned money<span role="img" aria-label="Cash Face Emoji">🤑</span>.
              </p>
            </Col>
          </Row>
          <Row className='valign-wrapper'>
            <Col className='center-align' s={3}>
              <h6>Practice</h6>
            </Col>
            <Col className='left-align' s={9}>
              <p>
                Those with a bit more experience can practice popular stategies
                such as{' '}
                <a
                  target='_blank'
                  rel="noopener noreferrer"
                  href='https://quantstrategies.academy/2020/05/19/the-21-most-popular-trading-strategies-every-serious-trader-should-learn-to-succeed'
                >
                  Price-Momentum, Earnings-Momentum, or Book-To-Price Value.
                </a>
              </p>
            </Col>
          </Row>
          <Row className='valign-wrapper'>
            <Col className='center-align' s={3}>
              <h6>Have fun!</h6>
            </Col>
            <Col className='left-align' s={9}>
              <p>Enjoy some guiltless trading while taking your skills to the moon<span role="img" aria-label="Rocket Emoji">🚀</span></p>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
