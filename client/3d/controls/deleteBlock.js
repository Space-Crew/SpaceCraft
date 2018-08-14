function deleteBlock(selected, scene, objects) {
  scene.remove(selected)
  selected.geometry.dispose()
  selected.material.dispose()
  // for (let prop in selected) {
  //   if (selected.hasOwnProperty(prop)) {
  //     delete selected[prop]
  //   }
  // }
  selected = undefined
  objects = scene.children
}
export default deleteBlock
