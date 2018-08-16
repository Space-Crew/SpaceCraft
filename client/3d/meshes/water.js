import {makeUnitCube} from '.'
import * as THREE from 'three'
import {toKey, toPosition} from '..'

export class FlowCube {
  constructor(x = 0, y = 0, z = 0, isSource = false, parents = {}, volume = 1) {
    this.position = {x, y, z}
    this.isSource = isSource
    this.parents = parents
    this.children = {}
    this.volume = volume
  }
  createChild(childPosition, flowMap, shouldDecrementVolume = true) {
    const key = toKey(childPosition)
    const hasVolumeToFlow = shouldDecrementVolume
      ? this.volume > 1
      : this.volume > 0
    if (!flowMap[key] && hasVolumeToFlow) {
      const child = new FlowCube(
        childPosition.x,
        childPosition.y,
        childPosition.z,
        false,
        {[toKey(this.position)]: this},
        shouldDecrementVolume ? this.volume - 1 : this.volume
      )
      this.children[key] = child
      flowMap[key] = child
      return child
    }
    return null
  }
  clonePosition() {
    return {...this.position}
  }
  spawnChildren(cubes, flowMap) {
    const createdChildren = []
    const oneDown = this.clonePosition()
    oneDown.y -= 1
    const shouldFlowDown = !cubes[toKey(oneDown)] && oneDown.y >= -64
    if (shouldFlowDown) {
      createdChildren.push(this.createChild(oneDown, flowMap, false))
    } else {
      //flow in all directions
      const adjacentPositions = this.getAdjacentPositions()
      adjacentPositions.forEach(position => {
        const shouldFlow = !cubes[toKey(position)]
        if (shouldFlow) {
          createdChildren.push(this.createChild(position, flowMap))
        }
      })
    }
    createdChildren.forEach(child => {
      if (child) {
        child.spawnChildren(cubes, flowMap)
      }
    })
  }
  getAdjacentPositions() {
    const northPosition = this.clonePosition()
    northPosition.z += 1
    const southPosition = this.clonePosition()
    southPosition.z -= 1
    const eastPosition = this.clonePosition()
    eastPosition.x += 1
    const westPosition = this.clonePosition()
    westPosition.x -= 1

    const positions = [northPosition, eastPosition, southPosition, westPosition]
    return positions
  }
  removeChildren(flowMap) {
    const children = Object.values(this.children)
    children.forEach(child => {
      const parents = child.parents
      delete parents[toKey(this.position)]
      delete this.children[toKey(child.position)]
      if (Object.keys(parents).length === 0) {
        delete flowMap[toKey(child.position)]
      }
    })
    this.children = {}
  }
}

// export function generateWater(listOfWaterSources, cubes) {
//   const waterCubes = []
//   listOfWaterSources.forEach(waterSource => {
//     makeWaterCubes(waterSource, cubes, waterCubes)
//   })
//   return waterCubes
// }

// function makeWaterCubes(waterSource, cubes, waterCubes) {
//   makeWaterCube(waterSource.position, 3, cubes, waterCubes)
// }

// function makeWaterCube(position, cubes, waterCubes) {
//   //basecase - block already there, so water can't flow into it
//   // or water is already there
//   if (basecase) {
//     return waterCubes
//   }
//   const cube = makeUnitCube(position, 0x0000ff, 1)
//   cube.name = 'WATER'
//   waterCubes.push(cube)
//   const oneDown = position.clone()
//   oneDown.y -= 1
//   const shouldFlowDown = !cubes[toKey(oneDown)] && oneDown.y > -64
//   if (shouldFlow){
//     if (shouldFlowDown) {
//       //makeWaterCube(oneDown)
//     } else {
//       //flow in all directions
//       const northPosition = position.clone()
//       northPosition.z += 1
//       const southPosition = position.clone()
//       southPosition.z -= 1
//       const eastPosition = position.clone()
//       eastPosition.x += 1
//       const westPosition = position.clone()
//       westPosition.x -= 1
//       //makeWaterCube of all psoitions
//     }
//   }
// }
