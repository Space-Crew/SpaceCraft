// import {makeUnitCube} from './'
import * as THREE from 'three'

export function makeWaterCube(flowCube) {
  const waterTexture = new THREE.TextureLoader().load('/textures/water.jpg')
  const height = getHeight(flowCube)
  const geometry = new THREE.BoxGeometry(1, height, 1)
  const material = new THREE.MeshLambertMaterial({
    color: 0xffffff
  }) //Lambert is so that the material can be affected by light
  material.transparent = true
  material.opacity = 0.4 + 0.2 * getHeight(flowCube)
  material.map = waterTexture
  const cube = new THREE.Mesh(geometry, material)
  cube.position.copy(getAdjustedPosition(flowCube))
  cube.name = 'water'
  return cube
}

function getHeight(flowCube) {
  if (flowCube.isFlowingDown()) {
    return 1
  }
  return flowCube.volume / flowCube.sourceVolume
}

function getAdjustedPosition(flowCube) {
  const newPosition = flowCube.clonePosition()
  newPosition.y -= 0.5 - getHeight(flowCube) / 2
  return newPosition
}
