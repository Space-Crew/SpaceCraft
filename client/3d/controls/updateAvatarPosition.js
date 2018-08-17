import {db} from '../../firebase'
import {toKey} from '..'

export function updateAvatarInDb(position, worldId) {
  /* try {
    const key = toKey(position)
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
    const key = toKey(position)
    const avatarRef = db.ref(`/worlds/${worldId}/avatars/${key}`)
    avatarRef.ref.set({
      x: position.x,
      y: position.y,
      z: position.z
    })
  } catch (error) {
    console.error(error)
  }
}
