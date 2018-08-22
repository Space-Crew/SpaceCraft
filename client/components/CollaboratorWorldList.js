import React, {Component} from 'react'
import {db} from '../firebase'
import {Link} from 'react-router-dom'

class CollaboratorWorldList extends Component {
  constructor() {
    super();
    this.state = {
      worldsId: [],
      worldsName: []
    }
  }

  async componentDidMount() {
    const userRef = await db.ref(`/users/${this.props.currentUser.uid}`).once('value')
    const collabWorlds = userRef.val().collaboratingWorlds;
    console.log(collabWorlds)
    if (collabWorlds) {
      let collabWorld = await Promise.all(collabWorlds.map(id => {
        const world = db.ref(`/worlds/${id}`).once('value')
        return world
      }))
      let collabNames = collabWorld.map(world => world.val().name)
      this.setState({
        worldsId: collabWorlds,
        worldsName: collabNames
      })
    }
  }

  render() {
    return (
      this.state.worldsId.length ? (
        <div className="world-list">
          <h4>Your Collaborators' Creation</h4>
          <ul>
          {this.state.worldsId.map((worldId, i) => {
            return (
              <div className="single-world" key={worldId}>
                <Link to={`/worlds/${worldId}`}>
                  <li>{this.state.worldsName[i]}</li>
                </Link>
              </div>
            )
          })}
          </ul>
        </div>
      ) : (
        <div className="world-list">
          <h4>
            No collaborators!
          </h4>
        </div>
      )
    )
  }
}

export default CollaboratorWorldList