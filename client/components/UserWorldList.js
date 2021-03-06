import React, {Component} from 'react'
import {db} from '../firebase'
import {generateName} from '../utilities/randomNameGenerator'
import {Link} from 'react-router-dom'
import {withRouter} from 'react-router'

class UserWorldList extends Component {
  constructor() {
    super()
    this.state = {
      userWorldsName: [],
      userWorldsId: []
    }
    this.handleCreateWorld = this.handleCreateWorld.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }
  handleDelete(worldId) {
    const worldRef = db.ref(`/worlds/${worldId}`)
    worldRef.remove()
    const userWorldRef = db.ref(
      `/users/${this.props.currentUser.uid}/worlds/${worldId}`
    )
    userWorldRef.remove()
  }

  async handleCreateWorld() {
    const currentUser = this.props.currentUser
    const worldsRef = db.ref('/worlds')
    const newWorld = worldsRef.push()
    const worldId = newWorld.key
    const worldName = generateName()
    if (currentUser) {
      const userRef = await db.ref(`/users/${currentUser.uid}`).once('value')
      const userData = userRef.val()
      if (userData.worlds) {
        const userWorldsRef = db.ref(`/users/${currentUser.uid}/worlds`)
        userWorldsRef.update({
          [worldId]: worldName
        })
      } else {
        db.ref(`/users/${currentUser.uid}`).update({
          worlds: {
            [worldId]: worldName
          }
        })
      }
    }
    newWorld.set({
      id: worldId,
      author: currentUser ? currentUser.displayName : 'guest',
      name: worldName,
      private: !!currentUser,
      authorizedPlayers: [currentUser.displayName]
    })
    this.props.history.push(`/worlds/${worldId}`)
    document.getElementById('dropdown').style.display = 'none'
  }

  async componentDidMount() {
    const currentUser = this.props.currentUser
    if (currentUser) {
      const userWorldsRef = db.ref(`/users/${currentUser.uid}`)
      userWorldsRef.on('child_changed', snapshot => {
        this.setState({
          userWorldsName: Object.values(snapshot.val()),
          userWorldsId: Object.keys(snapshot.val())
        })
      })
      userWorldsRef.on('child_removed', snapshot => {
        this.setState({
          userWorldsName: [],
          userWorldsId: []
        })
      })
      const userRef = await db.ref(`/users/${currentUser.uid}`).once('value')
      if (userRef.val().worlds) {
        this.setState({
          userWorldsName: Object.values(userRef.val().worlds),
          userWorldsId: Object.keys(userRef.val().worlds)
        })
      }
    }
  }

  render() {
    return this.state.userWorldsId.length ? (
      <div>
        <div className="world-list">
          <h1>Welcome, {this.props.currentUser.displayName}</h1>
          <h1 className="center">Your creations</h1>
          <ul>
            {this.state.userWorldsId.map((worldId, i) => {
              return (
                <div className="single-world" key={worldId}>
                  <Link to={`/worlds/${worldId}`}>
                    <li>{this.state.userWorldsName[i]}</li>
                  </Link>
                  <div className="option">
                    <Link to={`/worlds/${worldId}/edit`}>Edit</Link>
                    <a onClick={() => this.handleDelete(worldId)}>Delete</a>
                  </div>
                </div>
              )
            })}
          </ul>
        </div>
      </div>
    ) : (
      <div className="world-list">
        <h3>
          You have no creation, <a onClick={this.handleCreateWorld}>create</a>{' '}
          one now!
        </h3>
      </div>
    )
  }
}

export default withRouter(UserWorldList)
