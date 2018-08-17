import * as THREE from 'three'

function darken(color, percent) {
  let t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = color >> 16,
    G = (color >> 8) & 0x00ff,
    B = color & 0x0000ff
  return (
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
}

export function makeUnitCube(position, color = 0xb9c4c0, opacity, texture) {
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
    console.log('loading texture')
    material.map = new THREE.TextureLoader().load(texture)
  }
  const mesh = new THREE.Mesh(geometry, material)
  var geo = new THREE.EdgesGeometry(mesh.geometry)
  var mat = new THREE.LineBasicMaterial({
    color: darken(color, -0.1),
    linewidth: 3
  })
  var wireframe = new THREE.LineSegments(geo, mat)
  wireframe.renderOrder = 1
  mesh.add(wireframe)
  mesh.position.copy(position)
  return mesh
}
