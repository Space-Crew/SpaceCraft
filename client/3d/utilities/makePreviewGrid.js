import * as THREE from 'three'

export function makePreviewGrid() {
  const grid = makeGridWithYaxisOffset(0)
  grid.visible = false
  const toggleVisibility = function() {
    this.visible = !this.visible
  }
  const boundToggleVisibility = toggleVisibility.bind(grid)
  return {
    grid,
    boundToggleVisibility
  }
}
function makeGridWithYaxisOffset(offset) {
  const size = 9
  const gridHelper = new THREE.GridHelper(size, size, 0x888888)
  gridHelper.position.set(0, offset, 0)
  return gridHelper
}
