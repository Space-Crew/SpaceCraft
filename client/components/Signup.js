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
      error: '',
      signupSuccess: false
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
      this.setState({signupSuccess: true})
      setTimeout(() => this.props.history.push('/plane'), 1500)
    } catch (err) {
      console.log('there is an error', err)
      this.setState({error: 'There was a problem creating an account'})
    }
  }
  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const {email, password, confirmPW, signupSuccess, error} = this.state
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
            {signupSuccess && (
              <Message color="teal">Account successfully created!</Message>
            )}
            {error && <Message negative>{error}</Message>}
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
  }
}
