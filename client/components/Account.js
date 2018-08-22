import React, {Component} from 'react'
import UserWorldList from './UserWorldList'
import CollaboratorWorldList from './CollaboratorWorldList'

export default class Account extends Component {
  render() {
    return (
      <div id="account">
        {this.props.currentUser ? (
          <div>
            <UserWorldList currentUser={this.props.currentUser} />
            <CollaboratorWorldList currentUser={this.props.currentUser} />
          </div>
        ) : (
          <div>
            Welcome to SpaceCraft! You do not have an account right now, please{' '}
            <a href="/signup">sign up</a>!
          </div>
        )}
      </div>
    )
  }
}
