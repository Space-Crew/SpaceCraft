import React, {Component} from 'react'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'
import {makeAvatar} from '../3d/meshes/makeAvatar'
import {addAvatar} from '../3d/controls/addAvatar'

// main scene //
const scene = new THREE.Scene()
// main camera //
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 5
camera.position.y = 4
camera.position.x = 0

// add avatar //
const avPosition = new THREE.Vector3(0, 0, 0)
const avatar = addAvatar(avPosition, scene, 'white')
avatar.lookAt(camera.position)

// lights
const rightLight = new THREE.PointLight(0xffffff, 0.85)
rightLight.position.set(20, 10, 20)
rightLight.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(rightLight)
const lightAmb = new THREE.AmbientLight(0x777777, 0.5)
scene.add(lightAmb)

// renderer //
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
const controls = new OrbitControls(camera, renderer.domElement)

// render function //
const renderThree = () => {
  controls.update()
  renderer.render(scene, camera)
}
const animate = () => {
  requestAnimationFrame(animate)
  renderThree()
}

class Avatar extends Component {
  componentDidMount() {
    document.getElementById('homepage').appendChild(renderer.domElement)
    animate()
  }
  render() {
    return <div id="homepage" />
  }
}
export default Avatar
