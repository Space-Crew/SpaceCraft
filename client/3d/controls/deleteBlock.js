function deleteBlock(selected, scene, objects) {
  if (selected) {
    scene.remove(selected)
    selected.geometry.dispose()
    selected.material.dispose()
    selected = undefined
    return objects.filter(e=> e.uuid !== selectedid)
  }
}
export default deleteBlock
