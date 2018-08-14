import React, {Component} from 'react'
import ListPresentation from './ListPresentation'
import {db} from '../firebase'

export default class WorldList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      worlds: []
    }
  }

  async componentDidMount() {
    const worlds = (await db.ref('worlds').once('value')).val()
    this.setState({worlds: Object.values(worlds)})
  }
  handleClick(id) {
    this.props.history.push('/plane/' + id)
  }
  render() {
    return (
      <ListPresentation
        items={this.state.worlds}
        handleClick={this.handleClick}
      />
    )
  }
}
