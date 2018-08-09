import * as THREE from 'three'
import DragControls from './controls/DragControls'

import React, {Component} from 'react'

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

var mx = 1.5
var objects = []

for (let i = 0; i < 10; i++) {
  var box = new THREE.BoxGeometry(1, 1, 1)
  var boxMaterial = new THREE.MeshBasicMaterial({color: 0xff7373})
  var cube = new THREE.Mesh(box, boxMaterial)
  var geo = new THREE.EdgesGeometry(cube.geometry)
  var mat = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 1})
  var wireframe = new THREE.LineSegments(geo, mat)
  wireframe.renderOrder = 1
  cube.add(wireframe)
  scene.add(cube)
  cube.position.x = -7.5 + mx
  objects.push(cube)
  mx += 1.5
}

camera.position.z = 10
const dragControls = new DragControls(
  objects,
  camera,
  renderer.domElement,
  scene
)

var animate = function() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate()

class Draggables extends Component {
  componentDidMount() {
    document.getElementById('three').appendChild(renderer.domElement)
    animate()
  }
  render() {
    return <div id="three">Hello World!</div>
  }
}

export default Draggables
