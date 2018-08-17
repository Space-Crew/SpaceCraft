import {makeUnitCube} from './'
import {TextureLoader} from 'three'

const waterTexture = new TextureLoader().load('/textures/water.jpg')

export function makeWaterCube(position) {
  const cube = makeUnitCube(position, 0xffffff, 0.6)
  cube.material.map = waterTexture
  return cube
}
