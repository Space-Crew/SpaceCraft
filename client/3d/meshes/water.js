import {toKey, toPosition} from '..'

export class FlowCube {
  constructor(x = 0, y = 0, z = 0, isSource = false, volume = 1) {
    this.position = {x, y, z}
    this.isSource = isSource
    this.volume = volume
    this.parents = {}
    this.children = {}
  }
  createChild(childPosition, flowMap, shouldDecrementVolume = true) {
    if (this._hasVolumeToFlow(shouldDecrementVolume)) {
      const cubeAtKey = flowMap[toKey(childPosition)]
      if (cubeAtKey) {
        return this._linkChild(cubeAtKey)
      } else {
        return this._flowInto(childPosition, flowMap, shouldDecrementVolume)
      }
    }
    return null
  }
  spawnChildren(cubes, flowMap) {
    const createdChildren = []
    const oneDown = this._clonePosition()
    oneDown.y -= 1
    const shouldFlowDown = !cubes[toKey(oneDown)] && oneDown.y >= -64
    if (shouldFlowDown) {
      const child = this.createChild(oneDown, flowMap, false)
      if (child) createdChildren.push(child)
    } else {
      this._flowHorizontally(cubes, flowMap).forEach(child => {
        if (child) createdChildren.push(child)
      })
    }
    createdChildren.forEach(child => child.spawnChildren(cubes, flowMap))
  }

  removeChildren(flowMap) {
    Object.values(this.children).forEach(child => {
      const parents = child.parents
      delete parents[toKey(this.position)]
      if (Object.keys(parents).length === 0) {
        child.removeChildren(flowMap)
        delete flowMap[toKey(child.position)]
      }
    })
    this.children = {}
  }
  _addChild(cube) {
    this.children[toKey(cube.position)] = cube
  }
  _addParent(cube) {
    this.parents[toKey(cube.position)] = cube
  }
  _clonePosition() {
    return {...this.position}
  }
  _flowHorizontally(cubes, flowMap) {
    const createdChildren = []
    const adjacentPositions = this._getAdjacentPositions()
    adjacentPositions.forEach(position => {
      const shouldFlow = !cubes[toKey(position)]
      if (shouldFlow) {
        createdChildren.push(this.createChild(position, flowMap))
      }
    })
    return createdChildren
  }
  _flowInto(childPosition, flowMap, shouldDecrementVolume) {
    const child = new FlowCube(
      childPosition.x,
      childPosition.y,
      childPosition.z,
      false,
      shouldDecrementVolume ? this.volume - 1 : this.volume
    )
    this._linkChild(child)
    flowMap[toKey(childPosition)] = child
    return child
  }
  _getAdjacentPositions() {
    const northPosition = this._clonePosition()
    northPosition.z += 1
    const southPosition = this._clonePosition()
    southPosition.z -= 1
    const eastPosition = this._clonePosition()
    eastPosition.x += 1
    const westPosition = this._clonePosition()
    westPosition.x -= 1

    const positions = [northPosition, eastPosition, southPosition, westPosition]
    return positions
  }
  _hasVolumeToFlow(shouldDecrementVolume) {
    return shouldDecrementVolume ? this.volume > 1 : this.volume > 0
  }
  _linkChild(child) {
    if (!child.isSource) {
      this._addChild(child)
      child._addParent(this)
      return child
    }
    return null
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
