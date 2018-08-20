import React, {Component} from 'react'
import * as THREE from 'three'
import {db} from '../firebase'
import BlockControl from '../3d/controls/blockControl'
import PreviewControl from '../3d/controls/previewControl'
import {makeWaterCube} from '../3d/meshes'
import FlowGraph from '../3d/meshes/WaterGraph'
import CameraControl from '../3d/controls/cameraControl'
import avatarControl from '../3d/controls/avatarControl'
import UndoStack from '../3d/controls/UndoStack'

/*********************************
 * Construct the Three World
 ********************************/

let isPaused = false
let onSpaceBar
const blocker = document.getElementById('blocker')
const instructions = document.getElementById('instructions')

function generateWorld(worldId, currentUser, water, rawWorldCubes) {
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
  scene.worldId = worldId
  scene.undoStack = new UndoStack(scene.worldId)
  const cameraControl = new CameraControl(camera, renderer.domElement)
  scene.add(cameraControl.getObject())
  const previewControl = new PreviewControl(scene)
  const previewBox = previewControl.previewBox
  const essentials = {
    _domElement: renderer.domElement,
    _objects: objects,
    _camera: camera,
    _scene: scene
  }
  const blockControl = new BlockControl(
    essentials,
    currentUser,
    worldId,
    cameraControl.getObject(),
    previewBox,
    cubesToBeMoved
  )
  avatarControl(worldId, cameraControl.getObject(), scene)
  const light = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(light)
  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

  scene.addWaterSources = function(waterSources, worldCubes) {
    const waterGraph = new FlowGraph(waterSources, worldCubes)
    const waterCubes = Object.values(waterGraph.flowCubes)
    waterCubes.forEach(waterCube => {
      this.add(makeWaterCube(waterCube.position))
    })
  }
  scene.addWaterSources(water, rawWorldCubes)

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

  // pause the world //

  onSpaceBar = event => {
    if (event.which === 32) {
      isPaused = !isPaused
      showInstructions(isPaused)
      animate()
    }
  }
  window.addEventListener('keydown', onSpaceBar, false)

  return function() {
    cameraControl.dispose()
    blockControl.dispose()
    previewControl.dispose()
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
    console.log('game paused', blocker.style.display)
  } else {
    blocker.style.display = 'none'
    blocker.style.zIndex = ''
    console.log('game unpaused', blocker.style.display)
  }
}

/*********************************
 * Render the world
 ********************************/

class World extends Component {
  constructor() {
    super()
    this.state = {
      currentWorldId: null,
      players: [],
      authorizedPlayers: [],
      author: ''
    }
  }
  async componentDidMount() {
    try {
      let cubes = []
      let worldId
      let water
      let rawWorldCubes
      if (this.props.match && this.props.match.params.id) {
        const uri = '/worlds/' + this.props.match.params.id
        const worldRef = db.ref(uri)
        const world = (await worldRef.once('value')).val()
        if (!world.cubes) {
          cubes = []
        } else {
          cubes = Object.values(world.cubes)
        }
        worldId = world.id
        water = world.water
        rawWorldCubes = world.cubes
      }
      this.unsubscribe = generateWorld(
        worldId,
        this.props.currentUser,
        water,
        rawWorldCubes
      )
    } catch (error) {
      console.log(error)
    }
  }
  componentWillUnmount() {
    // do not remove/comment out line below, this causes the pause-game functionality to work consistently //
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

//water flow by doing BFS from source
export default World
