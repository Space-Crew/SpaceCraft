import * as THREE from 'three'

const CameraControl = function(_camera, _domElement) {

  const _mouse = new THREE.Vector2()
  const _raycaster = new THREE.Raycaster()

  _camera.rotation.x = -Math.PI / 2
  
  //pitchObject
  let pitchObject = new THREE.Object3D()
  pitchObject.add(_camera)
  pitchObject.rotation.x = Math.PI / 2
  //yawObject
  let yawObject = new THREE.Object3D()
  yawObject.position.y = 0
  yawObject.add(pitchObject)

  // const cubesToBeMoved = {}
  // let originalPosition

  // _scene.add(previewBox)

  function activate() {
    _domElement.addEventListener('mousemove', onDocumentMouseMove, false)
    window.addEventListener('keydown', onDocumentKeyDown, false)
  }

  function deactivate() {
    _domElement.removeEventListener('mousemove', onDocumentMouseMove, false)
    window.removeEventListener('keydown', onDocumentKeyDown, false)
  }
  
  function onDocumentMouseMove(event) {
    event.preventDefault()
    const rect = _domElement.getBoundingClientRect()
    _mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1
    _mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    _raycaster.setFromCamera(_mouse, _camera)
  
    const movementX =  event.movementX
    const movementY =  event.movementY
  
    yawObject.rotation.y -= movementX * 0.002
    pitchObject.rotation.x -= movementY * 0.004
  
    pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, pitchObject.rotation.x)
    )
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
      default:
        break
    }
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