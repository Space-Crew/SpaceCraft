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
        <Route
          exact
          path="/worlds"
          render={props => (
            <World currentUser={this.props.currentUser} {...props} />
          )}
        />
        <Route
          exact
          path="/worlds/:id"
          render={props => (
            <World currentUser={this.props.currentUser} {...props} />
          )}
        />
        <Route
          exact
          path="/worlds/:id/edit"
          render={props => (
            <EditWorld currentUser={this.props.currentUser} {...props} />
          )}
        />
        <Route exact path="/worldlist" component={WorldList} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route
          exact
          path="/account"
          render={() => <Account currentUser={this.props.currentUser} />}
        />
      </Switch>
    )
  }
}
