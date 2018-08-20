import * as THREE from 'three'

const CameraControl = function(_camera, _domElement) {
  let pitchObject = new THREE.Object3D()
  pitchObject.add(_camera)

  let yawObject = new THREE.Object3D()
  yawObject.position.y = 0
  yawObject.add(pitchObject)

  function activate() {
    _domElement.addEventListener('mousemove', onMouseMove, false)
    window.addEventListener('keydown', onKeyDown, false)
    window.addEventListener('keyup', onKeyUp, false)
  }

  function deactivate() {
    _domElement.removeEventListener('mousemove', onMouseMove, false)
    window.removeEventListener('keydown', onKeyDown, false)
    window.removeEventListener('keyup', onKeyUp, false)
  }

  function onMouseMove(event) {
    event.preventDefault()

    const movementX = event.movementX
    const movementY = event.movementY

    yawObject.rotation.y -= movementX * 0.002
    pitchObject.rotation.x -= movementY * 0.004

    pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, pitchObject.rotation.x)
    )
  }

  //yawObject.translateZ(-1)

  let vectors = {}
  vectors.isMoving = function() {
    return (
      this.movingForward ||
      this.movingBackward ||
      this.movingLeft ||
      this.movingRight
    )
  }
  function onKeyDown(event) {
    switch (event.which) {
      case 87: //W
        vectors.movingForward = true
        break
      case 83: // S
        vectors.movingBackward = true
        break
      case 65: //A
        vectors.movingLeft = true
        break
      case 68: //D
        vectors.movingRight = true
        break
      default:
        break
    }
  }
  function updatePlayerPosition() {
    if (vectors.isMoving()) {
      const motionVector = vectors.getMotionVector()
      moveYawObject(motionVector)
    }
  }
  vectors.getMotionVector = function() {
    const motionVector = new THREE.Vector3()
    if (this.movingForward) {
      motionVector.z -= 1
    }
    if (this.movingBackward) {
      motionVector.z += 1
    }
    if (this.movingLeft) {
      motionVector.x -= 1
    }
    if (this.movingRight) {
      motionVector.x += 1
    }
    motionVector.normalize()
    return motionVector
  }
  function moveYawObject(motionVector, speed = 0.167) {
    yawObject.translateOnAxis(motionVector, speed)
  }
  function onKeyUp(event) {
    switch (event.which) {
      case 87: //W
        vectors.movingForward = false
        break
      case 83: // S
        vectors.movingBackward = false
        break
      case 65: //A
        vectors.movingLeft = false
        break
      case 68: //D
        vectors.movingRight = false
        break
      case 69: //Q
        yawObject.translateY(1)
        break
      case 81: //E
        yawObject.translateY(-1)
        break
      default:
        break
    }
  }

  function dispose() {
    deactivate()
  }

  activate() //TODO why is this being run?

  // API
  this.getObject = function() {
    return yawObject
  }
  this.enabled = true

  this.updatePlayerPosition = updatePlayerPosition
  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose
}

export default CameraControl

//TODO use this in rotating camera 360 degrees
function getMouse(event) {
  const mouse = new THREE.Vector2()
  const domElement = event.currentTarget //should be the domElement listening to mouse events, i.e. our renderer
  const rect = domElement.getBoundingClientRect()
  mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  return mouse
}
