import FlowCube from './water'
import {toKey} from '..'

export default class FlowGraph {
  constructor(sourcePositions = {}, worldCubes = {}) {
    //wish I had made all of these Maps so I could iterate and get/set better
    //this is a take away for resume
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
    return !!this.sourcePositions[toKey(position)]
  }
  makeSourceAt(position) {
    const newSource = new FlowCube(position, true)
    this.flowCubes[toKey(position)] = newSource
    this.sourcePositions[toKey(position)] = newSource.position
    return newSource
  }
  deleteSourceAt(position) {
    //BUG!!! deleting a source will delete some children it shouldn't
    //since some other source might be producing it
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
      this.rebuildAt(position)
    }
  }
  hasCubeAt(position) {
    return !!this.flowCubes[toKey(position)]
  }
  rebuildAt(position) {
    const cube = this.flowCubes[toKey(position)]
    const parents = Object.assign({}, cube.parents)
    this.destroyLineage(cube)
    this.makeCubesRespawn(parents)
  }
  /**********************
   * Destroying
   **********************/
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
  /**********************
   * Flowing
   **********************/
  makeCubesRespawn(cubes) {
    Object.values(cubes).forEach(cube => this.spawnChildrenFor(cube))
  }
  spawnChildrenFor(cube, queueBreadthFirst = []) {
    //makes all generations of children. better name?
    queueBreadthFirst.push(...this.produceChildrenFor(cube))
    const newChild = queueBreadthFirst.shift()
    if (newChild) {
      this.spawnChildrenFor(newChild, queueBreadthFirst)
    }
    //shift can be optimized
  }
  produceChildrenFor(cube) {
    //makes one generations of children. better name?
    return this.findSpacesToFlowFor(cube).map(position => {
      return this.makeCubeFlowTo(cube, position)
    })
  }
  findSpacesToFlowFor(cube) {
    if (this.noCubeBelow(cube) && this.cubeCanFlowTo(cube, cube.down)) {
      return [cube.down]
    } else {
      return cube.flatNeighbors.filter(position =>
        this.cubeCanFlowTo(cube, position)
      )
    }
  }
  noCubeBelow(cube) {
    return !this.hasWorldCubeAt(cube.down)
  }
  cubeCanFlowTo(cube, position) {
    return (
      !this.hasWorldCubeAt(position) &&
      cube.hasVolumeToFlowTo(position) &&
      !cube.parents[toKey(position)] &&
      position.y >= -64
    )
  }
  hasWorldCubeAt(position) {
    return !!this.worldCubes[toKey(position)]
  }
  makeCubeFlowTo(cube, position) {
    if (this.hasCubeAt(position)) {
      const child = this.flowCubes[toKey(position)]
      cube.linkChild(child)
      return child
      //could cause a respawn unnecessarily, but who cares
    } else {
      return this.createAndStoreChild(cube, position)
    }
  }
  createAndStoreChild(cube, position) {
    const child = cube.createChildAt(position)
    this.flowCubes[toKey(position)] = child
    return child
  }
}
