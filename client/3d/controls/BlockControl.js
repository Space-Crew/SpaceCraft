import * as THREE from 'three'
import {checkPositionOccupied} from './checkPositionOccupied'
import {db} from '../../firebase'
import selectBlock from './selectBlock'
import {deleteBlock, deleteBlockFromDb} from './deleteBlock'
import {addBlock, addBlockToDb} from './addBlock'
import darken from '../utilities/darken'

const BlockControl = function(essentials, currentUser, worldId, yawObject, previewBox, cubesToBeMoved) {

  const _mouse = new THREE.Vector2()
  const mouseVector = new THREE.Vector3()
  const mouseVectorForBox = new THREE.Vector3()
  const _raycaster = new THREE.Raycaster()
  let {_domElement, _objects, _camera, _scene} = essentials;
  let distanceToSelected;
  let _shiftIsDown = false;
  let _commandIsDown = false;
  let originalPosition;
  let chosenColor;

  let scope = this;
  let _selected = null;

  function activate() {
    window.addEventListener('keydown', onDocumentKeyDown, false)
    window.addEventListener('keyup', onDocumentKeyUp, false)
    _domElement.addEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.addEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.addEventListener('mouseup', onDocumentMouseCancel, false)
    document
    .getElementById('color-palette')
    .addEventListener('change', onColorChange, false)
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
  }

  function deactivate() {
    window.removeEventListener('keydown', onDocumentKeyDown, false)
    window.removeEventListener('keyup', onDocumentKeyUp, false)
    _domElement.removeEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.removeEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.removeEventListener('mouseup', onDocumentMouseCancel, false)
    document
    .getElementById('color-palette')
    .removeEventListener('change', onColorChange, false)
  }

  function onColorChange(event) {
    chosenColor = parseInt(event.target.value.replace('#', ''), 16)
    previewBox.material.color.setHex(chosenColor)
    previewBox.children[0].material.color.setHex(darken(chosenColor, -0.05))
  }

  function onDocumentKeyDown(event) {
    if (event.which === 16) {
      _shiftIsDown = true
      console.log(_shiftIsDown)
    }
    if (event.which === 91) {
      _commandIsDown = true
    }
  }
  function onDocumentKeyUp(event) {
    if (event.which === 16) {
      _shiftIsDown = false
      console.log(_shiftIsDown)
    }
    if (event.which === 91) {
      _commandIsDown = false
    }
  }
  
  function onDocumentMouseMove(event) {
    event.preventDefault()
    const rect = _domElement.getBoundingClientRect()
    _mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    _raycaster.setFromCamera(_mouse, _camera)
  
    if (_selected && scope.enabled) {
      mouseVector.copy(yawObject.position)
      mouseVector.addScaledVector(_raycaster.ray.direction, distanceToSelected)
      mouseVector.round()
      const isMovePositionOccupied = checkPositionOccupied(
        mouseVector,
        _objects
      )
      if (!isMovePositionOccupied && !_commandIsDown && !_shiftIsDown) {
        const cubesRef = db.ref(`/worlds/${worldId}/cubes`)
        cubesRef.child('temp' + currentUser.displayName).set({
          x: mouseVector.x,
          y: mouseVector.y,
          z: mouseVector.z,
          color: _selected.material.color.getHex()
        })
        _selected.position.copy(mouseVector)
      }
    }
    mouseVectorForBox.copy(yawObject.position)
    mouseVectorForBox.addScaledVector(_raycaster.ray.direction, 6)
    mouseVectorForBox.round()
    previewBox.position.copy(mouseVectorForBox)
  }
  
  function onDocumentMouseDown(event) {
    event.preventDefault()
    _selected = selectBlock(_mouse, _camera, _objects)
    if (_selected) {
      distanceToSelected = yawObject.position.distanceTo(_selected.position)
      _domElement.style.cursor = 'move'
    }
    const isAddPositionOccupied = checkPositionOccupied(
      previewBox.position,
      _objects
    )
    console.log(isAddPositionOccupied, _shiftIsDown);
    if (!isAddPositionOccupied && _shiftIsDown) {
      addBlockToDb(previewBox.position, chosenColor, worldId)
    } else if (_commandIsDown) {
      _objects = deleteBlock(_selected, _scene, _objects)
      if (_selected) {
        deleteBlockFromDb(_selected.position, worldId)
      }
    } else if (_selected) {
      originalPosition = _selected.position
      console.log('original position', originalPosition)
    }
  }
  
  function onDocumentMouseCancel(event) {
    event.preventDefault()
    if (_selected) {
      _selected = null
    }
    const tempRef = db.ref(
      `/worlds/${worldId}/cubes/temp${currentUser.displayName}`
    )
    tempRef.remove()
    if (!_commandIsDown && !_shiftIsDown) {
      _scene.remove(cubesToBeMoved[currentUser.displayName])
      delete cubesToBeMoved[currentUser.displayName]
    }
  }
  function dispose() {
    deactivate()
  }
  activate()

  this.enabled = true
  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose
}

export default BlockControl