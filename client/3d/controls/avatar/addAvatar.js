import * as THREE from 'three'
import {makeAvatar} from './makeAvatar'

export const addAvatar = (position, scene, color) => {
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
  scene.add(group)
  return group
}
