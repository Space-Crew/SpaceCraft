import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Login, Signup, Account, Home, World, WorldList} from './components'

/**
 * COMPONENT
 */
export default class Routes extends Component {

  render() {
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={Home} />
        <Route exact path="/worlds" render={() => <World currentUser={this.props.currentUser} />} />
        <Route path="/worlds/:id" render={() => <World currentUser={this.props.currentUser} />} />
        <Route path="/worldlist" component={WorldList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/account" render={() => <Account currentUser={this.props.currentUser} />} />
      </Switch>
    )
  }
}
