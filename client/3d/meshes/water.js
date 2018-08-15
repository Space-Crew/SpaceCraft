import {makeUnitCube} from '.'
import * as THREE from 'three'
import {toKey, toPosition} from '..'

export function generateWater(listOfWaterSources, cubes) {
  const waterCubes = []
  listOfWaterSources.forEach(waterSource => {
    makeWaterCubes(waterSource, cubes, waterCubes)
  })
  return waterCubes
}

function makeWaterCubes(waterSource, cubes, waterCubes) {
  makeWaterCube(waterSource.position, 3, cubes, waterCubes)
}

export class FlowCube {
  constructor(x = 0, y = 0, z = 0, isSource = false, parents = {}, volume = 1) {
    this.position = {x, y, z}
    this.isSource = isSource
    this.parents = parents
    this.children = {}
    this.volume = volume
  }
  createChild(childPosition, flowMap) {
    const key = toKey(childPosition)
    if (!flowMap[key] && this.volume > 1) {
      const child = new FlowCube(
        childPosition.x,
        childPosition.y,
        childPosition.z,
        false,
        {[toKey(this.position)]: this},
        this.volume - 1
      )
      this.children[key] = child
      flowMap[key] = child
    }
  }
  spawnChildren(cubes, flowMap) {}
  removeChildren(flowMap) {
    this.children.forEach(child => {
      delete flowMap[toKey(child.position)]
    })
    this.children = {}
  }
}

class WaterMap {
  constructor() {
    this.positions = {}
  }
}

function makeWaterCube(
  position,
  puddleLength, // water should only flow so far
  cubes,
  waterCubes
) {
  //basecase - block already there, so water can't flow into it
  // or water is already there
  // or puddleLength = 0
  const basecase = puddleLength === 0 || cubes[toKey(position)]
  if (basecase) {
    return waterCubes
  }
  const cube = makeUnitCube(position, 0x0000ff, 1)
  cube.name = 'WATER'
  waterCubes.push(cube)
  const oneDown = position.clone()
  oneDown.y -= 1
  const shouldFlowDown = !cubes[toKey(oneDown)] && oneDown.y > -64
  if (shouldFlowDown) {
    makeWaterCube(oneDown, puddleLength, cubes, waterCubes)
  } else {
    //flow in all directions
    const northPosition = position.clone()
    northPosition.z += 1
    makeWaterCube(northPosition, puddleLength - 1, cubes, waterCubes)
    const southPosition = position.clone()
    southPosition.z -= 1
    makeWaterCube(southPosition, puddleLength - 1, cubes, waterCubes)
    const eastPosition = position.clone()
    eastPosition.x += 1
    makeWaterCube(eastPosition, puddleLength - 1, cubes, waterCubes)
    const westPosition = position.clone()
    makeWaterCube(westPosition, puddleLength - 1, cubes, waterCubes)
    westPosition.x -= 1
  }
}
