import * as THREE from 'three'
import {makePreviewGrid, makeUnitCube} from '../../utilities'

export const PreviewControl = function(_scene) {
  const previewGrid = makePreviewGrid()
  const position = new THREE.Vector3(0, 0, 0)
  let previewBox = makeUnitCube(position, 0xb9c4c0, 0.3)
  previewBox.unselectable = true
  previewBox.visible = false
  previewBox.add(previewGrid.grid)
  previewBox.togglePreviewGridVisibility = previewGrid.boundToggleVisibility
  _scene.add(previewBox)
  function activate() {
    window.addEventListener('keydown', onDocumentKeyDown, false)
    window.addEventListener('keyup', onDocumentKeyUp, false)
  }
  function deactivate() {
    window.removeEventListener('keydown', onDocumentKeyDown, false)
    window.addEventListener('keyup', onDocumentKeyUp, false)
  }
  function onDocumentKeyDown(event) {
    if (event.which === 71) {
      //G
      previewBox.togglePreviewGridVisibility()
    } else if (event.which === 16) {
      previewBox.visible = true
    } else if (event.which === 91) {
      previewBox.visible = false
    }
  }

  function onDocumentKeyUp(event) {
    if (event.which === 16) {
      previewBox.visible = false
    }
  }

  function dispose() {
    deactivate()
  }
  activate()
  this.previewBox = previewBox
  this.enabled = true
  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose
}
