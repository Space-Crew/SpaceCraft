import React, {Component} from 'react'
import {default as THREE} from 'three'

class Plane extends Component {
  componentDidMount() {
    const renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0xbada55)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.y = 3

    //This is hopefuly to enable the ghost perspective
    // const controls = new THREE.FirstPersonControls(camera)
    // controls.movementSpeed = 1000
    // controls.lookSpeed = 0.125
    // controls.lookVertical = true

    const scene = new THREE.Scene()

    const light = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(light)
    const pointLight = new THREE.PointLight(0xffffff, 0.8)
    pointLight.position.set(0, 8, 2)
    scene.add(pointLight)

    document.body.appendChild(renderer.domElement)

    for (let z = -10; z < 10; z += 1) {
      for (let x = -10; x <= 10; x += 1) {
        const y = 1
        scene.add(makeUnitCube(x, y, z, 0xa52a2a))
      }
    }

    window.addEventListener('keydown', event => {
      //add movement
      switch (event.which) {
        case 87: //W
          camera.position.z -= 1
          break
        case 83: // S
          camera.position.z += 1
          break
        case 65: //A
          camera.position.x -= 1
          break
        case 68: //D
          camera.position.x += 1
          break
        case 69: //Q
          camera.position.y += 1
          break
        case 81: //E
          camera.position.y -= 1
          break
      }
    })

    // const clock = new THREE.Clock() //needed for controls
    function render() {
      //   controls.update(clock.getDelta()) // needed for First Person Controls to work
      renderer.render(scene, camera)
    }
    function animate() {
      requestAnimationFrame(animate)
      render()
    }
    animate()
  }
  render() {
    return <div />
  }
}

export default Plane

function makeUnitCube(x, y, z, color = 0x0) {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshLambertMaterial({color}) //Lambert is so that the material can be affected by light
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(x, y, z)
  return mesh
}

//water flow by doing BFS from source