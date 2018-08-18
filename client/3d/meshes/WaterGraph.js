import FlowCube from './water'
import {toKey} from '..'

export default class FlowGraph {
  constructor(sources = {}, worldCubes = {}) {
    this.sources = sources
    this.worldCubes = worldCubes
    this.flowCubes = {}
    this.spawnCubesFromSources()
  }
  /**********************
   * Initialize graph
   **********************/
  spawnCubesFromSources() {
    Object.values(this.sources).forEach(source => {
      this.flowCubes[toKey(source)] = new FlowCube(source, true)
      this.flowCubes[toKey(source)].spawnChildren(
        this.worldCubes,
        this.flowCubes
      )
    })
  }
  /**********************
   * Edit sources
   **********************/
  spawnSourceAt(position) {
    const source = this.addSourceAt(position)
    source.spawnChildren(this.worldCubes, this.flowCubes)
  }
  addSourceAt(position) {
    let sourceAtPosition = this.flowCubes[toKey(position)]
    if (!sourceAtPosition) {
      const newSource = new FlowCube(position, true)
      this.flowCubes[toKey(position)] = newSource
      this.sources[toKey(position)] = newSource.position
      sourceAtPosition = newSource
    }
    return sourceAtPosition
  }
  /**********************
   * Change all the water when a player puts block in the way
   **********************/
  createObstacleAt(position) {
    this.worldCubes[toKey(position)] = true //data not that important I think
    const cubeAtPosition = this.flowCubes[toKey(position)]
    if (cubeAtPosition) {
      const parents = cubeAtPosition.parents
      this.destroyLineage(cubeAtPosition)
      this.triggerParents(parents)
    }
  }
  destroyLineage(cube) {
    let destroyTheseBreadthFirst = []
    while (cube) {
      destroyTheseBreadthFirst.push(...Object.values(cube.children))
      cube.unlinkParents()
      this.removeFromGraph(cube)
      cube = destroyTheseBreadthFirst.shift()
    }
  }
  removeFromGraph(cube) {
    if (cube.isSource) {
      delete this.sources[toKey(cube.position)]
    }
    delete this.flowCubes[toKey(cube.position)]
  }
  triggerParents(parents) {
    Object.values(parents).forEach(parent =>
      parent.spawnChildren(this.worldCubes, this.flowCubes)
    )
  }
  /******
   *
   */

  updateCube
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
  _flowInto(childPosition, flowMap) {
    const child = new FlowCube(childPosition, false)
    this._linkChild(child)
    flowMap[toKey(childPosition)] = child
    return child
  }
}
