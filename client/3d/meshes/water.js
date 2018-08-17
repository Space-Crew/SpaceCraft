import {toKey, toPosition} from '..'

export class FlowCube {
  constructor(x = 0, y = 0, z = 0, isSource = false) {
    this.position = {x, y, z}
    this.isSource = isSource
    this.parents = {}
    this.children = {}
  }
  /*************
   * Public methods
   *************/
  spawnChildren(cubes, flowMap, queueBreadthFirst = []) {
    queueBreadthFirst.push(...this._findSpacesToFlowInto(cubes, flowMap))
    //shift can be optimized
    const newChild = queueBreadthFirst.shift()
    if (newChild) {
      newChild.spawnChildren(cubes, flowMap, queueBreadthFirst)
    }
  }
  triggerChildRespawn(child) {
    //has volume changed? if so respawn
    if (volumeHasChanged) {
      this.respawnChild(child)
    }
  }
  _destroyChild(child) {
    //what about other parents of this child
    //this matters because a parent might be giving better volume
    //refactor find max parent volume to cover this as well
    child._destroyChildren()
    this._unlinkChild(child)
  }
  _destroyChildren(flowMap) {
    Object.values(this.children).forEach(child => {
      this._destroyChild(child)
    })
  }
  _respawnChild(child) {
    this._destroyChild(child)
    this.spawnChildren()
  }
  /*************
   * Get/Set
   *************/
  get _adjacentPositions() {
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
  get _down() {
    const result = this._clonePosition()
    result.y -= 1
    return result
  }
  get _maxVolumeOfParents() {
    if (Object.values(this.parents).length === 0) {
      if (!this.isSource) {
        console.log(`maxVolumeOfParents`, this.parents, this)
        throw new Error('flowing cube has no parents but is not a source')
      }
      return 4
    }
    // console.log(Object.values(this.parents))
    return Math.max(...Object.values(this.parents).map(parent => parent.volume))
  }
  get _up() {
    const result = this._clonePosition()
    result.y += 1
    return result
  }
  get volume() {
    if (this.storedVolume != undefined) return this.storedVolume
    if (this.isSource) return 4 //default value
    this.storedVolume = this._loseVolume(this._maxVolumeOfParents)
    return this.storedVolume
  }
  /*************
   * Private methods
   *************/
  _addChild(cube) {
    this.children[toKey(cube.position)] = cube
  }
  _addParent(cube) {
    this.parents[toKey(cube.position)] = cube
  }
  _createChild(childPosition, flowMap) {
    //returns the child if the child needs to spawn more children
    if (this._hasVolumeToFlow()) {
      const cubeAtPosition = flowMap[toKey(childPosition)]
      if (cubeAtPosition) {
        return this._combineWith(cubeAtPosition)
      } else {
        return this._flowInto(childPosition, flowMap)
      }
    }
    return null
  }
  _combineWith(cube) {
    //returns the child if the child needs to spawn more children
    const originalCubeVolume = cube.volume
    this._linkChild(cube)
    if (cube.volume > originalCubeVolume) {
      return cube
    }
    return null
  }
  _clonePosition() {
    return {...this.position}
  }
  _findSpacesToFlowInto(cubes, flowMap) {
    const childrenThatSpawnMoreChildren = []
    const shouldFlowDown = !cubes[toKey(this._down)] && this.position.y > -64
    if (shouldFlowDown) {
      const child = this._createChild(this._down, flowMap)
      if (child) childrenThatSpawnMoreChildren.push(child)
    } else {
      this._flowHorizontally(cubes, flowMap).forEach(child => {
        if (child) childrenThatSpawnMoreChildren.push(child)
      })
    }
    return childrenThatSpawnMoreChildren
  }
  _flowHorizontally(cubes, flowMap) {
    const createdChildren = []
    const adjacentPositions = this._adjacentPositions
    adjacentPositions.forEach(position => {
      const shouldFlow = !cubes[toKey(position)]
      if (shouldFlow) {
        createdChildren.push(this._createChild(position, flowMap))
      }
    })
    return createdChildren
  }
  _flowInto(childPosition, flowMap) {
    const child = new FlowCube(
      childPosition.x,
      childPosition.y,
      childPosition.z,
      false
    )
    this._linkChild(child)
    flowMap[toKey(childPosition)] = child
    return child
  }
  _hasVolumeToFlow() {
    return this.volume > 1
  }
  _linkChild(child) {
    if (!child.isSource) {
      this._addChild(child)
      child._addParent(this)
      return child
    }
    return null
  }
  _loseVolume(max) {
    //should not lose volume if it's flowing down
    const parentAbove = this.parents[toKey(this._up)]
    if (parentAbove && parentAbove.volume === max) {
      return max
    }
    return max - 1
  }
  _unlinkChild(child) {
    delete this.children[toKey(child.position)]
    delete child.parents[toKey(this.position)]
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

// let source
// let flowMap
// source = new FlowCube(0, 0, 0, true)
// flowMap = {'0,0,0': source}
// source.spawnChildren({}, flowMap)
