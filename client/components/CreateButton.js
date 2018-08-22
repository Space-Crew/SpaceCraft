import React, {Fragment, Component} from 'react'
import {db} from '../firebase'
import {generateName} from '../utilities/randomNameGenerator'
import {withRouter} from 'react-router-dom'

class CreateButton extends Component {
  constructor() {
    super()
    this.handleCreateWorld = this.handleCreateWorld.bind(this)
    this.redirect = this.redirect.bind(this)
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

  redirect(event) {
    this.props.history.push('/account')
    document.getElementById('dropdown').style.display = 'none'
  }

  toggleDropdown(event) {
    const dropdown = event.target.nextElementSibling
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
      dropdown.style.display = 'flex'
    } else {
      dropdown.style.display = 'none'
    }
  }
  render() {
    return (
      <Fragment>
        <div className="link-item dropdown" onClick={this.toggleDropdown}>
          Create
        </div>
        <div id="dropdown">
          <div className="link-item" onClick={this.handleCreateWorld}>
            New world
          </div>
          <div className="link-item" onClick={this.redirect}>
            Your creations
          </div>
        </div>
      </Fragment>
    )
  }
}

export default withRouter(CreateButton)
