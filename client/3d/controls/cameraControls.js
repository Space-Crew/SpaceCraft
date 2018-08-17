import * as THREE from 'three'

export function attatchCameraControls(camera, domElement) {
  const cameraControls = makeCameraControls(camera)
  cameraControls.activate = () =>
    domElement.addEventListener('mousemove', cameraControls.moveWithMouse)
  cameraControls.dispose = () =>
    domElement.removeEventListener('mousemove', cameraControls.moveWithMouse)
  cameraControls.activate()
  return cameraControls
}
function makeCameraControls(camera) {
  let pitchObject = makePitchObject(camera)
  let yawObject = makeYawObject(pitchObject)
  const cameraControls = {pitchObject, yawObject}
  cameraControls.moveWithMouse = moveWithMouse.bind(cameraControls)
  return cameraControls
}

function makePitchObject(camera) {
  const pitchObject = new THREE.Object3D()
  pitchObject.add(camera)
  pitchObject.rotation.x = Math.PI / 2
  return pitchObject
}

function makeYawObject(pitchObject) {
  const yawObject = new THREE.Object3D()
  yawObject.position.y = 0
  yawObject.add(pitchObject)
  return yawObject
}

function moveWithMouse(event) {
  //this should be a camera controls object
  event.preventDefault()
  rotateYawObject(this.yawObject, event)
  rotatePitchObject(this.pitchObject, event)
}
function rotateYawObject(yawObject, event) {
  const movementX =
    event.movementX || event.mozMovementX || event.webkitMovementX || 0
  yawObject.rotation.y -= movementX * 0.002
}

function rotatePitchObject(pitchObject, event) {
  const movementY =
    event.movementY || event.mozMovementY || event.webkitMovementY || 0

  pitchObject.rotation.x -= movementY * 0.004
  pitchObject.rotation.x = Math.max(
    -Math.PI / 2,
    Math.min(Math.PI / 2, pitchObject.rotation.x)
  )
}
