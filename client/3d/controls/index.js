export {attachCameraControls} from './cameraControls'

import * as THREE from 'three'

export function getMouse(event) {
  const mouse = new THREE.Vector2()
  const domElement = event.currentTarget //should be the domElement listening to mouse events, i.e. our renderer
  const rect = domElement.getBoundingClientRect()
  mouse.x = (event.clientX - rect.left) / rect.width * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  return mouse
}
