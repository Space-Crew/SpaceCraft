import {db} from '../../../firebase'

export function updateAvatarInDb(
  position,
  worldId,
  uniqueId,
  color,
  rotation,
  userName
) {
  try {
    console.log('updateAVat func username', userName)
    // create or replace current position with new position //
    const avatarsRef = db.ref(`/worlds/${worldId}/avatars/${uniqueId}`)
    avatarsRef.ref.set({
      x: position.x,
      y: position.y,
      z: position.z,
      color,
      rotation,
      user: userName
    })
  } catch (error) {
    console.error(error)
  }
}
