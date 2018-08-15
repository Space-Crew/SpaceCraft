function deleteBlock(selected, scene, objects) {
  scene.remove(selected)
  selected.geometry.dispose()
  selected.material.dispose()
  selected = undefined
  objects = scene.children
}
export default deleteBlock
