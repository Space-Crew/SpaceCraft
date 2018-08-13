import {makeUnitCube} from '../'
import * as THREE from 'three'

function makeWaterCube(
  position,
  puddleLength = 4, //optional parameter for recursion - water should only flow so far
  isSource = true //optional parameter for recursion
) {
  //basecase - block already there, so water can't flow into it
  // or water is already there
  // or puddleLength = 0
  const basecase = puddleLength === 0 // || block already in state
  if (basecase) {
    return []
  }
  const cube = makeUnitCube(position, 0x0000ff)
  cube.isSource = isSource
  //try flowing downwards
  const shouldFlowDown = false
  //if (cube with position x, y-1, z does not already exist){
  if (shouldFlowDown) {
    //this is a blocker, I need to know what the state of all our cubes are
    const nextPosition = position.clone()
    nextPosition.y -= 1
    const newWaterCubes = makeWaterCube(nextPosition, puddleLength, false)
    newWaterCubes.push(cube)
    return newWaterCubes
  } else {
    const northPosition = position.clone()
    northPosition.z += 1
    makeWaterCube(northPosition, puddleLength - 1, false)
    const southPosition = position.clone()
    southPosition.z -= 1
    makeWaterCube(southPosition, puddleLength - 1, false)
    const eastPosition = position.clone()
    eastPosition.x += 1
    makeWaterCube(eastPosition, puddleLength - 1, false)
    const westPosition = position.clone()
    makeWaterCube(westPosition, puddleLength - 1, false)
    westPosition.x -= 1
    //flow in all directions
  }
}
