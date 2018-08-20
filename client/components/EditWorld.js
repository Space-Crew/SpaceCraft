import React, {Component} from 'react'
import {db} from '../firebase'
import {Button, Form, Grid, Header, Message, Segment, Radio} from 'semantic-ui-react'

/**
 * COMPONENT
 */

export default class EditWorld extends Component {
  constructor() {
    super()
    this.state = {
      user: '',
      name: '',
      private: true,
      description: '',
      error: '',
      updateSuccess: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleRadio = this.toggleRadio.bind(this)
  }

  async handleSubmit(event) {
    try {
      const uri = '/worlds/' + this.props.match.params.id
      const worldRef = db.ref(uri).set({

      })
    } catch (err) {
      
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  toggleRadio(event) {
    this.setState({
      private: !this.this.state.private
    })
  }

  render() {
    const {
      error,
      updateSuccess
    } = this.state
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
            {updateSuccess && (
              <Message color="teal">Account successfully created!</Message>
            )}
            {error && <Message negative>{error}</Message>}
            <Header as="h2" color="teal" textAlign="center">
              Your World
            </Header>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  placeholder="Name"
                  name="name"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.name}
                />
                <Form.Input
                  placeholder="Description"
                  name="description"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.description}
                />
                <Radio
                  label='Private'
                  name='radioGroup'
                  checked={this.state.private}
                  onClick={this.toggleRadio}
                />
                &nbsp;&nbsp;&nbsp;
                <Radio
                  label='Public'
                  name='radioGroup'
                  checked={!this.state.private}
                  onClick={this.toggleRadio}
                />
                <Button
                  color="teal"
                  fluid
                  size="large"
                  type="submit"
                >
                  Submit
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
