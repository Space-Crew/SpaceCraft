import * as THREE from 'three'
import {makeAvatar} from '../meshes'

export const addAvatar = (position, scene, color, rotation) => {
  // build character //
  const [head, body, leftArm, rightArm, legs] = makeAvatar(color)
  // bring it to LIFE //
  const group = new THREE.Object3D()
  group.add(body)
  group.add(head)
  group.add(leftArm)
  group.add(rightArm)
  group.add(legs)
  const {x, y, z} = position
  group.position.set(x, y, z)
  // console.log('rotation', rotation)
  // if (rotation) group.lookAt(rotation)
  scene.add(group)
  return group
}
