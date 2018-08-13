import React, {Component} from 'react'
import ListPresentation from './ListPresentation'

export default class WorldList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      worlds: []
    }
  }

  componentDidMount() {
    const worlds = firebase
      .database()
      .ref('worlds')
      .limit(10)
    this.setState({worlds})
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
