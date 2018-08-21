import {toKey} from '../utilities'

export class FlowCube {
  constructor(
    position = {x: 0, y: 0, z: 0},
    isSource = false,
    volume = 4,
    sourceVolume = 4
  ) {
    this.position = position
    this.isSource = isSource
    this.parents = {}
    this.children = {}
    this.volume = volume
    this.sourceVolume = sourceVolume
  }
  /*************
   * Volume
   *************/
  get maxVolumeOfParents() {
    if (Object.values(this.parents).length === 0) {
      if (!this.isSource) {
        console.log(`maxVolumeOfParents`, this.parents, this)
        throw new Error('flowing cube has no parents but is not a source')
      }
      return this.sourceVolume
    }
    return Math.max(...Object.values(this.parents).map(parent => parent.volume))
  }
  findVolumeBasedOnParents() {
    //should not lose volume if it's flowing down
    const max = this.maxVolumeOfParents
    const parentAbove = this.parents[toKey(this.up)]
    if (parentAbove && parentAbove.volume === max) {
      return max
    }
    return max - 1
  }
  hasVolumeToFlowTo(position) {
    return this.samePosition(this.down, position)
      ? this.volume > 0
      : this.volume > 1
  }
  samePosition(a, b) {
    return a.x === b.x && a.y === b.y && a.z === b.z
  }
  becameBigger(oldVolume) {
    return oldVolume < this.volume
  }
  /*****************
   * Public methods
   *****************/
  isFlowingDown() {
    return Object.values(this.parents).some(parent => {
      return this.samePosition(parent.position, this.up)
    })
  }
  createChildAt(position) {
    const child = new FlowCube(position)
    this.linkChild(child)
    return child
  }
  linkChild(child) {
    if (!child.isSource) {
      this.addChild(child)
      child.addParent(this)
      child.volume = child.findVolumeBasedOnParents()
    }
  }
  unlinkChild(child) {
    delete this.children[toKey(child.position)]
    delete child.parents[toKey(this.position)]
  }
  unlinkParents() {
    Object.values(this.parents).forEach(parent => {
      parent.unlinkChild(this)
    })
  }
  get neighbors() {
    //better name?
    return this.flatNeighbors.concat([this.down])
  }
  get up() {
    const result = this.clonePosition()
    result.y += 1
    return result
  }
  /*****************
   * Private methods
   *****************/
  addChild(cube) {
    this.children[toKey(cube.position)] = cube
  }
  addParent(cube) {
    this.parents[toKey(cube.position)] = cube
  }
  clonePosition() {
    return {...this.position}
  }
  get flatNeighbors() {
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
  get down() {
    const result = this.clonePosition()
    result.y -= 1
    return result
  }
}
