import * as THREE from 'three'
import fontJson from '../../../public/fonts/gentilis_regular.typeface.json'
const font = new THREE.Font(fontJson)

export const makeUsername = username => {
  let userMesh
  const textToDisplay = username ? username : 'guest'
  const material = new THREE.MeshBasicMaterial({
    color: '#F9EDEB'
  })
  const geom = new THREE.TextGeometry(textToDisplay, {
    font: font,
    size: 0.1,
    height: 0.05
  })
  userMesh = new THREE.Mesh(geom, material)
  userMesh.position.set(-0.2, 2.5, 0)
  return userMesh
}
