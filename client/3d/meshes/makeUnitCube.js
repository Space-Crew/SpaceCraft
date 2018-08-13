import * as THREE from 'three'

export function makeUnitCube(
  position,
  color = 0xb9c4c0,
  opacity,
  texture
) {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshLambertMaterial({
    color
  }) //Lambert is so that the material can be affected by light
  material.transparent = true
  material.opacity = opacity
  if (texture) {
    //     from stack overlfow
    // mesh.material.map = THREE.ImageUtils.loadTexture( src ); //assumes you've pre-loaded your images, for now will ignore
    // mesh.material.needsUpdate = true;
    material.map = new THREE.TextureLoader().load(texture)
  }
  const mesh = new THREE.Mesh(geometry, material)
  var geo = new THREE.EdgesGeometry(mesh.geometry)
  var mat = new THREE.LineBasicMaterial({color: 0xb9d4c0, linewidth: 2})
  var wireframe = new THREE.LineSegments(geo, mat)
  wireframe.renderOrder = 1
  mesh.add(wireframe)
  mesh.position.copy(position)
  return mesh
}
