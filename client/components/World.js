import React, {Component} from 'react'
import * as THREE from 'three'
import {db} from '../firebase'
import BlockControl from '../3d/controls/blockControl';
import PreviewControl from '../3d/controls/previewControl';
import CameraControl from '../3d/controls/cameraControl'
import avatarControl from '../3d/controls/avatarControl'
import UndoStack from '../3d/controls/undoStack'
import {GameFlowGraph} from '../3d/water'

/*********************************
 * Construct the Three World
 ********************************/

let isPaused = false
let onSpaceBar
const blocker = document.getElementById('blocker')
const instructions = document.getElementById('instructions')

function generateWorld(world, currentUser) {
  //container for all 3d objects that will be affected by event
  let objects = []
  const cubesToBeMoved = {}
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
  // camera.controls = attachCameraControls(camera, renderer.domElement)
  //create a new scene
  const scene = new THREE.Scene()
  scene.objects = []
  scene.worldId = world.id
  scene.undoStack = new UndoStack(world.id)

  const cameraControl = new CameraControl(
    camera, renderer.domElement 
  )
  
  scene.add(cameraControl.getObject())
  const previewControl = new PreviewControl(scene);
  const previewBox = previewControl.previewBox;
  const essentials = {_domElement: renderer.domElement, _objects: objects, _camera: camera, _scene: scene}
  const blockControl = new BlockControl(
    essentials, currentUser, world.id, cameraControl.getObject(), previewBox, cubesToBeMoved
  )
  avatarControl(world.id, cameraControl.getObject(), scene)
  // scene.addDragControls = function() {
  //   this.dragControl = new DragControls(camera, renderer.domElement, this)
  //   this.add(this.dragControl.getObject())
  // }
  // scene.addDragControls()
  const light = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(light)
  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

  const water = new GameFlowGraph(world.water, world.cubes, scene)
  water.connectToWorld(world.id)

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

  return function() {
    cameraControl.dispose();
    blockControl.dispose();
    previewControl.dispose();
  }
  // const tearDownFunctions = [scene.dragControl.dispose, camera.controls.dispose]
  // const disposeWorld = () => {
  //   tearDownFunctions.forEach(func => func())
  // }
  // return disposeWorld
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

/*********************************
 * Render Component
 ********************************/

class World extends Component {
  constructor() {
    super();
    this.state = {
      currentWorldId: null,
      players: [],
      authorizedPlayers: [],
      author: ''
    }
  }
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
      this.unsubscribe = generateWorld(world, this.props.currentUser)
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
    // window.removeEventListener('keydown', onSpaceBar, false)
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
