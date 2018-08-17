import {db} from '../../firebase'
import {cameraPositionToKey} from '..'

export function updateAvatarInDb(position, worldId, uniqueId) {
  try {
    // create or replace current position with new position //
    const avatarsRef = db.ref(`/worlds/${worldId}/avatars/${uniqueId}`)
    avatarsRef.ref.set({
      x: position.x,
      y: position.y,
      z: position.z
    })
  } catch (error) {
    console.error(error)
  }
}
