import React, {Component} from 'react'
import {default as THREE} from 'three'

// main scene //
const scene = new THREE.Scene()
// main camera //
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// lights //
// Create lights
var rightLight = new THREE.PointLight(0xeeeeee)
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
const group = new THREE.Group()
// PlayfairDisplayRegular.json
let material, textGeom, textMesh
const fontLoader = new THREE.FontLoader()
fontLoader.load('/fonts/gentilis_regular.typeface.json', font => {
  material = new THREE.MeshNormalMaterial /* {color: '#F9EDEB'} */()
  textGeom = new THREE.TextGeometry('unleash your', {
    font: font,
    size: 2,
    height: 1
  })
  textMesh = new THREE.Mesh(textGeom, material)
  // textMesh.position.set(-5, 0, -5)
  textGeom.computeBoundingBox()
  // let textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x
  textMesh.position.set(-10, 2, -5)
  // scene.add(textMesh)
  group.add(textMesh)
})

let mat, geom, mesh
fontLoader.load('/fonts/gentilis_regular.typeface.json', font => {
  mat = new THREE.MeshNormalMaterial /* {color: '#F9EDEB'} */()
  geom = new THREE.TextGeometry('imagination', {
    font: font,
    size: 2,
    height: 1
  })
  mesh = new THREE.Mesh(geom, mat)
  geom.computeBoundingBox()
  // let textWidth = geom.boundingBox.max.x - geom.boundingBox.min.x
  mesh.position.set(-5, -3, -5)
  group.add(mesh)
  scene.add(group)
})

// Set up the main camera
camera.position.z = 5
camera.position.x = -2

// load background texture //
const texture = new THREE.TextureLoader().load('starrybackground.png')
const backgroundMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 0),
  new THREE.MeshBasicMaterial({map: texture})
)
backgroundMesh.material.depthTest = false
backgroundMesh.material.depthWrite = false
scene.add(backgroundMesh)

// background scene //
var backgroundScene = new THREE.Scene()
var backgroundCamera = new THREE.Camera()
backgroundScene.add(backgroundCamera)
backgroundScene.add(backgroundMesh)

const renderThree = () => {
  // update 3D text rotations //
  setTimeout(() => {
    if (group) {
      group.rotation.x -= 0.005
      group.rotation.z -= 0.005
      group.rotation.y += 0.005
    }
  }, 5000)
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
