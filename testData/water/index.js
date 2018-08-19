import {FlowCube, FlowGraph} from '../../client/3d/water'

const baseCubes = {}
for (let z = -10; z < 10; z += 1) {
  for (let x = -10; x <= 10; x += 1) {
    const y = -1
    baseCubes[`${x},${y},${z}`] = true
  }
}

const baseSource = {x: 0, y: 0, z: 0}
const baseSources = {'0,0,0': baseSource}
const oldWater = new FlowGraph()
oldWater.flowCubes = {
  '1,0,0': new FlowCube({x: 1, y: 0, z: 0}),
  '20,0,0': new FlowCube({x: 20, y: 0, z: 0})
}

module.exports = {
  baseCubes,
  baseSources,
  baseSource,
  oldWater
}
