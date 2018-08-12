import * as THREE from 'three'
import {makeUnitCube} from '../meshes'

THREE.DragControls = function(_objects, _camera, _domElement, _scene) {
  if (_objects instanceof THREE.Camera) {
    console.warn(
      'THREE.DragControls: Constructor now expects ( objects, camera, domElement )'
    )
    var temp = _objects
    _objects = _camera
    _camera = temp
  }
  var pitchObject = new THREE.Object3D()
  pitchObject.add(_camera)
  pitchObject.rotation.x = Math.PI/2;

  var yawObject = new THREE.Object3D()
  yawObject.position.y = 0
  yawObject.add(pitchObject)

  var pointerLockControlOn = true;
  var PI_2 = Math.PI / 2
  var _shiftIsDown = false
  var _commandIsDown = false
  var _plane = new THREE.Plane()
  var _raycaster = new THREE.Raycaster()
  const mouseVectorForBox = new THREE.Vector3()
  var scale = 4;

  var _mouse = new THREE.Vector2()
  var _offset = new THREE.Vector3()
  var _intersection = new THREE.Vector3()
  let previewBox = makeUnitCube(0,3,4,0xb9c4c0, 0.3);
  _scene.add(previewBox);

  var _selected = null,
    _hovered = null

  var scope = this

  function activate() {
    _domElement.addEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.addEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.addEventListener('mouseup', onDocumentMouseCancel, false) //able to release
    _domElement.addEventListener('mouseleave', onDocumentMouseCancel, false)

    window.addEventListener('keydown', onDocumentOptionDown, false)
    window.addEventListener('keyup', onDocumentOptionUp, false)
  }
  function onDocumentOptionDown(event) {
    onDocumentKeyDown(event)
    if (event.which === 16) {
      _shiftIsDown = true
    }
    if (event.which === 91) {
      _commandIsDown = true
    }
  }
  function onDocumentOptionUp(event) {
    onDocumentKeyDown(event)
    if (event.which === 16) {
      _shiftIsDown = false
    }
    if (event.which === 91) {
      _commandIsDown = false
    }
  }
  function deactivate() {
    _domElement.removeEventListener('mousemove', onDocumentMouseMove, false)
    _domElement.removeEventListener('mousedown', onDocumentMouseDown, false)
    _domElement.removeEventListener('mouseup', onDocumentMouseCancel, false)
    _domElement.removeEventListener('mouseleave', onDocumentMouseCancel, false)
    window.removeEventListener('keydown', onDocumentOptionDown, false)
    window.removeEventListener('keyup', onDocumentOptionUp, false)
  }

  function dispose() {
    deactivate()
  }

  function onDocumentMouseMove(event) {
    console.log(_camera.position, _camera.rotation)
    event.preventDefault()
    var rect = _domElement.getBoundingClientRect()
    _mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    _raycaster.setFromCamera(_mouse, _camera)

    var movementX =
    event.movementX || event.mozMovementX || event.webkitMovementX || 0
    var movementY =
    event.movementY || event.mozMovementY || event.webkitMovementY || 0

    yawObject.rotation.y -= movementX * 0.002
    pitchObject.rotation.x -= movementY * 0.004

    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    )

    if (_selected && scope.enabled) {
      if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
        _selected.position.copy(_intersection.sub(_offset))
        _selected.position.round()
      }
      return
    }

    var intersects = _raycaster.intersectObjects(_objects)

    if (intersects.length > 0) {
      var object = intersects[0].object

      _plane.setFromNormalAndCoplanarPoint(
        _camera.getWorldDirection(_plane.normal),
        object.position
      )

      if (_hovered !== object) {
        _domElement.style.cursor = 'pointer'
        _hovered = object
      }
    } else if (_hovered !== null) {
      _domElement.style.cursor = 'auto'
      _hovered = null
    }
    // _camera.rotation.
    const origin = new THREE.Vector3(0,0,0)
    mouseVectorForBox.copy(origin)
    mouseVectorForBox.addScaledVector(_raycaster.ray.direction, scale)
    previewBox.position.copy(mouseVectorForBox)
    previewBox.position.round()
    console.log(previewBox.position)
    // _camera.rotation.y = -1 * _mouse.x * Math.PI // left or counterclockwise
    // _camera.rotation.z =0; // world tilt right
  }

  function onDocumentKeyDown(event) {
    switch (event.which) {
      case 87: //W
        _camera.position.z -= 1
        break
      case 83: // S
        _camera.position.z += 1
        break
      case 65: //A
        _camera.position.x -= 1
        break
      case 68: //D
        _camera.position.x += 1
        break
      case 69: //Q
        _camera.position.y += 1
        break
      case 81: //E
        _camera.position.y -= 1
        break
    }
  }

  function onDocumentMouseDown(event) {
    var v = _raycaster.ray.direction;
    var direction = new THREE.Vector3(0, 0, -1)
    var rotation = new THREE.Euler(0, 0, 0, 'YXZ')
    rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0)
    v.copy(direction).applyEuler(rotation)
    console.log(v);
    event.preventDefault()
    _raycaster.setFromCamera(_mouse, _camera)

    var intersects = _raycaster.intersectObjects(_objects)

    if (intersects.length > 0) {
      _selected = intersects[0].object
      _domElement.style.cursor = 'move'
    }
    if (_shiftIsDown) {
      console.log('trying to add cube')
      _domElement.style.cursor = _hovered ? 'pointer' : 'auto'
      const cubeColor = 0xb9c4c0
      const cube = makeUnitCube(
        previewBox.position.x,
        previewBox.position.y,
        previewBox.position.z,
        cubeColor,
        1
      );
      _scene.add(cube)
      _objects = _scene.children
    } else if (_commandIsDown) {
      _scene.remove(_selected)
      _selected.geometry.dispose()
      _selected.material.dispose()
      _selected = undefined
      _objects = _scene.children
    }
  }

  function onDocumentMouseCancel(event) {
    event.preventDefault()

    if (_selected) {
      window.removeEventListener('keydown', onDocumentKeyDown, false)
      _selected = null
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

    var direction = new THREE.Vector3(0, 0, -1)
    var rotation = new THREE.Euler(0, 0, 0, 'YXZ')

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
