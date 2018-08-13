import {makeUnitCube} from '../'
import * as THREE from 'three'

function makeWaterCube(
  position,
  puddleLength = 4, //optional parameter for recursion
  isSource = true, //optional parameter for recursion
  allWaterCubes = [] //array of all Meshes that the scene needs to add
) {
  //basecase - block already there, so water can't flow into it
  const basecase = true
  if (basecase) {
    return allWaterCubes
  }
  const cube = makeUnitCube(position, 0x0000ff)
  cube.isSource = isSource
  //try flowing downwards
  if (false) {
    //if (cube with position x, y-1, z does not already exist){
    const nextPosition = position.clone()
    nextPosition.y -= 1
    const newWaterCubes = makeWaterCube(
      nextPosition,
      puddleLength,
      false,
      allWaterCubes
    )
    newWaterCubes.push(cube)
    return newWaterCubes
  } else {
    //flow in all directions
    makeWaterCube()
  }
}
