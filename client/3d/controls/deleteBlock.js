import {db} from '../../firebase'
import {toKey} from '..'

export function deleteBlock(selected, scene, objects) {
  if (selected) {
    console.log('block deleted at', selected.position)
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
    console.log('block deleted from db at', position)
    const cubeRef = db.ref(`/worlds/${worldId}/cubes/${toKey(position)}`)
    if (cubeRef !== null) {
      cubeRef.remove()
    }
  } catch (error) {
    console.error(error)
  }
}
