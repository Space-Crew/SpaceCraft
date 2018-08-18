import {toKey, toPosition} from '..'

export default class FlowCube {
  constructor(x = 0, y = 0, z = 0, isSource = false) {
    this.position = {x, y, z}
    this.isSource = isSource
    this.parents = {}
    this.children = {}
  }
  /*************
   * SpawnChildren
   *************/
  spawnChildren(cubes, flowMap, queueBreadthFirst = []) {
    queueBreadthFirst.push(...this._findSpacesToFlowInto(cubes, flowMap))
    //shift can be optimized
    const newChild = queueBreadthFirst.shift()
    if (newChild) {
      newChild.spawnChildren(cubes, flowMap, queueBreadthFirst)
    }
  }
  _findSpacesToFlowInto(cubes, flowMap) {
    const childrenThatSpawnMoreChildren = []
    const shouldFlowDown = !cubes[toKey(this._down)] && this.position.y > -64
    if (shouldFlowDown) {
      const child = this._flowDown(flowMap)
      if (child) childrenThatSpawnMoreChildren.push(child)
    } else {
      this._flowHorizontally(cubes, flowMap).forEach(child => {
        if (child) childrenThatSpawnMoreChildren.push(child)
      })
    }
    return childrenThatSpawnMoreChildren
  }
  _flowDown(flowMap) {
    return this._createChild(this._down, flowMap)
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
  _createChild(childPosition, flowMap) {
    //returns the child if the child needs to spawn more children
    if (this._hasVolumeToFlow(childPosition)) {
      const cubeAtPosition = flowMap[toKey(childPosition)]
      if (cubeAtPosition) {
        return this._combineWith(cubeAtPosition)
      } else {
        return this._flowInto(childPosition, flowMap)
      }
    }
    return null
  }
  _hasVolumeToFlow(position) {
    return samePosition(this._down, position)
      ? this.volume > 0
      : this.volume > 1
    function samePosition(a, b) {
      return a.x === b.x && a.y === b.y && a.z === b.z
    }
  }
  get volume() {
    if (this.storedVolume != undefined) return this.storedVolume
    if (this.isSource) return 4 //default value
    this.storedVolume = this._loseVolume(this._maxVolumeOfParents)
    return this.storedVolume
  }
  get _parentWithBiggestVolume() {
    if (this.isSource) return null
    return Object.values(this.parents).reduce(
      (biggestParentSoFar, currentParent) => {
        return currentParent.volume > biggestParentSoFar.volume
          ? currentParent
          : biggestParentSoFar
      }
    )
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
  _combineWith(cube) {
    //returns the child if the child needs to spawn more children
    const originalCubeVolume = cube.volume
    this._linkChild(cube)
    if (cube.volume > originalCubeVolume) {
      return cube
    }
    return null
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
  get _up() {
    const result = this._clonePosition()
    result.y += 1
    return result
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
  _clonePosition() {
    return {...this.position}
  }
  _unlinkChild(child) {
    delete this.children[toKey(child.position)]
    delete child.parents[toKey(this.position)]
  }
}
