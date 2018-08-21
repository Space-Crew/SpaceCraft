import * as THREE from 'three'
import {makeAvatar, makeUsername} from './'

export const addAvatar = (position, scene, color, name) => {
  // build character //
  const [head, body, leftArm, rightArm, leftLeg, rightLeg] = makeAvatar(color)
  const username = makeUsername(name)
  // bring it to LIFE //
  const group = new THREE.Object3D()
  group.add(body, head, leftArm, rightArm, leftLeg, rightLeg, username)
  const {x, y, z} = position
  group.position.set(x, y, z)
  scene.add(group)
  return group
}
