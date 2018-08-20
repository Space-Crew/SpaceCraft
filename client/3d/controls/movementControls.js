function attachMovment(camera, domElement) {
  domElement.addEventListener('keydown', movePlayer)
}

function movePlayer(event) {
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
