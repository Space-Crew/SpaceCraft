import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {doSignInWithEmailAndPassword} from '../firebase/auth'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'

/**
 * COMPONENT
 */

const initialState = {
  email: '',
  password: '',
  error: '',
  loginSuccess: false
}

export default class AuthForm extends Component {
  constructor() {
    super()
    this.state = initialState
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  async handleSubmit(event) {
    try {
      event.preventDefault()
      const {email, password} = this.state
      await doSignInWithEmailAndPassword(email, password)
      this.setState({
        error: '',
        loginSuccess: true
      })
      setTimeout(() => {
        this.setState(initialState)
        this.props.history.push('/account')
      }, 1500)
    } catch (err) {
      console.log('there is an error', err)
      this.setState({error: 'Invalid login credentials'})
    }
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const {email, password} = this.state
    const isInvalid = email === '' || password === ''
    return (
      <div className="login-form">
        {/*
      The styles below are necessary for the correct render of this Login page.
      All the elements up to the `Grid` below must have a height of 100%.
    */}
        <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 100%;
      }
    `}</style>
        <Grid
          textAlign="center"
          style={{height: '100%'}}
          verticalAlign="middle"
        >
          <Grid.Column style={{maxWidth: 450}}>
            {this.state.loginSuccess && (
              <Message color="teal">Successfully logged in!</Message>
            )}
            <Header as="h2" color="teal" textAlign="center">
              Log-in to your account
            </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  name="email"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.email}
                />
                <Form.Input
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  name="password"
                  type="password"
                  onChange={this.handleChange}
                  value={this.state.password}
                />
                {this.state.error && (
                  <Message negative>{this.state.error}</Message>
                )}
                <Button
                  disabled={isInvalid}
                  color="teal"
                  fluid
                  size="large"
                  type="submit"
                >
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
