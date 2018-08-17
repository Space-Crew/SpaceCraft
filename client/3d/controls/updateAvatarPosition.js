import {db} from '../../firebase'
import {cameraPositionToKey} from '..'

export function updateAvatarInDb(position, worldId, uniqueId) {
  const key = cameraPositionToKey(position)
  /*try {
     const avatarRef = db.ref(`/worlds/${worldId}/avatars/`)
    avatarRef.child(key).once('value', () => {
      avatarRef.ref.set({
        x: position.x,
        y: position.y,
        z: position.z
      })
    })
  } catch (error) {
    console.error(error)
  } */
  try {
    const avatarRef = db.ref(`/worlds/${worldId}/avatars/${uniqueId}`)
    avatarRef.ref.set({
      x: position.x,
      y: position.y,
      z: position.z
    })
  } catch (error) {
    console.error(error)
  }
}
