import React, {Component} from 'react'
import * as THREE from 'three'
import {db} from '../firebase'
import {GameFlowGraph} from '../3d/water'
import {
  BlockControl,
  PreviewControl,
  CameraControl,
  MotionControl,
  avatarControl,
  UndoStack
} from '../3d/controls'
import {configureRenderer} from '../3d/configure'

/*********************************
 * Construct the Three World
 ********************************/

let isPaused = false
let onSpaceBar
const blocker = document.getElementById('blocker')
const instructions = document.getElementById('instructions')

function generateWorld(world, currentUser, guestAvatar) {
  //container for all 3d objects that will be affected by event
  let objects = []
  const cubesToBeMoved = {}

  const {renderer, camera, scene, disposeOfResize} = configureRenderer()

  scene.objects = []
  scene.undoStack = new UndoStack(world.id)

  const cameraControl = new CameraControl(camera, renderer.domElement)
  scene.add(cameraControl.getObject())

  const motionControl = new MotionControl(cameraControl.getObject())

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
    world.id,
    cameraControl.getObject(),
    previewBox,
    cubesToBeMoved
  )

  let avatarUser = currentUser ? currentUser : guestAvatar
  avatarControl(world.id, cameraControl.getObject(), scene, avatarUser)

  const water = new GameFlowGraph(world.water, world.cubes, scene)
  water.connectToWorld(world.id)

  const light = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(light)
  const pointLight = new THREE.PointLight(0xffffff, 0.8)
  pointLight.position.set(0, 15, 0)
  scene.add(pointLight)

  /*********************************
   * Render To Screen
   ********************************/

  function render() {
    motionControl.updatePlayerPosition()
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
    } else {
      blocker.style.display = 'none'
      blocker.style.zIndex = ''
    }
  }
  window.addEventListener('keydown', onSpaceBar, false)

  /*********************************
   * Dispose functions
   ********************************/

  return function() {
    cameraControl.dispose()
    blockControl.dispose()
    previewControl.dispose()
    motionControl.dispose()
    disposeOfResize()
  }
}

/*********************************
 * Render Component
 ********************************/

class World extends Component {
  constructor() {
    super()
    this.state = {
      authorized: false
    }
  }
  async componentDidMount() {
    try {
      let world
      if (this.props.match && this.props.match.params.id) {
        const uri = '/worlds/' + this.props.match.params.id
        const worldRef = db.ref(uri)
        world = (await worldRef.once('value')).val()
        if (
          !world.private ||
          (this.props.currentUser &&
            world.authorizedPlayers &&
            world.authorizedPlayers.includes(
              this.props.currentUser.displayName
            ))
        ) {
          this.setState({
            authorized: true
          })
          this.unsubscribe = generateWorld(
            world,
            this.props.currentUser,
            this.props.guestAvatar
          )
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      window.removeEventListener('keydown', onSpaceBar, false)
      this.unsubscribe()
    }
  }
  render() {
    return this.state.authorized ? (
      <div id="plane">
        <input id="color-palette" type="color" defaultValue="#b9c4c0" />
      </div>
    ) : (
      <div className="world-list">
        <p>You have no authorization to access this world.</p>
      </div>
    )
  }
}

export default World
