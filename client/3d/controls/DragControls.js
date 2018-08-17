import * as THREE from 'three'
import {makeUnitCube} from '../meshes'
import {addBlockToDb, addBlock, addTempBlockToDb} from './addBlock'
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

THREE.DragControls = function(_objects, _camera, _domElement, _scene, worldId) {
  if (_objects instanceof THREE.Camera) {
    console.warn(
      'THREE.DragControls: Constructor now expects ( objects, camera, domElement )'
    )
    let temp = _objects
    _objects = _camera
    _camera = temp
  }
  let pitchObject = new THREE.Object3D()
  pitchObject.add(_camera)
  pitchObject.rotation.x = Math.PI / 2

  let yawObject = new THREE.Object3D()
  yawObject.position.y = 0
  yawObject.add(pitchObject)

  let PI_2 = Math.PI / 2
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
    _domElement.addEventListener('mouseup', onDocumentMouseCancel, false) //able to release
    // _domElement.addEventListener('mouseleave', onDocumentMouseCancel, false)
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
        // if (originalPosition) {
        //   deleteBlockFromDb(originalPosition, worldId);
        //   originalPosition = undefined;

        let newPosition = new THREE.Vector3(
          movedCube.x,
          movedCube.y,
          movedCube.z
        )

        cubesToBeMoved[snapshot.key.slice(4)].position.copy(newPosition)
        // }
        // let toBeMoved = _scene.children.find(cube => cube.position.x === snapshot.val().x && cube.position.y === snapshot.val().y && cube.position.z === snapshot.val().z)
        // cubesToBeMoved[snapshot.key.slice(4)] = toBeMoved
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
    // _domElement.removeEventListener('mouseleave', onDocumentMouseCancel, false)
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

    const movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0
    const movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0

    yawObject.rotation.y -= movementX * 0.002
    pitchObject.rotation.x -= movementY * 0.004

    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    )

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
      }
    } else if (_commandIsDown) {
      if (worldId === undefined) {
        _objects = deleteBlock(_selected, _scene, _objects)
      } else {
        _objects = deleteBlock(_selected, _scene, _objects)
        if (_selected) {
          deleteBlockFromDb(_selected.position, worldId)
        }
      }
    } else {
      if (_selected) {
        originalPosition = _selected.position
      }
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
    // const tempSnap = await tempRef.once('value');
    // const tempVal = tempSnap.val();
    tempRef.remove()
    if (!_commandIsDown && !_shiftIsDown) {
      // const tempPosition = new THREE.Vector3(tempVal.x, tempVal.y, tempVal.z)
      // addBlockToDb(tempPosition, tempVal.color, worldId)

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

  // Backward compatibility

  this.setObjects = function() {
    console.error('THREE.DragControls: setObjects() has been removed.')
  }

  this.on = function(type, listener) {
    console.warn(
      'THREE.DragControls: on() has been deprecated. Use addEventListener() instead.'
    )
    scope.addEventListener(type, listener)
  }

  this.off = function(type, listener) {
    console.warn(
      'THREE.DragControls: off() has been deprecated. Use removeEventListener() instead.'
    )
    scope.removeEventListener(type, listener)
  }

  this.notify = function(type) {
    console.error(
      'THREE.DragControls: notify() has been deprecated. Use dispatchEvent() instead.'
    )
    scope.dispatchEvent({type: type})
  }
}

THREE.DragControls.prototype = Object.create(THREE.EventDispatcher.prototype)
THREE.DragControls.prototype.constructor = THREE.DragControls

export default THREE.DragControls
