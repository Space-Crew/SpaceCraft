import THREE from 'three'

export function constructSelectedBox(DOMElement, camera) {
  //build cube
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({color: 0xa52a2a})
  material.transparent = true
  material.opacity = 0.3
  const mesh = new THREE.Mesh(geometry, material)
  var geo = new THREE.EdgesGeometry(mesh.geometry)
  var mat = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2})
  var wireframe = new THREE.LineSegments(geo, mat)
  wireframe.renderOrder = 1
  mesh.add(wireframe)
  mesh.position.set(0, 3, 4)

  DOMElement.addEventListener('mousemove', event => {
    const mouse = new THREE.Vector2()
    mouse.x = event.clientX / window.innerWidth * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    //update the selected box
    const raycaster = new THREE.Raycaster()
    const mouseVectorForBox = new THREE.Vector3()
    raycaster.setFromCamera(mouse, camera)
    mouseVectorForBox.copy(camera.position)
    mouseVectorForBox.addScaledVector(raycaster.ray.direction, 4)
    mesh.position.copy(mouseVectorForBox)
    mesh.position.round()
  })
  return mesh
}
