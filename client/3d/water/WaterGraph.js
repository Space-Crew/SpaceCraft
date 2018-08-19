import {FlowCube} from './water'
import {toKey} from '..'

export class FlowGraph {
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
      this.spawnLineageFor(this.flowCubes[toKey(sourcePosition)])
    })
  }
  /**********************
   * Flowing
   **********************/
  spawnLineageFor(cube) {
    this.spawnLineageRecursion([cube])
  }
  spawnLineageRecursion(currentGeneration) {
    if (currentGeneration.length > 0) {
      let nextGeneration = this.spawnNextGeneration(currentGeneration)
      this.spawnLineageRecursion(nextGeneration)
    }
  }
  spawnNextGeneration(generation) {
    return generation.reduce((allNewchildren, parent) => {
      const newChildren = this.produceChildrenFor(parent)
      return allNewchildren.concat(newChildren)
    }, [])
  }
  produceChildrenFor(cube) {
    //makes one generations of children. better name?
    return this.findSpacesToFlowFor(cube)
      .map(position => {
        return this.makeCubeFlowTo(cube, position)
      })
      .filter(newCube => newCube !== null)
    //returns an array of new children created
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
      return null //because we did not create a new child
    } else {
      return this.createAndStoreChild(cube, position)
    }
  }
  createAndStoreChild(cube, position) {
    const child = cube.createChildAt(position)
    this.flowCubes[toKey(position)] = child
    return child
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
    // this.destroyCubeAndLineage(cube)
    this.makeCubesRespawn(parents)
  }
  makeCubesRespawn(cubes) {
    Object.values(cubes).forEach(cube => {
      this.respawnCube(cube)
    })
  }
  respawnCube(cube) {
    this.destroyLineage(cube)
    this.spawnLineageFor(cube)
  }
  /**********************
   * Destroying
   **********************/
  destroyCubeAndLineage(cube) {
    this.destroyCube(cube)
    this.destroyLineage(cube)
  }
  destroyCube(cube) {
    cube.unlinkParents()
    this.removeFromGraph(cube)
  }
  removeFromGraph(cube) {
    if (cube.isSource) {
      delete this.sourcePositions[toKey(cube.position)]
    }
    delete this.flowCubes[toKey(cube.position)]
  }
  destroyLineage(cube) {
    let currentGeneration = Object.values(cube.children)
    while (currentGeneration.length > 0) {
      const nextGeneration = this.getNextGeneration(currentGeneration)
      this.destroyCubes(currentGeneration)
      currentGeneration = nextGeneration
    }
  }
  getNextGeneration(generation) {
    return generation.reduce((nextGeneration, cube) => {
      return nextGeneration.concat(Object.values(cube.children))
    }, [])
  }
  destroyCubes(cubes) {
    //remind me why do i need to bind the callback function?
    cubes.forEach(cube => {
      if (typeof cube !== 'object') {
        console.log(cubes)
      }
      this.destroyCube(cube)
    })
  }

  /**********************
   * Change all the water when a player removes a block
   **********************/
  deleteWorldCubeAt(position) {
    delete this.worldCubes[toKey(position)]
    const upAndFlatNeighbors = this.getUpAndFlatNeighborsFor(position)
    upAndFlatNeighbors.forEach(neighbor => {
      if (this.hasCubeAt(neighbor)) {
        this.respawnCube(this.flowCubes[toKey(neighbor)])
      }
    })
  }
  getUpAndFlatNeighborsFor(position) {
    const cube = new FlowCube(position)
    return [cube.up, ...cube.flatNeighbors]
  }
  /**********************
   * Edit sources
   **********************/
  spawnSourceAt(position) {
    if (!this.hasSourceAt(position)) {
      const source = this.makeSourceAt(position)
      this.spawnLineageFor(source)
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
    //BUG!!! ... maybe. deleting a source will delete some children it shouldn't
    //since some other source might be producing it
    if (this.hasSourceAt(position)) {
      this.destroyCubeAndLineage(this.flowCubes(toKey[position]))
    }
  }
}
