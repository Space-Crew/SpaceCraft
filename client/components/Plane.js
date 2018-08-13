import React, {Component} from 'react'
import * as THREE from 'three'
import DragControls from '../3d/controls/DragControls'
import PointerLockControls from '../3d/controls/PointerLockControls'
import {makeUnitCube} from '../3d/meshes'
import addBlock from '../3d/controls/addBlock'

function startPlane() {
  //container for all 3d objects that will be affected by event
  let objects = []
  //renders the scene, camera, and cubes using webGL
  const renderer = new THREE.WebGLRenderer()
  const color = new THREE.Color(0x0f4260)
  //sets the world background color
  renderer.setClearColor(color)
  //sets the resolution of the view
  renderer.setSize(window.innerWidth, window.innerHeight)

  //create a perspective camera (field-of-view, aspect ratio, min distance, max distance)
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.y = 0
  camera.position.z = 0

  //create a new scene
  const scene = new THREE.Scene()
  //allows for adding, deleting, and moving 3d objects with mouse drag
  const dragControl = new DragControls(
    objects,
    camera,
    renderer.domElement,
    scene
  )
  scene.add(dragControl.getObject())

  const light = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(light)
  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

  for (let z = -10; z < 10; z += 1) {
    for (let x = -10; x <= 10; x += 1) {
      const y = -1
      addBlock(new THREE.Vector3(x, y, z), 0xb9c4c0, scene, objects)
      // objects.push(cube)
      // const position = new THREE.Vector3(x, y, z)
      // let cube = makeUnitCube(position, 0xb9c4c0, 1)
      // scene.add(cube)
      // objects.push(cube)
    }
  }
  // const clock = new THREE.Clock() //needed for controls
  function render() {
    //   controls.update(clock.getDelta()) // needed for First Person Controls to work
    renderer.render(scene, camera)
  }
  function animate() {
    requestAnimationFrame(animate)

    render()
  }
  document.getElementById('plane').appendChild(renderer.domElement)
  animate()
}

class Plane extends Component {
  componentDidMount() {
    startPlane()
  }
  render() {
    return <div id="plane" />
  }
}

//water flow by doing BFS from source
export default Plane
