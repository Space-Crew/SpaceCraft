import React, {Component} from 'react'
import WorldListPresentation from './WorldListPresentation'

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
    console.log(worlds)
    this.setState({worlds})
  }
  handleClick(id) {
    this.props.history.push('/plane/' + id)
  }
  render() {
    return (
      <WorldListPresentation
        worlds={this.state.worlds}
        handleClick={this.handleClick}
      />
    )
  }
}
