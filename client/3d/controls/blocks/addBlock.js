import {db} from '../../../firebase'
import {makeUnitCube, toKey} from '../../utilities'

export function addBlockToDb(position, color = 0xb9c4c0, worldId) {
  try {
    const cubesRef = db.ref(`/worlds/${worldId}/cubes`)
    cubesRef.child(toKey(position)).once('value', snapshot => {
      if (snapshot.val() === null) {
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

export function addTempBlockToDb(
  position,
  color = 0xb9c4c0,
  worldId,
  username
) {
  try {
    const cubesRef = db.ref(`/worlds/${worldId}/cubes`)
    cubesRef.child('temp' + username).once('value', snapshot => {
      if (snapshot.val() === null) {
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
  return cube
}
