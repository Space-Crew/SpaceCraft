import {FlowGraph} from './WaterGraph'
import {toKey} from '..'
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
    this.spawnCubesFromSourcePositions()
  }
  spawnCubesFromSourcePositions() {
    super.spawnCubesFromSourcePositions()
    Object.values(this.sourcePositions).forEach(sourcePosition => {
      this.addWaterToSceneAt(sourcePosition)
    })
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
    this.addWaterToSceneAt(position)
    return super.createAndStoreChild(cube, position)
  }
  addWaterToSceneAt(position) {
    const threeObject = makeWaterCube(position)
    this.scene.add(threeObject)
    if (this.threeMap[toKey(position)]) {
      this.removeWaterFromSceneAt(position)
    }
    this.threeMap[toKey(position)] = threeObject
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
    this.addWaterToSceneAt(position)
    return super.makeSourceAt(position)
  }
}
