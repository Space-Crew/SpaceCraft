import {makeUnitCube} from './'
import {TextureLoader} from 'three'

export function makeWaterCube(position) {
  const waterTexture = new TextureLoader().load('/textures/water.jpg')
  const cube = makeUnitCube(position, 0xffffff, 0.6)
  cube.material.map = waterTexture
  return cube
}
