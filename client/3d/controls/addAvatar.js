import {makeUnitCube} from '../meshes'
import {db} from '../../firebase'
import {toKey} from '..'

export function addAvatarToDb(position, color, scene, objects, worldId) {
  try {
    const avatarRef = db.ref(`/worlds/${worldId}/avatars`)
    avatarRef.child(toKey(position)).once('value', snapshot => {
      if (snapshot.val() === null) {
        addBlock(position, color, scene, objects)
        snapshot.ref.set({
          x: position.x,
          y: position.y,
          z: position.z,
          color
        })
      }
    })
  } catch (error) {
    console.error(error)
  }
}

export function addBlock(position, color, scene, objects) {
  const cube = makeUnitCube(position, color, 1)
  scene.add(cube)
  objects.push(cube)
}
