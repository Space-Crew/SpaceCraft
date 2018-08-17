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
  addSourceAt(position) {
    const sourceAtPosition = this.flowCubes[toKey(position)]
    if (!sourceAtPosition) {
      const newSource = new FlowCube(position.x, position.y, position.z, true)
      this.flowCubes[toKey(position)] = newSource
      this.sources[toKey(position)] = newSource.position
      newSource.spawnChildren(this.worldCubes, this.flowCubes)
    }
  }
  createObstacle(position) {}
}
