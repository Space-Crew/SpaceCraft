import {db} from '../../firebase'
import {toKey} from '..'

function deleteBlock(selected, scene, objects) {
  scene.remove(selected)
  selected.geometry.dispose()
  selected.material.dispose()
  selected = undefined
  objects = scene.children
}

export function deleteBlockFromDb(selected, scene, objects, worldId) {
  const deleteThis = selected.position.clone()
  deleteBlock(selected, scene, objects)
  try {
    const cubeRef = db.ref(`/worlds/${worldId}/cubes/${toKey(deleteThis)}`)
    if (cubeRef !== null) {
      cubeRef.remove()
    }
  } catch (error) {
    console.error(error)
  }
}

export default deleteBlock
