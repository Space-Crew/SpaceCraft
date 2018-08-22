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
      worldUpdateSuccess: false,
      addingCollaborators: false,
      collabUpdateSuccess: false,
      collaborator: '',
      currentWorldName: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.toggleRadio = this.toggleRadio.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  async componentDidMount() {
    const uri = '/worlds/' + this.props.match.params.id
    const world = (await db.ref(uri).once('value')).val()
    console.log(world)
    this.setState({
      authorized: this.props.currentUser.displayName === world.author,
      currentWorldName: world.name,
      private: world.private
    })
  }

  handleSubmit(event) {
    try {
      event.preventDefault()
      let {name, description, currentWorldName} = this.state
      // prevent accidentally submitting an empty string as new world name //
      name = name ? name : currentWorldName
      const uri = '/worlds/' + this.props.match.params.id
      db.ref(uri).update({
        name: name,
        private: this.state.private,
        description: description
      })
      db.ref(`/users/${this.props.currentUser.uid}/worlds`).update({
        [this.props.match.params.id]: name
      })
      this.setState({
        worldUpdateSuccess: true,
        name: '',
        description: ''
      })
      setTimeout(() => this.props.history.push('/account'), 1000)
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
        if (this.state.collaborator) {
          db.ref(uri).update({
            authorizedPlayers: [
              ...world.authorizedPlayers,
              this.state.collaborator
            ]
          })
          this.setState({
            collaborator: '',
            addingCollaborators: false,
            collabUpdateSuccess: true
          })
          setTimeout(() => {
            this.setState({collabUpdateSuccess: false})
          }, 1500)
        }
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
    const {
      error,
      worldUpdateSuccess,
      currentWorldName,
      collabUpdateSuccess
    } = this.state
    let successText = worldUpdateSuccess
      ? 'World successfully updated!'
      : 'Collaborator successfully added!'
    return this.state.authorized ? (
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
            {(worldUpdateSuccess || collabUpdateSuccess) && (
              <Message color="teal">{successText}</Message>
            )}
            {error && <Message negative>{error}</Message>}
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Header as="h2" color="teal" textAlign="center">
                  Modifying World {`"${currentWorldName}"`}
                </Header>
                <Form.Input
                  placeholder="New name"
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
            {this.state.addingCollaborators && (
              <Input
                icon="user plus"
                id="collab"
                placeholder="Enter username"
                type="text"
                onChange={this.handleChange}
                name="collaborator"
                value={this.state.collaborator}
              />
            )}
          </Grid.Column>
        </Grid>
      </div>
    ) : (
      <div className="world-list">
        <p>You are not authorized to edit this world.</p>
      </div>
    )
  }
}
