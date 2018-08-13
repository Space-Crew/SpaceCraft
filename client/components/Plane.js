import React, {Component} from 'react'
import * as THREE from 'three'
import DragControls from '../3d/controls/DragControls'
import PointerLockControls from '../3d/controls/PointerLockControls'
import {makeUnitCube} from '../3d/meshes'
import {db} from '../firebase'
//this is assuming that there will be a firebase folder that I can use to access the db
//Samer is working on ^

/*********************************
 * Construct the Three World
 ********************************/

function generateWorld(cubes) {
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

  addCubesToScene(cubes)

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

/*********************************
 * Helper functions
 ********************************/

function addCubesToScene(cubes, scene, objects) {
  if (cubes.length !== 0) {
    cubes.forEach(cube => {
      const position = new THREE.Vector3(cube.x, cube.y, cube.z)
      const cubeMesh = makeUnitCube(position, 0xb9c4c0, 1)
      scene.add(cubeMesh)
      objects.push(cubeMesh)
    })
  } else {
    generateDefaultPlane(scene, objects)
  }
}

function generateDefaultPlane(scene, objects) {
  for (let z = -10; z < 10; z += 1) {
    for (let x = -10; x <= 10; x += 1) {
      const y = -1
      const position = new THREE.Vector3(x, y, z)
      let cube = makeUnitCube(position, 0xb9c4c0, 1)
      scene.add(cube)
      objects.push(cube)
    }
  }
}

/*********************************
 * Render the world
 ********************************/

class Plane extends Component {
  async componentDidMount() {
    let cubes = []
    if (this.props.match && this.props.match.params.id) {
      const worldRef = db.ref('/worlds/' + this.props.match.params.id)
      const world = await worldRef.get()
      cubes = world.cubes
    }
    generateWorld(cubes)
  }
  render() {
    return <div id="plane" />
  }
}

//water flow by doing BFS from source
export default Plane
