import React, {Component} from 'react'
import {db} from '../firebase'
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Radio,
  Input
} from 'semantic-ui-react'

/**
 * COMPONENT
 */

export default class EditWorld extends Component {
  constructor() {
    super()
    this.state = {
      authorized: false,
      name: '',
      private: true,
      description: '',
      error: '',
      updateSuccess: false,
      addingCollaborators: false,
      collaborator: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleRadio = this.toggleRadio.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  async componentDidMount() {
    const uri = '/worlds/' + this.props.match.params.id
    const world = (await db.ref(uri).once('value')).val()
    this.setState({
      authorized: this.props.currentUser.displayName === world.author
    })
  }

  handleSubmit(event) {
    try {
      event.preventDefault()
      const uri = '/worlds/' + this.props.match.params.id
      db.ref(uri).update({
        name: this.state.name,
        private: this.state.private,
        description: this.state.description
      })
      db.ref(`/users/${this.props.currentUser.uid}/worlds`).update({
        [this.props.match.params.id]: this.state.name
      })
    } catch (err) {
      console.error(err)
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleClick(event) {
    if (!this.state.addingCollaborators) {
      this.setState({
        addingCollaborators: true
      })
    } else {
      try {
        event.preventDefault()
        const uri = '/worlds/' + this.props.match.params.id
        const world = (await db.ref(uri).once('value')).val()
        db.ref(uri).update({
          authorizedPlayers: [
            ...world.authorizedPlayers,
            this.state.collaborator
          ]
        })
        this.setState({
          collaborator: '',
          addingCollaborators: false
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  toggleRadio(event) {
    this.setState({
      private: !this.state.private
    })
  }

  render() {
    const {error, updateSuccess} = this.state
    return (
      this.state.authorized ?
      <div className="login-form">
        <style>
        {`
          body > div,
          body > div > div,
          body > div > div > div.login-form {height: 100%;}
        `}
        </style>
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
                  label="Public"
                  name="radioGroup"
                  checked={!this.state.private}
                  onClick={this.toggleRadio}
                />
                &nbsp;&nbsp;&nbsp;
                <Radio
                  label="Private"
                  name="radioGroup"
                  checked={this.state.private}
                  onClick={this.toggleRadio}
                />
                <Button color="teal" fluid size="large" type="submit">
                  Submit
                </Button>
              </Segment>
            </Form>
            <div className="break" />
            <Button
              color="teal"
              size="large"
              type="button"
              onClick={this.handleClick}
            >
              Add Collaborator
            </Button>
            {this.state.addingCollaborators ? (
              <Input
                icon="user plus"
                id="collab"
                placeholder="Enter username"
                type="text"
                onChange={this.handleChange}
                name="collaborator"
                value={this.state.collaborator}
              />
            ) : null}
          </Grid.Column>
        </Grid>
      </div> :
      <div className="world-list">
        <p>You have no authorization to edit this world.</p>
      </div>
    )
  }
}
