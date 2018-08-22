import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {
  Login,
  Signup,
  Account,
  Home,
  World,
  WorldList,
  EditWorld
} from './components'

/**
 * COMPONENT
 */
export default class Routes extends Component {
  render() {
    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={Home} />
        <Route exact path="/worlds" component={World} />
        <Route exact path="/worlds/:id" component={World} />
        <Route exact path="/worlds/:id/edit" component={EditWorld} />
        <Route exact path="/worldlist" component={WorldList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/account" component={Account} />
      </Switch>
    )
  }
}
