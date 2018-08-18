import FlowCube from './water'
import {toKey} from '..'

export default class FlowGraph {
  constructor(sourcePositions = {}, worldCubes = {}) {
    this.sourcePositions = sourcePositions
    this.worldCubes = worldCubes
    this.flowCubes = {}
    this.spawnCubesFromSourcePositions()
  }
  /**********************
   * Initialize graph
   **********************/
  spawnCubesFromSourcePositions() {
    Object.values(this.sourcePositions).forEach(sourcePosition => {
      this.flowCubes[toKey(sourcePosition)] = new FlowCube(sourcePosition, true)
      this.spawnChildrenFor(this.flowCubes[toKey(sourcePosition)])
    })
  }
  /**********************
   * Edit sources
   **********************/
  spawnSourceAt(position) {
    if (!this.hasSourceAt(position)) {
      const source = this.makeSourceAt(position)
      this.spawnChildrenFor(source)
    }
  }
  hasSourceAt(position) {
    return !!this.source[toKey(position)]
  }
  makeSourceAt(position) {
    const newSource = new FlowCube(position, true)
    this.flowCubes[toKey(position)] = newSource
    this.sourcePositions[toKey(position)] = newSource.position
    return newSource
  }
  deleteSourceAt(position) {
    if (this.hasSourceAt(position)) {
      this.destroyLineage(this.flowCubes(toKey[position]))
    }
  }
  /**********************
   * Change all the water when a player puts block in the way
   **********************/
  createObstacleAt(position) {
    this.worldCubes[toKey(position)] = true //data not that important I think
    if (this.hasCubeAt(position)) {
      this.triggerUpdateAt(position)
    }
  }
  triggerUpdateAt(position) {
    const cube = this.flowCubes[toKey(position)]
    const parents = Object.assign({}, cube.parents)
    this.destroyLineage(cube)
    this.makeCubesRespawn(parents)
  }
  hasCubeAt(position) {
    return !!this.flowCubes[toKey(position)]
  }
  destroyLineage(cube) {
    let destroyTheseBreadthFirst = []
    while (cube) {
      destroyTheseBreadthFirst.push(...Object.values(cube.children))
      this.destoryCube(cube)
      cube = destroyTheseBreadthFirst.shift()
    }
  }
  destoryCube(cube) {
    cube.unlinkParents()
    this.removeFromGraph(cube)
  }
  removeFromGraph(cube) {
    if (cube.isSource) {
      delete this.sourcePositions[toKey(cube.position)]
    }
    delete this.flowCubes[toKey(cube.position)]
  }
  makeCubesRespawn(cubes) {
    Object.values(cubes).forEach(cube => this.spawnChildrenFor(cube))
  }
  spawnChildrenFor(cube, queueBreadthFirst = []) {
    queueBreadthFirst.push(...this.findSpacesToFlowInto())
    const newChild = queueBreadthFirst.shift()
    if (newChild) {
      newChild.spawnChildrenFor(queueBreadthFirst)
    }
    //shift can be optimized
  }
  findSpacesToFlowInto() {
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
