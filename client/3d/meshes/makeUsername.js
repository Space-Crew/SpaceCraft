import * as THREE from 'three'

export const makeUsername = username => {
  let userMesh
  const textToDisplay = username ? username : 'guest'
  const fontLoader = new THREE.FontLoader()
  fontLoader.load('/fonts/gentilis_regular.typeface.json', font => {
    const material = new THREE.MeshPhongMaterial({
      color: '#F9EDEB',
      side: THREE.DoubleSide
    })
    const geom = new THREE.TextGeometry(textToDisplay, {
      font: font,
      size: 2,
      height: 1
    })
    userMesh = new THREE.Mesh(geom, material)
    console.log(userMesh)
  })

  // place name above avatar //
  userMesh.position.set(0, 2.5, 0)
  return userMesh
}
