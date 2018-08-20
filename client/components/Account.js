import React, {Component} from 'react'
import {db} from '../firebase'
import {Link} from 'react-router-dom'

export default class Account extends Component {
  constructor() {
    super()
    this.state = {
      user: '',
      userWorlds: []
    }
    this.handleCreateWorld = this.handleCreateWorld.bind(this)
  }

  handleCreateWorld() {
    const currentUser = this.props.currentUser
    const worldsRef = db.ref('/worlds')
    const newWorld = worldsRef.push({
      author: currentUser ? currentUser.displayName : 'guest'
    })
    const worldId = newWorld.key
    if (currentUser) {
      const userWorldsRef = db.ref(`users/${currentUser.uid}/worlds`)
      userWorldsRef.push(worldId)
    }
    newWorld.set({
      id: worldId
    })
    this.props.history.push(`/worlds/${worldId}`)
  }

  componentDidMount() {
    const currentUser = this.props.currentUser
    if (currentUser) {
      db
        .ref(`/users/${currentUser.uid}`)
        .once('value')
        .then(snapshot => {
          if (snapshot.val().worlds) {
            this.setState({
              user: currentUser.displayName,
              userWorlds: Object.values(snapshot.val().worlds)
            })
          }
        })
    }
  }
  render() {
    return (
      <div id="account">
        {this.state.user ? (
          <div>
            <h3>Welcome, {this.state.user}</h3>
            {this.state.userWorlds.length ? (
              <div>
                <h3>Your creations</h3>
                <div className="world-list">
                  {this.state.userWorlds.map(worldId => {
                    return (
                      <Link to={`/worlds/${worldId}`} key={worldId}>
                        <div>{`${this.state.user}'s world - ${worldId}`}</div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : (
              <h3>
                You have no creation now,{' '}
                <a onClick={this.handleCreateWorld}>create</a> one now!
              </h3>
            )}
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
