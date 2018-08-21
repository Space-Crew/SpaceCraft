import * as THREE from 'three'
import {makeAvatar} from './makeAvatar'

export const addAvatar = (position, scene, color) => {
  // build character //
  const [head, body, leftArm, rightArm, leftLeg, rightLeg] = makeAvatar(color)
  // bring it to LIFE //
  const group = new THREE.Object3D()
  group.add(body, head, leftArm, rightArm, leftLeg, rightLeg)
  const {x, y, z} = position
  group.position.set(x, y, z)
  scene.add(group)
  return group
}
