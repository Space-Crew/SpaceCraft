import React, {Component} from 'react'
import {db} from '../firebase'
import {Link} from 'react-router-dom'
import {generateName} from '../3d/utilities/randomNameGenerator'
import {connect} from 'react-redux';

class Account extends Component {
  constructor() {
    super()
    this.state = {
      userWorldsName: [],
      userWorldsId: []
    }
    this.handleCreateWorld = this.handleCreateWorld.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }
  handleDelete(event, worldId) {
    const worldRef = db.ref(`/worlds/${worldId}`);
    worldRef.remove();
    const userWorldRef = db.ref(`/users/${this.props.currentUser.uid}/worlds/${worldId}`);
    userWorldRef.remove();
  }

  async handleCreateWorld() {
    const currentUser = this.props.currentUser
    const worldsRef = db.ref('/worlds')
    const newWorld = worldsRef.push()
    const worldId = newWorld.key
    const worldName = generateName()
    if (currentUser) {
      const userRef = await db.ref(`/users/${currentUser.uid}`)
      const userData = userRef.val();
      if (userData.worlds) {
        const userWorldsRef = db.ref(`/users/${currentUser.uid}/worlds`)
        userWorldsRef.update({
          [worldId]: worldName
        })
      } else {
        userRef.update({
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
    this.props.history.push(`/worlds/${worldId}`);
    document.getElementById('dropdown').style.display = 'none'
  }

  async componentDidMount() {
    const currentUser = this.props.currentUser;
    console.log('component did mount!', this.props.currentUser)
    if (currentUser) {
      const userWorldsRef = db.ref(`/users/${this.props.currentUser.uid}`);
      userWorldsRef.on('child_changed', snapshot => {
        console.log('a world is removed!', snapshot.val())
        this.setState({
          userWorldsName: Object.values(snapshot.val()),
          userWorldsId: Object.keys(snapshot.val())
        })
      })
      const snapshot = await db.ref(`/users/${currentUser.uid}`).once('value')
      if (snapshot.val().worlds) {
        this.setState({
          userWorldsName: Object.values(snapshot.val().worlds),
          userWorldsId: Object.keys(snapshot.val().worlds)
        })
      }
    }
  }

  render() {
    console.log(this.props.currentUser)
    return (
      <div id="account">
        {this.props.currentUser ? (
          <div>
            {this.state.userWorldsId.length ? (
              <div>
                <div className="world-list">
                  <h4>Welcome, {this.props.currentUser.displayName}</h4>
                  <h4>Your creations</h4>
                  <ul>
                  {this.state.userWorldsId.map((worldId, i) => {
                    return (
                      <div className="single-world" key={worldId}>
                        <Link to={`/worlds/${worldId}`}>
                          <li>{this.state.userWorldsName[i]}</li>
                        </Link>
                        <div className="option">
                          <Link to={`/worlds/${worldId}/edit`}>Edit</Link>
                          <a onClick={(event) => this.handleDelete(event, worldId)}>Delete</a>
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


const mapState = state => {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapState)(Account)