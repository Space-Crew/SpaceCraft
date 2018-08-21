import * as THREE from 'three'

let x,
  y,
  z,
  bodyY,
  headHeight,
  headWidth,
  bodyHeight,
  bodyWidth,
  armWidth,
  legWidth

const makeHead = color => {
  // body parts are positioned relative to head //
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshLambertMaterial({color})
  )
  headHeight = head.geometry.parameters.height
  headWidth = head.geometry.parameters.width
  x = 0
  y = 0
  z = 0
  head.position.set(x, y, z)
  return head
}

const makeBody = color => {
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.65, 0.4),
    new THREE.MeshBasicMaterial({color})
  )
  bodyHeight = body.geometry.parameters.height
  bodyWidth = body.geometry.parameters.width
  const bodyX = x
  bodyY = y - headHeight / 2 - bodyHeight / 2
  const bodyZ = z
  body.position.set(bodyX, bodyY, bodyZ)
  return body
}

const makeArms = color => {
  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.75, 0.2),
    new THREE.MeshLambertMaterial({color})
  )
  armWidth = leftArm.geometry.parameters.width
  const lArmX = x - headWidth / 2 - armWidth / 2
  const lArmY = bodyY - 0.1
  const lArmZ = z
  leftArm.position.set(lArmX, lArmY, lArmZ)

  const rightArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.75, 0.2),
    new THREE.MeshLambertMaterial({color})
  )
  const rArmX = x + headWidth / 2 + armWidth / 2
  const rArmY = bodyY - 0.1
  const rArmZ = z
  rightArm.position.set(rArmX, rArmY, rArmZ)
  return [leftArm, rightArm]
}

const makeLegs = color => {
  const leftLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.6, 0.15),
    new THREE.MeshLambertMaterial({color})
  )
  legWidth = leftLeg.geometry.parameters.width
  const lLegX = x - bodyWidth / 2 + legWidth / 2
  const lLegY =
    y - headHeight / 2 - bodyHeight - leftLeg.geometry.parameters.height / 2
  const lLegZ = z
  leftLeg.position.set(lLegX, lLegY, lLegZ)

  const rightLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.6, 0.15),
    new THREE.MeshLambertMaterial({color})
  )
  const rLegX = x + bodyWidth / 2 - legWidth / 2
  const rLegY =
    y - headHeight / 2 - bodyHeight - rightLeg.geometry.parameters.height / 2
  const rLegZ = z
  rightLeg.position.set(rLegX, rLegY, rLegZ)

  return [leftLeg, rightLeg]
}

export const makeAvatar = color => {
  const [head, body] = [makeHead(color), makeBody(color)]
  const [leftArm, rightArm] = makeArms(color)
  const [leftLeg, rightLeg] = makeLegs(color)
  return [head, body, leftArm, rightArm, leftLeg, rightLeg]
}
