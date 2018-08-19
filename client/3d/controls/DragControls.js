import * as THREE from 'three'
import {makeUnitCube} from '../meshes'
import {addBlockToDb, addBlock} from './addBlock'
import {deleteBlock, deleteBlockFromDb} from './deleteBlock'
import selectBlock from './selectBlock'
import {db, currentUser} from '../../firebase'
import {checkPositionOccupied} from './checkPositionOccupied'
import makePreviewGrid from '../meshes/makePreviewGrid'

function darken(color, percent) {
  let t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = color >> 16,
    G = (color >> 8) & 0x00ff,
    B = color & 0x0000ff
  return (
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
}

THREE.DragControls = function(_camera, _domElement, _scene) {
  let _objects = _scene.objects
  let worldId = _scene.worldId
  const {yawObject, pitchObject} = _camera.controls
  let _shiftIsDown = false
  let _commandIsDown = false
  let _raycaster = new THREE.Raycaster()
  const mouseVectorForBox = new THREE.Vector3()
  const mouseVector = new THREE.Vector3()
  let scale = 6
  let distanceToSelected

  let _mouse = new THREE.Vector2()
  const position = new THREE.Vector3(0, 0, 0)
  let previewBox = makeUnitCube(position, 0xb9c4c0, 0.3)
  previewBox.unselectable = true
  previewBox.visible = false
  const previewGrid = makePreviewGrid()
  previewBox.add(previewGrid.grid)
  previewBox.togglePreviewGridVisibility = previewGrid.boundToggleVisibility
  _scene.add(previewBox)
  let chosenColor
  let originalPosition
  let _selected = null,
    _hovered = null

  let scope = this
  let cubesToBeMoved = {}

  function activate() {
    _domElement.addEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.addEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.addEventListener('mouseup', onDocumentMouseCancel, false)
    document
      .getElementById('color-palette')
      .addEventListener('change', onColorChange, false)

    window.addEventListener('keydown', onDocumentOptionDown, false)
    window.addEventListener('keyup', onDocumentOptionUp, false)
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

  function onColorChange(event) {
    chosenColor = parseInt(event.target.value.replace('#', ''), 16)
    previewBox.material.color.setHex(chosenColor)
    previewBox.children[0].material.color.setHex(darken(chosenColor, -0.05))
  }

  function onDocumentOptionDown(event) {
    onDocumentKeyDown(event)
    if (event.which === 16) {
      _shiftIsDown = true
      previewBox.visible = true
    }
    if (event.which === 91) {
      _commandIsDown = true
      previewBox.visible = false
    }
  }
  function onDocumentOptionUp(event) {
    if (event.which === 16) {
      _shiftIsDown = false
      previewBox.visible = false
    }
    if (event.which === 91) {
      _commandIsDown = false
    }
  }
  function deactivate() {
    _domElement.removeEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.removeEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.removeEventListener('mouseup', onDocumentMouseCancel, false)
    window.removeEventListener('keydown', onDocumentOptionDown, false)
    window.removeEventListener('keyup', onDocumentOptionUp, false)
    document
      .getElementById('color-palette')
      .removeEventListener('change', onColorChange, false)
  }

  function dispose() {
    deactivate()
  }

  async function onDocumentMouseMove(event) {
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
    mouseVectorForBox.addScaledVector(_raycaster.ray.direction, scale)
    mouseVectorForBox.round()
    previewBox.position.copy(mouseVectorForBox)
  }

  function onDocumentKeyDown(event) {
    switch (event.which) {
      case 87: //W
        yawObject.translateZ(-1)
        break
      case 83: // S
        yawObject.translateZ(1)
        break
      case 65: //A
        yawObject.translateX(-1)
        break
      case 68: //D
        yawObject.translateX(1)
        break
      case 69: //Q
        yawObject.translateY(1)
        break
      case 81: //E
        yawObject.translateY(-1)
        break
      case 71: //G
        previewBox.togglePreviewGridVisibility()
        break
      case 90:
        if (_commandIsDown) {
          _scene.undoStack.undo()
        }
        break
      default:
        break
    }
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
    if (!isAddPositionOccupied && _shiftIsDown) {
      if (worldId === undefined) {
        addBlock(previewBox.position, chosenColor, _scene, _objects)
      } else {
        addBlockToDb(previewBox.position, chosenColor, worldId)
        _scene.undoStack.add(previewBox.position, chosenColor, 'ADD')
      }
    } else if (_commandIsDown) {
      if (worldId === undefined) {
        _objects = deleteBlock(_selected, _scene, _objects)
      } else {
        _objects = deleteBlock(_selected, _scene, _objects)
        if (_selected) {
          deleteBlockFromDb(_selected.position, worldId)
          _scene.undoStack.add(_selected.position, _selected.color, 'DELETE')
        }
      }
    } else if (_selected) {
      originalPosition = _selected.position
    }
  }

  async function onDocumentMouseCancel(event) {
    event.preventDefault()
    if (_selected) {
      window.removeEventListener('keydown', onDocumentKeyDown, false)
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
    _domElement.style.cursor = _hovered ? 'pointer' : 'auto'
  }

  activate()

  // API
  this.getObject = function() {
    return yawObject
  }
  this.getDirection = (function() {
    // assumes the camera itself is not rotated

    let direction = new THREE.Vector3(0, 0, -1)
    let rotation = new THREE.Euler(0, 0, 0, 'YXZ')

    return function(v = _raycaster.ray.direction) {
      rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0)

      v.copy(direction).applyEuler(rotation)

      return v
    }
  })()
  this.enabled = true

  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose
}

THREE.DragControls.prototype = Object.create(THREE.EventDispatcher.prototype)
THREE.DragControls.prototype.constructor = THREE.DragControls

export default THREE.DragControls
