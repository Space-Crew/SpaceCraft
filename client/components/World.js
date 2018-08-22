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
  UndoStack,
  HorizonControl
} from '../3d/controls'
import {configureRenderer} from '../3d/configure'
import {showInstructions} from '../utilities'

/*********************************
 * Construct the Three World
 ********************************/

let isPaused = false
let onEsc

function generateWorld(world, currentUser, guestAvatar) {
  //container for all 3d objects that will be affected by event
  let objects = []
  const cubesToBeMoved = {}

  const {renderer, camera, scene, disposeOfResize} = configureRenderer()

  scene.undoStack = new UndoStack(world.id)

  const cameraControl = new CameraControl(camera, renderer.domElement)
  scene.add(cameraControl.getObject())

  const motionControl = new MotionControl(cameraControl.getObject())

  const horizonControl = new HorizonControl(scene)

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
    currentUser ? currentUser : {displayName: guestAvatar},
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

  onEsc = event => {
    if (event.which === 27) {
      isPaused = !isPaused
      showInstructions(isPaused)
      animate()
    }
  }

  window.addEventListener('keydown', onEsc, false)

  /*********************************
   * Dispose functions
   ********************************/

  return function() {
    cameraControl.dispose()
    blockControl.dispose()
    previewControl.dispose()
    motionControl.dispose()
    horizonControl.dispose()
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
      window.removeEventListener('keydown', onEsc, false)
      this.unsubscribe()
      if (isPaused) {
        isPaused = !isPaused
        showInstructions(isPaused)
      }
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
