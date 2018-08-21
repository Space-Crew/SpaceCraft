import {db} from '../../../firebase'
import {toKey} from '../../utilities'

export function deleteBlock(selected, scene, objects) {
  if (selected) {
    scene.remove(selected)
    selected.geometry.dispose()
    selected.material.dispose()
    objects = objects.filter(e => e.uuid !== selected.uuid)
    selected = undefined
  }
  return objects
}

export function deleteBlockFromDb(position, worldId) {
  try {
    const cubeRef = db.ref(`/worlds/${worldId}/cubes/${toKey(position)}`)
    if (cubeRef !== null) {
      cubeRef.remove()
    }
  } catch (error) {
    console.error(error)
  }
}
