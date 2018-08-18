import * as THREE from 'three'
function selectBlock(mouse, camera, objects) {
  console.log('objects length', objects.length)
  const raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(),
    0.1,
    1000
  )
  raycaster.setFromCamera(mouse, camera)
  const intersections = raycaster
    .intersectObjects(objects)
    .filter(e => !e.unselectable)
  console.log('intersections', intersections)
  if (intersections.length > 0) {
    return intersections[0].object
  } else return null
}

export default selectBlock
