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

// head //
const head = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshBasicMaterial({color: 'purple'})
)
// head.position.setFromMatrixPosition(body.matrixWorld)

const x = 0
const y = 2
const z = 0
head.position.set(x, y, z)
console.log(head)

// body //
const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.9, 0.4),
  new THREE.MeshBasicMaterial({color: 0x00ff00})
)
const bodyX = x
const bodyY =
  y - head.geometry.parameters.height / 2 - body.geometry.parameters.height / 2
const bodyZ = z
body.position.set(bodyX, bodyY, bodyZ)

// arms //
const leftArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.7, 0.2),
  new THREE.MeshBasicMaterial({color: 'purple'})
)
const lArmX =
  x - head.geometry.parameters.width / 2 - leftArm.geometry.parameters.width / 2
const lArmY = bodyY
const lArmZ = z
console.log(lArmX, lArmY, lArmZ)
leftArm.position.set(lArmX, lArmY, lArmZ)

const rightArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.7, 0.2),
  new THREE.MeshBasicMaterial({color: 'purple'})
)
const rArmX = Math.abs(lArmX)
const rArmY = bodyY
const rArmZ = z
rightArm.position.set(rArmX, rArmY, rArmZ)

// legs //

const legs = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.75, 0.4),
  new THREE.MeshBasicMaterial({color: 'purple'})
)
legs.position.set(0, -2, 0)

// put it all together //
group.add(body)
group.add(head)
group.add(leftArm)
group.add(rightArm)
group.add(legs)
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
