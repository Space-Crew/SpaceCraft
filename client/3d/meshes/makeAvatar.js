import * as THREE from 'three'

let x, y, z, headHeight, headWidth, bodyHeight, armWidth, bodyY
export const makeHead = () => {
  // body parts are positioned relative to head //
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({color: 'purple'})
  )
  headHeight = head.geometry.parameters.height
  headWidth = head.geometry.parameters.width
  x = 0
  y = 2
  z = 0
  head.position.set(x, y, z)
  return head
}

export const makeBody = () => {
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.9, 0.4),
    new THREE.MeshBasicMaterial({color: 0x00ff00})
  )
  bodyHeight = body.geometry.parameters.height
  const bodyX = x
  bodyY = y - headHeight / 2 - bodyHeight / 2
  const bodyZ = z
  body.position.set(bodyX, bodyY, bodyZ)
  return body
}

export const makeArms = () => {
  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.7, 0.2),
    new THREE.MeshBasicMaterial({color: 'purple'})
  )
  armWidth = leftArm.geometry.parameters.width
  const lArmX = x - headWidth / 2 - armWidth / 2
  const lArmY = bodyY
  const lArmZ = z
  leftArm.position.set(lArmX, lArmY, lArmZ)

  const rightArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.7, 0.2),
    new THREE.MeshBasicMaterial({color: 'purple'})
  )
  const rArmX = x + headWidth / 2 + armWidth / 2
  const rArmY = bodyY
  const rArmZ = z
  rightArm.position.set(rArmX, rArmY, rArmZ)
  return [leftArm, rightArm]
}

export const makeLegs = () => {
  const legs = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.75, 0.3),
    new THREE.MeshBasicMaterial({color: 'purple'})
  )
  const legX = x
  const legY =
    y - headHeight / 2 - bodyHeight - legs.geometry.parameters.height / 2
  const legZ = z
  legs.position.set(legX, legY, legZ)
  return legs
}
