import * as THREE from 'three'
<<<<<<< HEAD:client/3d/controls/addAvatar.js
import {makeAvatar, makeUsername} from '../meshes'
=======
import {makeAvatar} from './makeAvatar'
>>>>>>> master:client/3d/controls/avatar/addAvatar.js

export const addAvatar = (position, scene, color, name) => {
  // build character //
<<<<<<< HEAD:client/3d/controls/addAvatar.js
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
=======
  const [head, body, leftArm, rightArm, leftLeg, rightLeg] = makeAvatar(color)
  // bring it to LIFE //
  const group = new THREE.Object3D()
  group.add(body, head, leftArm, rightArm, leftLeg, rightLeg)
>>>>>>> master:client/3d/controls/avatar/addAvatar.js
  const {x, y, z} = position
  group.position.set(x, y, z)
  scene.add(group)
  return group
}
