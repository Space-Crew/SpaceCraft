import * as THREE from 'three'
function selectBlock(mouse, camera, objects) {
  const raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(),
    0.1,
    1000
  )
  console.log(objects)
  raycaster.setFromCamera(mouse, camera)
  const intersections = raycaster
    .intersectObjects(objects)
    .filter(e => !e.unselectable)
  if (intersections.length > 0) {
    return intersections[0].object
  }
}

export default selectBlock
