import * as THREE from 'three'
import fontJson from '../../../../public/fonts/gentilis_regular.typeface.json'
const font = new THREE.Font(fontJson)

export const makeUsername = username => {
  let userMesh
  const material = new THREE.MeshBasicMaterial({
    color: '#F9EDEB'
  })
  const geom = new THREE.TextGeometry(username, {
    font: font,
    size: 0.2,
    height: 0.05
  })
  userMesh = new THREE.Mesh(geom, material)
  userMesh.rotation.y = Math.PI
  geom.computeBoundingBox()
  const textWidth = geom.boundingBox.max.x - geom.boundingBox.min.x
  userMesh.position.set(textWidth / 2, 0.5, 0)
  return userMesh
}
