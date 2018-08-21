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
    this.redirect = this.redirect.bind(this);
    this.signout = this.signout.bind(this);
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
      author: currentUser ? currentUser.displayName : 'guest',
      name: currentUser ? `${currentUser.displayName}'s world: ${worldId}` : `Guest's world: ${worldId}`,
      private: !!currentUser,
      authorizedPlayers: [currentUser.displayName]
    })
    this.props.history.push(`/worlds/${worldId}`);
  }

  toggleDropdown(event) {
    const dropdown = event.target.nextElementSibling;
    if (dropdown.style.display === 'none') {
      dropdown.style.display = 'flex';
    } else {
      dropdown.style.display = 'none';
    }

  }

  redirect(event) {
    this.props.history.push('/account')
    document.getElementById('dropdown').style.display = 'none'
  }

  signout(event) {
    doSignOut();
    this.props.history.push('/');
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
            style={{display: this.state.style}}
          >
            Instructions? Press Space Bar
          </span>
        )}
        <div id="menu">
          <div className="link-item dropdown" onClick={this.toggleDropdown}>Create</div>
          <div id="dropdown">
            <div className="link-item" onClick={this.handleCreateWorld}>New world</div>
            <div className="link-item" onClick={this.redirect}>Your creations</div>
          </div>
          <Link to="/worldlist">
            <div className="link-item">Explore</div>
          </Link>
          {
            !currentUser || !currentUser.displayName?
            <Link to="/login">
              <div className="link-item">Login</div>
            </Link> :
            (
              <div className="link-item" onClick={this.signout}>SignOut</div>
            )
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Navbar)