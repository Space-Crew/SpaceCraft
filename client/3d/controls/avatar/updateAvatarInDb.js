import {db} from '../../../firebase'

export function updateAvatarInDb(position, worldId, uniqueId, color, rotation) {
  try {
    // create or replace current position with new position //
    const avatarsRef = db.ref(`/worlds/${worldId}/avatars/${uniqueId}`)
    avatarsRef.ref.set({
      x: position.x,
      y: position.y,
      z: position.z,
      color,
      rotation
    })
  } catch (error) {
    console.error(error)
  }
}
