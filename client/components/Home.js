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

// lights
const rightLight = new THREE.PointLight(0xffffff, 0.85)
rightLight.position.set(20, 10, 20)
rightLight.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(rightLight)
const lightAmb = new THREE.AmbientLight(0x777777, 0.5)
scene.add(lightAmb)

// START PLANETS //
const textureLoader = new THREE.TextureLoader()

// first planet from the sun //
const verticesOfCube = [
  -1,
  -1,
  -1,
  1,
  -1,
  -1,
  1,
  1,
  -1,
  -1,
  1,
  -1,
  -1,
  -1,
  1,
  1,
  -1,
  1,
  1,
  1,
  1,
  -1,
  1,
  1
]

const indicesOfFaces = [
  2,
  1,
  0,
  0,
  3,
  2,
  0,
  4,
  7,
  7,
  3,
  0,
  0,
  1,
  5,
  5,
  4,
  0,
  1,
  2,
  6,
  6,
  5,
  1,
  2,
  3,
  7,
  7,
  6,
  2,
  4,
  5,
  6,
  6,
  7,
  4
]
const sirusTexture = textureLoader.load('/textures/sirus.jpg')
// const firstCircleGeo = new THREE.CircleGeometry(2, 100)
// firstCircleGeo.vertices.shift()
// const firstCircle = new THREE.Line(firstCircleGeo, lineMaterial)
// firstCircle.rotation.x = Math.PI * 0.5
const firstPlanetMat = new THREE.MeshPhongMaterial()
firstPlanetMat.map = sirusTexture
const firstPlanet = new THREE.Mesh(
  new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, 0.5, 1),
  firstPlanetMat
)
firstPlanet.position.set(2, 0, 0)
// const geo = new THREE.geomet()
const firstOrbit = new THREE.Group()
firstOrbit.add(firstPlanet)

// second planet from the sun //
const jupiterTexture = textureLoader.load('/textures/jupiter.jpg')
const secondPlanetMat = new THREE.MeshPhongMaterial()
secondPlanetMat.map = jupiterTexture
const secondPlanet = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 8, 60),
  secondPlanetMat
)
secondPlanet.position.set(3.5, 0, 0)
const secondOrbit = new THREE.Group()
secondOrbit.add(secondPlanet)

// third planet from the sun //
const earthTexture = textureLoader.load('/textures/earth.jpg')
const thirdPlanetMat = new THREE.MeshPhongMaterial()
thirdPlanetMat.map = earthTexture
const thirdPlanet = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.9, 32, 32),
  thirdPlanetMat
)
thirdPlanet.position.set(5, 0, 0)
const thirdOrbit = new THREE.Group()
thirdOrbit.add(thirdPlanet)

// fourth planet from the sun //
const marsTexture = textureLoader.load('/textures/mars.jpg')
const fourthPlanetMap = new THREE.MeshPhongMaterial()
fourthPlanetMap.map = marsTexture
const fourthPlanet = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 1.5, 1.5),
  fourthPlanetMap
)
fourthPlanet.position.set(7.5, 0, 0)
const fourthOrbit = new THREE.Group()
fourthOrbit.add(fourthPlanet)

const orbitDir = new THREE.Group()
// shooting stars //
for (let i = 1; i < 6; i++) {
  let star = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.2, 32, 32),
    new THREE.MeshPhongMaterial({color: 0xfce97e})
  )
  star.position.set(i + 10, i - 2, i + 5)
  const starOrbit = new THREE.Group()
  starOrbit.add(star)
  orbitDir.add(starOrbit)
}

// combine orbits //
orbitDir.rotation.x = 0.02
orbitDir.add(firstOrbit)
orbitDir.add(secondOrbit)
orbitDir.add(thirdOrbit)
orbitDir.add(fourthOrbit)
scene.add(orbitDir)

// sun //
const sunTexture = textureLoader.load('/textures/sun.jpg')
const sunGeo = new THREE.SphereBufferGeometry(1.0, 32, 32)
const sunMat = new THREE.MeshPhongMaterial({
  emissive: 0xff5800,
  emissiveIntensity: 0.5
})
sunMat.map = sunTexture
const sun = new THREE.Mesh(sunGeo, sunMat)

var pointLight = new THREE.PointLight(0xffffff, 1.0, 10.0)
sun.add(pointLight)
scene.add(sun)

// renderer //
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
const controls = new OrbitControls(camera, renderer.domElement)

// load background texture //
const texture = textureLoader.load('/textures/deep-space.jpg')
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
  secondOrbit.rotation.x += 0.005
  thirdOrbit.rotation.y += 0.021
  fourthOrbit.rotation.y += 0.015
  fourthOrbit.rotation.x += 0.007
  fourthPlanet.rotation.x += 0.005
  fourthPlanet.rotation.y += 0.005
  orbitDir.children[0].rotation.y += 0.06
  orbitDir.children[1].rotation.y += 0.09
  orbitDir.children[2].rotation.y += 0.1
  orbitDir.children[3].rotation.y += 0.002
  orbitDir.children[4].rotation.y += 0.011

  sun.rotation.x += 0.005
  sun.rotation.y += 0.005

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
