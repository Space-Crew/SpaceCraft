import * as THREE from 'three'
import {makeHead, makeBody, makeArms, makeLegs} from '../meshes'

export const addAvatar = (position, scene) => {
  // build character //
  const head = makeHead()
  const body = makeBody()
  const [leftArm, rightArm] = makeArms()
  const legs = makeLegs()

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
