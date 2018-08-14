import {makeUnitCube} from '../meshes'
function addBlock(position, color, scene, objects) {
  const cube = makeUnitCube(position, color, 1)
  scene.add(cube)
  objects.push(cube)
}

export default addBlock
