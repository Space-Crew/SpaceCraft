import * as THREE from 'three'

const toggleVisibility = function() {
  this.visible = !this.visible
}
export function makePreviewGrid() {
  const grid = makeGridWithYaxisOffset(0, 9)
  grid.visible = false
  const boundToggleVisibility = toggleVisibility.bind(grid)
  return {
    grid,
    boundToggleVisibility
  }
}

function makeGridWithYaxisOffset(offset, size) {
  const gridHelper = new THREE.GridHelper(size, size, 0x888888)
  gridHelper.position.set(0, offset, 0)
  return gridHelper
}

export function makeHorizonGrid() {
  const grid = makeGridWithYaxisOffset(-0.5, 1001)
  const boundToggleVisibility = toggleVisibility.bind(grid)
  return {
    grid,
    boundToggleVisibility
  }
}
