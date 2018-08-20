import React, {Component} from 'react'
import * as THREE from 'three'

// main scene //
const scene = new THREE.Scene()
// main camera //
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 5
camera.position.x = -2

// lights //
var rightLight = new THREE.PointLight(0xeeeeee, 0.6)
rightLight.position.set(20, 0, 20)
scene.add(rightLight)
const leftLight = new THREE.PointLight(0xeeeeee, 0.6)
leftLight.position.set(-20, 0, 20)
scene.add(leftLight)
var lightAmb = new THREE.AmbientLight(0x777777)
scene.add(lightAmb)

// renderer //
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

// add 3D text //
const fontLoader = new THREE.FontLoader()
fontLoader.load('/fonts/gentilis_regular.typeface.json', font => {
  let material, geom, mesh, letterWidth, x, y, z, letter
  let nextLine = false
  let textWidth = 0
  const text = 'unleash your imagination'
  material = new THREE.MeshPhongMaterial({
    color: '#F9EDEB',
    side: THREE.DoubleSide,
    reflectivity: 0.5
  })
  for (let i = 0; i < text.length; i++) {
    letter = text[i]
    if (letter === ' ') {
      textWidth += 1
      continue
    }
    z = -5
    x = -10 + textWidth
    y = 2
    if (letter === 'i') nextLine = true
    if (nextLine) {
      x = -8 + textWidth - 'unleash your'.length
      y = -3
    }
    geom = new THREE.TextGeometry(letter, {
      font: font,
      size: 2,
      height: 1
    })
    mesh = new THREE.Mesh(geom, material)
    geom.computeBoundingBox()
    letterWidth = geom.boundingBox.max.x - geom.boundingBox.min.x
    textWidth += letterWidth
    mesh.position.set(x, y, z)
    scene.add(mesh)
  }
})

// load background texture //
const texture = new THREE.TextureLoader().load('/starrybackground.png')
const backgroundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 0),
  new THREE.MeshBasicMaterial({map: texture})
)
backgroundMesh.material.depthTest = false
backgroundMesh.material.depthWrite = false
scene.add(backgroundMesh)

// background scene //
const backgroundScene = new THREE.Scene()
const backgroundCamera = new THREE.Camera()
backgroundScene.add(backgroundCamera)
backgroundScene.add(backgroundMesh)

// render function //
let theta = 0
let radius = 10

const renderThree = () => {
  // update 3D text rotations //
  setTimeout(() => {
    const timer = Date.now() * 0.0001
    theta += 0.1
    camera.position.x = radius * Math.sin(THREE.Math.degToRad(theta))
    camera.position.y = radius * Math.sin(THREE.Math.degToRad(theta))
    camera.position.z = radius * Math.cos(THREE.Math.degToRad(theta))
    camera.lookAt(scene.position)
    camera.updateMatrixWorld(true)
    scene.traverse(object => {
      object.rotation.x = timer * 2.5
      object.rotation.y = timer * 3.5
      object.rotation.z = timer * 2.5
    })
  }, 3000)

  renderer.autoClear = false
  renderer.clear()
  renderer.render(backgroundScene, backgroundCamera)
  renderer.render(scene, camera)
}
const animate = () => {
  requestAnimationFrame(animate)
  renderThree()
}

class Home extends Component {
  componentDidMount() {
    document.getElementById('homepage').appendChild(renderer.domElement)
    animate()
  }
  render() {
    return <div id="homepage" />
  }
}

export default Home
