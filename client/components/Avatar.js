import React, {Component} from 'react'
import * as THREE from 'three'
import {addAvatar} from '../3d/controls/addAvatar'

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

addAvatar({x: -2, y: -2, z: 2}, scene)

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
