function deleteBlock(selected, scene, objects) {
  if (selected) {
    scene.remove(selected)
    selected.geometry.dispose()
    selected.material.dispose()
    objects = objects.filter(e => e.uuid !== selected.uuid)
    selected = undefined
  }
  return objects
}
export default deleteBlock
