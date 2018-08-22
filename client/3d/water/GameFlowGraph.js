import {FlowGraph} from './FlowGraph'
import {toKey} from '../../utilities'
import {makeWaterCube} from './makeWaterCube'
import {db} from '../../firebase'

export class GameFlowGraph extends FlowGraph {
  constructor(
    sourcePositions = {},
    worldCubes = {},
    scene,
    delay = 200,
    threeMap = {}
  ) {
    super(sourcePositions, worldCubes)
    this.scene = scene
    this.delay = delay
    this.threeMap = threeMap
  }
  connectToWorld(worldId) {
    this.spawnCubesFromSourcePositionsQuickly()
    this.listenForChangesToUpdateWater(worldId)
  }
  spawnCubesFromSourcePositionsQuickly() {
    // const copy = new FlowGraph(this.sourcePositions, this.worldCubes)
    return this.spawnCubesFromSourcePositions()
  }
  spawnCubesFromSourcePositions() {
    const sources = super.spawnCubesFromSourcePositions()
    sources.forEach(source => {
      this.addWaterToScene(source)
    })
    return sources
  }
  spawnLineageRecursion(currentGeneration) {
    setTimeout(() => {
      super.spawnLineageRecursion(currentGeneration)
    }, this.delay)
  }
  destroyLineageRecursion(generation) {
    setTimeout(() => {
      super.destroyLineageRecursion(generation)
    }, this.delay)
  }
  destroyCube(cube) {
    super.destroyCube(cube)
    this.removeWaterFromSceneAt(cube.position)
  }
  removeWaterFromSceneAt(position) {
    let threeCube = this.threeMap[toKey(position)]
    this.scene.remove(threeCube)
    threeCube.geometry.dispose()
    threeCube.material.dispose()
    delete this.threeMap[position]
    threeCube = undefined
  }
  createAndStoreChild(cube, position) {
    const child = super.createAndStoreChild(cube, position)
    this.addWaterToScene(child)
    return child
  }
  addWaterToScene(cube) {
    const threeObject = makeWaterCube(cube)
    this.scene.add(threeObject)
    if (this.threeMap[toKey(cube.position)]) {
      this.removeWaterFromSceneAt(cube.position)
    }
    this.threeMap[toKey(cube.position)] = threeObject
  }
  listenForChangesToUpdateWater(worldId) {
    const cubesRef = db.ref(`/worlds/${worldId}/cubes/`)
    this.listenForAdditions(cubesRef)
    this.listenForDeletions(cubesRef)
  }
  listenForAdditions(cubesRef) {
    cubesRef.on('child_added', snapshot => {
      const newCubePosition = snapshot.val()
      // const oldFlowCubes = Object.assign({}, this.flowCubes)
      this.createObstacleAt(newCubePosition)
      // scene.updateSceneWithDifferences(oldFlowCubes)
    })
  }
  listenForDeletions(cubesRef) {
    cubesRef.on('child_removed', snapshot => {
      const newCubePosition = snapshot.val()
      // const oldFlowCubes = Object.assign({}, this.flowCubes)
      this.deleteWorldCubeAt(newCubePosition)
      // this.scene.updateSceneWithDifferences(oldFlowCubes)
    })
  }
  //if you want to also spawn children, you'll need to call spawnSourceAt
  makeSourceAt(position) {
    const source = super.makeSourceAt(position)
    this.addWaterToScene(source)
    return source
  }
}
