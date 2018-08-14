import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import {Login, Signup, UserHome, Home, Plane} from './components'
import PointerLockDemo from './components/PointerLockDemo'
import {db} from './firebase'

/**
 * COMPONENT
 */
export default class Routes extends Component {
  componentDidMount() {
  }

  render() {
    // Example to access worlds column in db //
    const usersRef = db.ref('worlds')
    usersRef.on('value', snapshot => console.log(snapshot.val()))

    return (
      <Switch>
        {/* Routes placed here are available to all visitors */}
        <Route exact path="/" component={Home} />
        <Route exact path="/plane" component={Plane} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/demo" component={PointerLockDemo} />
      </Switch>
    )
  }
}

