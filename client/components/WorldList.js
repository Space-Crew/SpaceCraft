import React, {Component} from 'react'
import ListPresentation from './ListPresentation'
import {db} from '../firebase'

export default class WorldList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      worlds: []
    }
    this.handleClick = this.handleClick.bind(this)
  }

  async componentDidMount() {
    try {
      const worlds = (await db.ref('worlds').once('value')).val()
      this.setState({worlds: Object.values(worlds)})
    } catch (error) {
      console.log(error)
    }
  }
  handleClick(id) {
    this.props.history.push('/plane/' + id)
  }
  render() {
    const path = '/plane/'
    return <ListPresentation items={this.state.worlds} linkPath={path} />
  }
}
