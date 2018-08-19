import React, {Component} from 'react'
import * as THREE from 'three'
import OrbitControls from 'three-orbitcontrols'

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

var ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

// START PLANETS //
const addToGroup = (orbitGroup, circle, planet) => {
  orbitGroup.add(circle)
  orbitGroup.add(planet)
}
const lineMaterial = new THREE.LineDashedMaterial({color: 'teal'})

// first planet from the sun //
const firstGeo = new THREE.CircleGeometry(2, 100)
firstGeo.vertices.shift()

const firstCircle = new THREE.Line(firstGeo, lineMaterial)
firstCircle.rotation.x = Math.PI * 0.5

const firstPlanet = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 32, 32),
  new THREE.MeshPhongMaterial({color: 'yellow'})
)
firstPlanet.position.set(2, 0, 0)

const firstOrbit = new THREE.Group()
addToGroup(firstOrbit, firstCircle, firstPlanet)

// second planet from the sun //
const secondGeo = new THREE.CircleGeometry(3.5, 100)
secondGeo.vertices.shift()
const secondCircle = new THREE.Line(secondGeo, lineMaterial)
secondCircle.rotation.x = Math.PI * 0.51
const secondPlanet = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.6, 32, 32),
  new THREE.MeshPhongMaterial({color: 'purple'})
)
secondPlanet.position.set(3.5, 0, 0)
const secondOrbit = new THREE.Group()
addToGroup(secondOrbit, secondCircle, secondPlanet)

// third planet from the sun //
const thirdGeo = new THREE.CircleGeometry(5, 100)
thirdGeo.vertices.shift()
const thirdCircle = new THREE.Line(thirdGeo, lineMaterial)
thirdCircle.rotation.x = Math.PI * 0.5
const thirdPlanet = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.9, 32, 32),
  new THREE.MeshPhongMaterial({color: 'red'})
)
thirdPlanet.position.set(5, 0, 0)
const thirdOrbit = new THREE.Group()
addToGroup(thirdOrbit, thirdCircle, thirdPlanet)

// combine orbits //
const orbitDir = new THREE.Group()
orbitDir.rotation.x = 0.2
orbitDir.add(firstOrbit)
orbitDir.add(secondOrbit)
orbitDir.add(thirdOrbit)
scene.add(orbitDir)

// sun //
const sun = new THREE.Mesh(
  new THREE.SphereBufferGeometry(1.0, 32, 32),
  new THREE.MeshPhongMaterial({emissive: 0xff5800, emissiveIntensity: 0.5})
)

var pointLight = new THREE.PointLight(0xffffff, 1.0, 10.0)
sun.add(pointLight)
scene.add(sun)

// FINISHED PLANETS //

// renderer //
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)

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

const renderThree = () => {
  controls.update()
  firstOrbit.rotation.y += 0.015
  secondOrbit.rotation.y += 0.02
  thirdOrbit.rotation.y += 0.021

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

/* // add 3D text //
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
 */

/* // update 3D text rotations //
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
}, 3000) */
