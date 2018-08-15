import React, {Component} from 'react'
import {doCreateUserWithEmailAndPassword} from '../firebase/auth'
import {db} from '../firebase'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react'

/**
 * COMPONENT
 */

function writeUserData(userId, name, email, imageUrl, worlds = []) {
  db.ref('users/' + userId).set({
    username: name,
    email: email,
    avatar: imageUrl,
    worlds: worlds
  })
}

export default class Signup extends Component {
  constructor() {
    super()
    this.state = {
      username: '',
      email: '',
      password: '',
      imageUrl: '',
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
      const user = await doCreateUserWithEmailAndPassword(
        this.state.email,
        this.state.password
      )
      await writeUserData(
        user.user.uid,
        this.state.username,
        this.state.email,
        this.state.imageUrl
      )
      this.setState({error: '', signupSuccess: true})
      setTimeout(() => this.props.history.push('/create'), 1500)
    } catch (err) {
      this.setState({error: 'There was a problem creating an account'})
      console.log('there is an error', err)
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const {
      username,
      email,
      password,
      confirmPW,
      signupSuccess,
      error
    } = this.state
    const isInvalid =
      username === '' || email === '' || password === '' || confirmPW === ''
    const passwordsMatch = password === confirmPW
    return (
      <div className="login-form">
        {/*
      The styles below are necessary for the correct render of this Signup page.
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
                  placeholder="Username"
                  name="username"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.username}
                />
                <Form.Input
                  placeholder="Avatar URL"
                  name="imageUrl"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.imageUrl}
                />
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
        {/* // >>>>>>> master */}
      </div>
    )
  }
}
