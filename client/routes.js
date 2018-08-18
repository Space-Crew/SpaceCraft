import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Login, Signup, UserHome, Home, World, WorldList} from './components'
import {db} from './firebase'

/**
 * COMPONENT
 */
export default class Routes extends Component {
  componentDidMount() {}

  render() {
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={Home} />
        <Route exact path="/worlds" component={World} />
        <Route path="/worlds/:id" component={World} />
        <Route path="/worldlist" component={WorldList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
    )
  }
}
