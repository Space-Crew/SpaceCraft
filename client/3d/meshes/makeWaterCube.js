// import {makeUnitCube} from './'
import * as THREE from 'three'

export function makeWaterCube(position) {
  const waterTexture = new THREE.TextureLoader().load('/textures/water.jpg')
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff
  }) //Lambert is so that the material can be affected by light
  material.transparent = true
  material.opacity = 0.6
  material.map = waterTexture
  const cube = new THREE.Mesh(geometry, material)
  cube.position.copy(position)
  return cube
}
