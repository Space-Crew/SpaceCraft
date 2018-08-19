import * as THREE from 'three'
import  {db} from '../../firebase'
import {addBlock, addBlockToDb} from './addBlock'
import {deleteBlock, deleteBlockFromDb} from './deleteBlock'
import {originalPosition} from './BlockControl'

function listenToDb(worldId, cubesToBeMoved, currentUser, _scene, _objects) {
  const cubesRef = db.ref(`/worlds/${worldId}/cubes/`)
  cubesRef.on('child_added', async function(snapshot) {
    if (snapshot.key.indexOf('temp') === 0) {
      if (snapshot.key.slice(4) === currentUser.displayName) {
        await deleteBlockFromDb(originalPosition, worldId)
        cubesToBeMoved[snapshot.key.slice(4)] = addBlock(
          originalPosition,
          snapshot.val().color,
          _scene,
          _objects
        )
        originalPosition = undefined
      } else {
        cubesToBeMoved[snapshot.key.slice(4)] = addBlock(
          new THREE.Vector3(
            snapshot.val().x,
            snapshot.val().y,
            snapshot.val().z
          ),
          snapshot.val().color,
          _scene,
          _objects
        )
      }
    } else {
      let newCube = snapshot.val()
      addBlock(
        new THREE.Vector3(newCube.x, newCube.y, newCube.z),
        newCube.color,
        _scene,
        _objects
      )
    }
  })
  cubesRef.on('child_removed', function(snapshot) {
    if (snapshot.key.indexOf('temp') !== 0) {
      let deletedCube = snapshot.val()
      let selectedCube = _objects.find(
        cube =>
          cube.position.x === deletedCube.x &&
          cube.position.y === deletedCube.y &&
          cube.position.z === deletedCube.z 
      )
      deleteBlock(selectedCube, _scene, _objects)
    } else if (snapshot.key.slice(4) === currentUser.displayName) {
      addBlockToDb(
        new THREE.Vector3(
          snapshot.val().x,
          snapshot.val().y,
          snapshot.val().z
        ),
        snapshot.val().color,
        worldId
      )
    } else {
      deleteBlock(cubesToBeMoved[snapshot.key.slice(4)], _scene, _objects)
    }
  })
  cubesRef.on('child_changed', function(snapshot) {
    if (snapshot.key.indexOf('temp') === 0) {
      let movedCube = snapshot.val()
      let newPosition = new THREE.Vector3(
        movedCube.x,
        movedCube.y,
        movedCube.z
      )
      cubesToBeMoved[snapshot.key.slice(4)].position.copy(newPosition)
    }
  })
  return cubesToBeMoved
}

export default listenToDb