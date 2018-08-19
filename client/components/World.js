import React, {Component} from 'react'
import * as THREE from 'three'
import DragControls from '../3d/controls/DragControls'
import {db} from '../firebase'
import {addBlock} from '../3d/controls/addBlock'
import {attachCameraControls} from '../3d/controls/cameraControls'
import {attachWaterToScene} from '../3d/water'

/*********************************
 * Construct the Three World
 ********************************/

let isPaused = false
let onSpaceBar
const blocker = document.getElementById('blocker')
const instructions = document.getElementById('instructions')

function generateWorld(world) {
  /*********************************
   * Renderer
   ********************************/
  //renders the scene, camera, and cubes using webGL
  const renderer = new THREE.WebGLRenderer()
  const color = new THREE.Color(0x0f4260)
  //sets the world background color
  renderer.setClearColor(color)
  //sets the resolution of the view
  renderer.setSize(window.innerWidth, window.innerHeight)

  /*********************************
   * Camera
   ********************************/
  //create a perspective camera (field-of-view, aspect ratio, min distance, max distance)
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.controls = attachCameraControls(camera, renderer.domElement)

  /*********************************
   * Scene
   ********************************/
  //create a new scene
  const scene = new THREE.Scene()
  scene.objects = []
  scene.worldId = world.id
  //allows for adding, deleting, and moving 3d objects with mouse drag
  scene.addDragControls = function() {
    this.dragControl = new DragControls(camera, renderer.domElement, this)
    this.add(this.dragControl.getObject())
  }
  scene.addDragControls()

  attachWaterToScene(scene, world)
  scene.addAllWater()
  scene.listenForChangesToUpdateWater(scene, world.id)

  const light = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(light)
  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

  /*********************************
   * Render To Screen
   ********************************/

  function render() {
    renderer.render(scene, camera)
  }
  function animate() {
    if (isPaused) return
    requestAnimationFrame(animate)
    render()
  }
  document.getElementById('plane').appendChild(renderer.domElement)
  animate()

  /*********************************
   * Pause The World
   ********************************/

  onSpaceBar = event => {
    if (event.which === 32) {
      isPaused = !isPaused
      showInstructions(isPaused)
      animate()
    }
  }
  const showInstructions = isPaused => {
    blocker.style.visibility = 'visible'
    if (isPaused) {
      blocker.style.display = 'block'
      blocker.style.zIndex = '99'
      instructions.style.display = ''
    } else {
      blocker.style.display = 'none'
      blocker.style.zIndex = ''
      instructions.style.display = 'none'
    }
  }
  window.addEventListener('keydown', onSpaceBar, false)

  /*********************************
   * Teardown functions
   ********************************/

  const tearDownFunctions = [scene.dragControl.dispose, camera.controls.dispose]
  const disposeWorld = () => {
    tearDownFunctions.forEach(func => func())
  }
  return disposeWorld
}

/*********************************
 * Helper functions
 ********************************/

// function addCubesToScene(cubes, scene, objects) {
//   if (cubes.length > 0) {
//     cubes.forEach(cube => {
//       addBlock(
//         new THREE.Vector3(cube.x, cube.y, cube.z),
//         cube.color,
//         scene,
//         objects
//       )
//     })
//   } else {
//     generateDefaultPlane(scene, objects)
//   }
// }

// function generateDefaultPlane(scene, objects) {
//   for (let z = -10; z < 10; z += 1) {
//     for (let x = -10; x <= 10; x += 1) {
//       const y = -1
//       addBlock(new THREE.Vector3(x, y, z), 0xb9c4c0, scene, objects)
//     }
//   }
// }

/*********************************
 * Render Component
 ********************************/

class World extends Component {
  async componentDidMount() {
    try {
      let world
      if (this.props.match && this.props.match.params.id) {
        const uri = '/worlds/' + this.props.match.params.id
        const worldRef = db.ref(uri)
        world = (await worldRef.once('value')).val()
      } else {
        world = await this.getDefaultWorld()
      }
      this.unsubscribe = generateWorld(world)
    } catch (error) {
      console.log(error)
    }
  }
  async getDefaultWorld() {
    try {
      const uri = '/worlds/0'
      const worldRef = db.ref(uri)
      return (await worldRef.once('value')).val()
    } catch (error) {
      console.log(error)
    }
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', onSpaceBar, false)
    this.unsubscribe()
  }
  render() {
    return (
      <div id="plane">
        <input id="color-palette" type="color" defaultValue="#b9c4c0" />
      </div>
    )
  }
}

export default World
