import * as THREE from 'three'
import {darken} from './darken'

export function makeUnitCube(position, color = 0xb9c4c0, opacity, texture) {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshLambertMaterial({
    color
  }) //Lambert is so that the material can be affected by light
  material.transparent = true
  material.opacity = opacity
  if (texture) {
    material.map = new THREE.TextureLoader().load(texture)
  }
  const mesh = new THREE.Mesh(geometry, material)
  var geo = new THREE.EdgesGeometry(mesh.geometry)
  var mat = new THREE.LineBasicMaterial({
    color: darken(color, -0.1),
    linewidth: 3
  })
  var wireframe = new THREE.LineSegments(geo, mat)
  wireframe.renderOrder = 1
  mesh.add(wireframe)
  mesh.position.copy(position)
  return mesh
}
