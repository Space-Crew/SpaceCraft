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
      id: worldId,
      author: currentUser ? currentUser.displayName : 'guest'
    })
    this.props.history.push(`/worlds/${worldId}`)
  }

  async componentDidMount() {
    const currentUser = this.props.currentUser
    if (currentUser) {
      const snapshot = await db.ref(`/users/${currentUser.uid}`).once('value')

      if (snapshot.val().worlds) {
        this.setState({
          user: currentUser.displayName,
          userWorlds: Object.values(snapshot.val().worlds)
        })
      }
    }
  }

  render() {
    return (
      <div id="account">
        {this.state.user ? (
          <div>
            {this.state.userWorlds.length ? (
              <div>
                <div className="world-list">
                  <h4>Welcome, {this.state.user}</h4>
                  <h4>Your creations</h4>
                  <ul>
                  {this.state.userWorlds.map(worldId => {
                    return (
                      <div key={worldId} className="center">
                        <Link to={`/worlds/${worldId}`}>
                          <li>{`${this.state.user}'s world: ${worldId}`}</li>
                        </Link><Link to={`/worlds/${worldId}/edit`} className="edit">Edit</Link>
                      </div>
                    )
                  })}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="world-list">
                <h3>
                  You have no creation,{' '}
                  <a onClick={this.handleCreateWorld}>create</a> one now!
                </h3>
              </div>
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
