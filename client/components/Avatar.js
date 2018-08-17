import React, {Component} from 'react'
import * as THREE from 'three'

const scene = new THREE.Scene()

var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 5
camera.position.x = -2

const lightAmb = new THREE.AmbientLight(0x777777)
scene.add(lightAmb)

// build character //
const group = new THREE.Group()

// head ! body parts are positioned relative to head ! //
const head = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshBasicMaterial({color: 'purple'})
)

const headHeight = head.geometry.parameters.height
const headWidth = head.geometry.parameters.width
const x = 0
const y = 2
const z = 0
head.position.set(x, y, z)

// body //
const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.9, 0.4),
  new THREE.MeshBasicMaterial({color: 0x00ff00})
)
const bodyHeight = body.geometry.parameters.height
const bodyX = x
const bodyY = y - headHeight / 2 - bodyHeight / 2
const bodyZ = z
body.position.set(bodyX, bodyY, bodyZ)

// arms //
const leftArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.7, 0.2),
  new THREE.MeshBasicMaterial({color: 'purple'})
)
const armWidth = leftArm.geometry.parameters.width
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

// legs //

const legs = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 0.75, 0.3),
  new THREE.MeshBasicMaterial({color: 'purple'})
)
const legX = x
const legY =
  y - headHeight / 2 - bodyHeight - legs.geometry.parameters.height / 2
const legZ = z
legs.position.set(legX, legY, legZ)

// bring it to LIFE //
group.add(body)
group.add(head)
group.add(leftArm)
group.add(rightArm)
group.add(legs)
console.log(group)
scene.add(group)

// rendererrrrrr //
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
const color = new THREE.Color(0x0f4260)
//sets the world background color
renderer.setClearColor(color)
const render = () => {
  renderer.render(scene, camera)
}

const animate = () => {
  requestAnimationFrame(animate)
  render()
}

export default class Avatar extends Component {
  componentDidMount() {
    document.getElementById('avatar').appendChild(renderer.domElement)
    animate()
  }
  render() {
    return <div id="avatar" />
  }
}
