import React, {Component} from 'react'
import {doCreateUserWithEmailAndPassword} from '../firebase/auth'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'

/**
 * COMPONENT
 */
export default class Signup extends Component {
  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      confirmPW: '',
      error: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  async handleSubmit(event) {
    try {
      event.preventDefault()
      await doCreateUserWithEmailAndPassword(
        this.state.email,
        this.state.password
      )
      console.log('sucessfully signed up!')
    } catch (err) {
      console.log('there is an error', err)
    }
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const {email, password, confirmPW} = this.state
    const isInvalid = email === '' || password === '' || confirmPW === ''
    const passwordsMatch = password === confirmPW
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
              Sign up for an account
            </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  placeholder="E-mail address"
                  name="email"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.email}
                />
                <Form.Input
                  placeholder="Password"
                  name="password"
                  type="password"
                  onChange={this.handleChange}
                  value={this.state.password}
                />
                <Form.Input
                  placeholder="Confirm password"
                  name="confirmPW"
                  type="password"
                  onChange={this.handleChange}
                  value={this.state.confirmPW}
                />
                {!passwordsMatch && (
                  <Message negative>Passwords do not match</Message>
                )}
                <Button
                  disabled={isInvalid || !passwordsMatch}
                  color="teal"
                  fluid
                  size="large"
                  type="submit"
                >
                  Sign Up
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
    /* return (
      <div className="form">
        <form onSubmit={this.handleSubmit}>
          <div className="form-item">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="text"
              onChange={this.handleChange}
              value={this.state.email}
            />
          </div>
          <div className="form-item">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </div>
          <div>
            <button type="submit">Sign in</button>
          </div>
          {this.state.error &&
            this.state.error.response && (
              <div> {this.state.error.response.data} </div>
            )}
        </form>
      </div>
    ) */
  }
}
