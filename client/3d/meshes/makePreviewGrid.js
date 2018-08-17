import * as THREE from 'three'

function makePreviewGrid() {
  // const start = 0
  // const end = 0
  // for (let i = start; i <= end; i++) {
  //   previewBox.add(makeGridWithYaxisOffset(i))
  // }
  // const boxGeo = new THREE.BoxGeometry(size, size, size)
  // const edgesGeo = new THREE.EdgesGeometry(boxGeo)
  // const mat = new THREE.LineBasicMaterial({color: 0xffffff, width: 4})
  // const previewGrid = new THREE.LineSegments(boxGeo, mat)
  // return previewGrid
  return makeGridWithYaxisOffset(0)
}
function makeGridWithYaxisOffset(offset) {
  const size = 9
  const gridHelper = new THREE.GridHelper(size, size, 0x888888)
  gridHelper.position.set(0, offset, 0)
  return gridHelper
}

export default makePreviewGrid
