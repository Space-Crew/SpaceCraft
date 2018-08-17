import * as THREE from 'three'

function getMouse(event) {
  const domElement = event.target // ?????
  const rect = domElement.getBoundingClientRect()
  _mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1
  _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
}

function WTF(camera, domElement) {
  let pitchObject = new THREE.Object3D()
  pitchObject.add(camera)
  pitchObject.rotation.x = Math.PI / 2

  let yawObject = new THREE.Object3D()
  yawObject.position.y = 0
  yawObject.add(pitchObject)
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
    const isMovePositionOccupied = checkPositionOccupied(mouseVector, _objects)
    if (!isMovePositionOccupied) {
      const cubesRef = db.ref(`/worlds/${worldId}/cubes`)
      cubesRef.child('temp').set({
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
