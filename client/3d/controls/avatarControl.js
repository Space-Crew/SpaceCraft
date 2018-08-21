import * as THREE from 'three'
import {db} from '../../firebase'
import {updateAvatarInDb} from './updateAvatarInDb'
import {addAvatar} from './addAvatar'
import {deleteAvatar} from './deleteAvatar'

function avatarControl(worldId, yawObject, _scene) {
  let color = '#' + Math.floor(Math.random() * 16777215).toString(16)

  updateAvatarInDb({x: 0, y: 0, z: 0}, worldId, yawObject.uuid, color, {
    x: yawObject.rotation.x,
    y: yawObject.rotation.y,
    z: yawObject.rotation.z
  })
  let avatars = {}
  let avatar, disconnectRef
  // event listener to create and add avatar to scene //
  const avatarsRef = db.ref(`/worlds/${worldId}/avatars`)
  avatarsRef.on('child_added', snapshot => {
    let avatarPosition = snapshot.val()
    if (snapshot.ref.key !== yawObject.uuid) {
      avatar = addAvatar(
        new THREE.Vector3(avatarPosition.x, avatarPosition.y, avatarPosition.z),
        _scene,
        snapshot.val().color,
        snapshot.val().rotation
      )
    }
    disconnectRef = db.ref(`/worlds/${worldId}/avatars/${snapshot.ref.key}`)
    avatars[snapshot.ref.key] = avatar
  })

  // event listener to check for any changes in avatar position //
  avatarsRef.on('child_changed', snapshot => {
    let newPosition = snapshot.val()
    let newRotation = snapshot.val().rotation
    if (snapshot.ref.key !== yawObject.uuid) {
      let avatarToUpdate = avatars[snapshot.ref.key]
      console.log('avatar to update', avatarToUpdate)
      avatarToUpdate.position.set(newPosition.x, newPosition.y, newPosition.z)
      avatarToUpdate.rotation.set(newRotation.x, newRotation.y, newRotation.z)
    }
    disconnectRef = db.ref(`/worlds/${worldId}/avatars/${snapshot.ref.key}`)
  })

  // remove avatar from db and scene when they dissconnect //
  disconnectRef.onDisconnect().remove()
  avatarsRef.on('child_removed', snapshot => {
    let avatarToDelete = avatars[snapshot.ref.key]
    deleteAvatar(_scene, avatarToDelete)
  })
  window.addEventListener(
    'keydown',
    function() {
      updateAvatarInDb(yawObject.position, worldId, yawObject.uuid, color, {
        x: yawObject.rotation.x,
        y: yawObject.rotation.y,
        z: yawObject.rotation.z
      })
    },
    false
  )
}

export default avatarControl
