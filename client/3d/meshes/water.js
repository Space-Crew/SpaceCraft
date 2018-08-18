import {toKey, toPosition} from '..'

export default class FlowCube {
  constructor(position = {x: 0, y: 0, z: 0}, isSource = false) {
    this.position = position
    this.isSource = isSource
    this.parents = {}
    this.children = {}
    //volume REFACTOR
  }
  /*************
   * Volume
   *************/
  get volume() {
    if (this.storedVolume != undefined) return this.storedVolume
    if (this.isSource) return 4 //default value
    this.storedVolume = this._loseVolume(this._maxVolumeOfParents)
    return this.storedVolume
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
  _loseVolume(max) {
    //should not lose volume if it's flowing down
    const parentAbove = this.parents[toKey(this._up)]
    if (parentAbove && parentAbove.volume === max) {
      return max
    }
    return max - 1
  }
  _hasVolumeToFlow(position) {
    return samePosition(this._down, position)
      ? this.volume > 0
      : this.volume > 1
    function samePosition(a, b) {
      return a.x === b.x && a.y === b.y && a.z === b.z
    }
  }
  /*****************
   * Public methods
   *****************/
  unlinkParents() {
    Object.values(this.parents).forEach(parent => {
      parent._unlinkChild(this)
    })
  }
  /*****************
   * Private methods
   *****************/
  _combineWith(cube) {
    //REWORK
    //returns the child if the child needs to spawn more children
    const originalCubeVolume = cube.volume
    this._linkChild(cube)
    if (cube.volume > originalCubeVolume) {
      return cube
    }
    return null
  }
  _linkChild(child) {
    if (!child.isSource) {
      this._addChild(child)
      child._addParent(this)
      return child
    }
    return null
  }
  _addChild(cube) {
    this.children[toKey(cube.position)] = cube
  }
  _addParent(cube) {
    this.parents[toKey(cube.position)] = cube
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
  _clonePosition() {
    return {...this.position}
  }
  _unlinkChild(child) {
    delete this.children[toKey(child.position)]
    delete child.parents[toKey(this.position)]
  }
  // get _parentWithBiggestVolume() {
  //   if (this.isSource) return null
  //   return Object.values(this.parents).reduce(
  //     (biggestParentSoFar, currentParent) => {
  //       return currentParent.volume > biggestParentSoFar.volume
  //         ? currentParent
  //         : biggestParentSoFar
  //     }
  //   )
  // }
}
