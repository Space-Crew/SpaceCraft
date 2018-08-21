import * as THREE from 'three'

const CameraControl = function(_camera, _domElement) {

  let pitchObject = new THREE.Object3D()
  pitchObject.add(_camera)

  let yawObject = new THREE.Object3D()
  yawObject.add(pitchObject)

  function activate() {
    _domElement.addEventListener('mousemove', onMouseMove, false)
  }

  function deactivate() {
    _domElement.removeEventListener('mousemove', onMouseMove, false)
  }

  function onMouseMove(event) {
    event.preventDefault()

    const movementX = event.movementX
    const movementY = event.movementY

    yawObject.rotation.y -= movementX * 0.004
    pitchObject.rotation.x -= movementY * 0.004

    pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, pitchObject.rotation.x)
    )
  }

  function dispose() {
    deactivate()
  }

  activate()

  // API
  this.getObject = function() {
    return yawObject
  }
  this.enabled = true

  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose
}

export default CameraControl
