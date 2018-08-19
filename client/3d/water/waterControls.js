import {db} from '../../firebase'
import {FlowGraph} from './WaterGraph'
import {makeWaterCube} from './makeWaterCube'
import {toKey} from '..'

export function attachWaterToScene(scene, world) {
  const waterControls = initializeWaterControls(world.water, world.cubes)
  Object.assign(scene, waterControls)
}
export function initializeWaterControls(waterSources, worldCubes) {
  return {
    waterGraph: new FlowGraph(waterSources, worldCubes),
    threeMap: {},
    addAllWater,
    addWaterAt,
    addWaterCubes,
    removeWaterCubes,
    removeWaterAt,
    updateSceneWithDifferences,
    listenForChangesToUpdateWater,
    disposeOfCubeAt
  }
}

function listenForChangesToUpdateWater(scene, worldId) {
  const cubesRef = db.ref(`/worlds/${worldId}/cubes/`)
  listenForAdditions(scene, cubesRef)
  listenForDeletions(scene, cubesRef)
}
function listenForAdditions(scene, cubesRef) {
  cubesRef.on('child_added', function(snapshot) {
    console.log(`child Added to Db`)
    const newCubePosition = snapshot.val()
    const oldFlowCubes = Object.assign({}, scene.waterGraph.flowCubes)
    scene.waterGraph.createObstacleAt(newCubePosition)
    scene.updateSceneWithDifferences(oldFlowCubes)
  })
}
function listenForDeletions(scene, cubesRef) {
  cubesRef.on('child_removed', function(snapshot) {
    const newCubePosition = snapshot.val()
    const oldFlowCubes = Object.assign({}, scene.waterGraph.flowCubes)
    scene.waterGraph.deleteWorldCubeAt(newCubePosition)
    scene.updateSceneWithDifferences(oldFlowCubes)
  })
}

//`this` will refer to scene
function updateSceneWithDifferences(oldFlowCubes) {
  this.removeWaterCubes(getWaterToDelete(this.waterGraph, oldFlowCubes))
  this.addWaterCubes(getWaterToAdd(this.waterGraph, oldFlowCubes))
}
function getWaterToDelete(newWater, oldFlowCubes) {
  return Object.values(oldFlowCubes).filter(cube => {
    return !newWater.hasCubeAt(cube.position)
  })
}
function removeWaterCubes(cubes) {
  cubes.forEach(cube => this.removeWaterAt(cube.position))
}
function removeWaterAt(position) {
  this.disposeOfCubeAt(position)
}
function getWaterToAdd(newWater, oldFlowCubes) {
  return Object.values(newWater.flowCubes).filter(cube => {
    return !oldFlowCubes[toKey(cube.position)]
  })
}
function addWaterCubes(cubes) {
  cubes.forEach(cube => this.addWaterAt(cube.position))
}
function addWaterAt(position) {
  const threeObject = makeWaterCube(position)
  this.add(threeObject)
  if (this.threeMap[toKey(position)]) {
    this.disposeOfCubeAt(position)
  }
  this.threeMap[toKey(position)] = threeObject
}
function disposeOfCubeAt(position) {
  let threeCube = this.threeMap[toKey(position)]
  this.remove(threeCube)
  threeCube.geometry.dispose()
  threeCube.material.dispose()
  delete this.threeMap[position]
  threeCube = undefined
}
function addAllWater() {
  Object.values(this.waterGraph.flowCubes).forEach(waterCube => {
    this.addWaterAt(waterCube.position)
  })
}
