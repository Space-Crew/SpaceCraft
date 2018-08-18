import FlowCube from './water'
import {toKey} from '..'

export default class FlowGraph {
  constructor(sources = {}, worldCubes = {}) {
    this.sources = sources
    this.worldCubes = worldCubes
    this.flowCubes = {}
    this.spawnCubesFromSources()
  }
  spawnCubesFromSources() {
    Object.values(this.sources).forEach(source => {
      this.flowCubes[toKey(source)] = new FlowCube(
        source.x,
        source.y,
        source.z,
        true
      )
      this.flowCubes[toKey(source)].spawnChildren(
        this.worldCubes,
        this.flowCubes
      )
    })
  }
  spawnSourceAt(position) {
    const source = this.addSourceAt(position)
    source.spawnChildren(this.worldCubes, this.flowCubes)
  }
  addSourceAt(position) {
    let sourceAtPosition = this.flowCubes[toKey(position)]
    if (!sourceAtPosition) {
      const newSource = new FlowCube(position.x, position.y, position.z, true)
      this.flowCubes[toKey(position)] = newSource
      this.sources[toKey(position)] = newSource.position
      sourceAtPosition = newSource
    }
    return sourceAtPosition
  }
  createObstacleAt(position) {
    this.worldCubes[toKey(position)] = true //data not that important I think
    const cubeAtPosition = this.flowCubes[toKey(position)]
    if (cubeAtPosition) {
      const parents = cubeAtPosition.parents
      this.destroyLineage(cubeAtPosition)
      this.triggerParents(parents)
    }
  }
  triggerParents(parents) {
    Object.values(parents).forEach(parent =>
      parent.spawnChildren(this.worldCubes, this.flowCubes)
    )
  }
  destroyLineage(cube) {
    let destroyTheseBreadthFirst = []
    while (cube) {
      destroyTheseBreadthFirst.push(...Object.values(cube.children))
      Object.values(cube.parents).forEach(parent => {
        parent._unlinkChild(cube)
      })
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
}
