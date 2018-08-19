import {FlowGraph} from './WaterGraph'

export class GameFlowGraph extends FlowGraph {
  constructor(sourcePositions = {}, worldCubes = {}, delay = 200) {
    super(sourcePositions, worldCubes)
    this.delay = delay
  }
  spawnLineageRecursion(currentGeneration) {
    setTimeout(() => {
      //how do I call the parent's method
      if (currentGeneration.length > 0) {
        let nextGeneration = this.spawnNextGeneration(currentGeneration)
        this.spawnLineageRecursion(nextGeneration)
      }
    }, this.delay)
  }
  destroyLineage(cube) {
    setTimeout(() => {
      let currentGeneration = Object.values(cube.children)
      while (currentGeneration.length > 0) {
        const nextGeneration = this.getNextGeneration(currentGeneration)
        this.destroyCubes(currentGeneration)
        currentGeneration = nextGeneration
      }
    }, this.delay)
  }
}
