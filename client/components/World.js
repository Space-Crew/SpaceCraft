import React, {Component} from 'react'
import * as THREE from 'three'
import DragControls from '../3d/controls/DragControls'
import {db} from '../firebase'
import {addBlock} from '../3d/controls/addBlock'
import CameraControl from '../3d/controls/cameraControl';
import ListenToDb from '../3d/controls/dblisteners';
import BlockControl from '../3d/controls/BlockControl';
import PreviewControl from '../3d/controls/previewControl';

/*********************************
 * Construct the Three World
 ********************************/

let isPaused = false
let onSpaceBar
const blocker = document.getElementById('blocker')
const instructions = document.getElementById('instructions')

function generateWorld(cubes, worldId, currentUser) {
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
  camera.position.y = 0
  camera.position.z = 0

  //create a new scene
  const scene = new THREE.Scene()
  //allows for adding, deleting, and moving 3d objects with mouse drag
  // const dragControl = new DragControls(
  //   objects,
  //   camera,
  //   renderer.domElement,
  //   scene,
  //   worldId,
  //   currentUser
  // )
  // scene.add(dragControl.getObject())
  // addCubesToScene(cubes, scene, objects)
  const cameraControl = new CameraControl(
    camera, renderer.domElement 
  )
  
  scene.add(cameraControl.getObject())
  const previewControl = new PreviewControl(scene);
  const previewBox = previewControl.previewBox;
  const blockControl = new BlockControl(
    renderer.domElement, objects, camera, scene, currentUser, worldId, cameraControl.getObject(), previewBox, cubesToBeMoved
  )
  const light = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(light)
  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

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

  return cameraControl.dispose
}

/*********************************
 * Helper functions
 ********************************/

function addCubesToScene(cubes, scene, objects) {
  if (cubes.length > 0) {
    cubes.forEach(cube => {
      addBlock(
        new THREE.Vector3(cube.x, cube.y, cube.z),
        cube.color,
        scene,
        objects
      )
    })
  } else {
    generateDefaultPlane(scene, objects)
  }
}

function generateDefaultPlane(scene, objects) {
  for (let z = -10; z < 10; z += 1) {
    for (let x = -10; x <= 10; x += 1) {
      const y = -1
      addBlock(new THREE.Vector3(x, y, z), 0xb9c4c0, scene, objects)
    }
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

/*********************************
 * Render the world
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
    console.log('hi trying to load')
    try {
      let cubes = []
      let worldId
      if (this.props.match && this.props.match.params.id) {
        const uri = '/worlds/' + this.props.match.params.id
        const worldRef = db.ref(uri)
        const world = (await worldRef.once('value')).val()
        if (!world.cubes) {
          cubes = []
        } else {
          console.log(world)
          cubes = Object.values(world.cubes)
        }
        worldId = world.id
      }
      this.unsubscribe = generateWorld(cubes, worldId, this.props.currentUser)
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

//water flow by doing BFS from source
export default World
