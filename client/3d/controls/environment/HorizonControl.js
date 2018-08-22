import {makeHorizonGrid} from '../../../utilities'

export const HorizonControl = function(_scene) {
  const horizon = makeHorizonGrid()
  _scene.add(horizon.grid)
  function activate() {
    window.addEventListener('keydown', onDocumentKeyDown, false)
  }
  function deactivate() {
    window.removeEventListener('keydown', onDocumentKeyDown, false)
  }
  function onDocumentKeyDown(event) {
    if (event.which === 72) {
      horizon.boundToggleVisibility()
    }
  }

  function dispose() {
    deactivate()
  }
  activate()
  this.horizon = horizon
  this.enabled = true
  this.activate = activate
  this.deactivate = deactivate
  this.dispose = dispose
}
