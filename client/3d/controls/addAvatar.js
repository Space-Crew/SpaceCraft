import * as THREE from 'three'
import {makeAvatar, makeUsername} from '../meshes'

export const addAvatar = (position, scene, color, name) => {
  // build character //
  const [head, body, leftArm, rightArm, legs] = makeAvatar(color)
  const username = makeUsername(name)

  // bring it to LIFE //
  const group = new THREE.Object3D()
  group.add(body)
  group.add(head)
  group.add(leftArm)
  group.add(rightArm)
  group.add(legs)
  group.add(username)
  const {x, y, z} = position
  group.position.set(x, y, z)
  scene.add(group)
  return group
}
