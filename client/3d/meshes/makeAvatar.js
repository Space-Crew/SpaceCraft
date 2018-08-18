import * as THREE from 'three'

let x, y, z, headHeight, headWidth, bodyHeight, armWidth, bodyY
let color = '#' + Math.floor(Math.random() * 16777215).toString(16)
export const makeHead = () => {
  // body parts are positioned relative to head //
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshLambertMaterial({color})
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
    new THREE.BoxGeometry(0.4, 0.65, 0.4),
    new THREE.MeshBasicMaterial({color})
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

export const makeLegs = () => {
  const legs = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.5, 0.3),
    new THREE.MeshLambertMaterial({color})
  )
  const legX = x
  const legY =
    y - headHeight / 2 - bodyHeight - legs.geometry.parameters.height / 2
  const legZ = z
  legs.position.set(legX, legY, legZ)
  return legs
}
