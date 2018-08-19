import React from 'react'
import {doSignOut} from '../firebase/auth'
import {db} from '../firebase'
import {withRouter} from 'react-router'
import {Link} from 'react-router-dom'

class Navbar extends React.Component {
  constructor() {
    super()
    this.state = {
      style: 'block'
    }
    this.handleCreateWorld = this.handleCreateWorld.bind(this);
  }

  async handleCreateWorld() {
    const currentUser = this.props.currentUser
    const worldsRef = db.ref('/worlds');
    const newWorld = await worldsRef.push()
    const worldId = newWorld.key;
    if (currentUser) {
      const userRef = db.ref(`users/${currentUser.uid}/worlds`);
      userRef.push(worldId);
    }
    newWorld.set({
      id: worldId,
      author: currentUser ? currentUser.displayName : 'guest'
    })
    this.props.history.push(`/worlds/${worldId}`);
  }

  render() {
    const currentUser = this.props.currentUser
    return (
      <div id="navbar">
        <Link to="/">
          <div id="logo">SpaceCraft</div>
        </Link>
        {this.props.location.pathname.indexOf('/worlds') === 0 && (
          <span
            id="nav-instructions"
            className="link-item"
            style={{display: this.state.style}}
          >
            Instructions? Press Space Bar
          </span>
        )}
        <div id="menu">
          <a onClick={this.handleCreateWorld}><div className="link-item">Create</div></a>
          <Link to="/worldlist">
            <div className="link-item">Explore</div>
          </Link>
          <div className="link-item">Share</div>
          {
            !currentUser || !currentUser.displayName?
            <Link to="/login">
              <div className="link-item">Login</div>
            </Link> :
            (
            <React.Fragment>
              <Link to="/account">
                <div className="link-item">Account</div>
              </Link>
              <Link to="/" onClick={doSignOut}>
                <div className="link-item">Sign Out</div>
              </Link>
            </React.Fragment>
            )
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Navbar)