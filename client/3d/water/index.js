export {makeWaterCube} from './makeWaterCube'
export {FlowGraph} from './WaterGraph'
export {FlowCube} from './water'
export {initializeWaterControls, attachWaterToScene} from './waterControls'
export {GameFlowGraph} from './GameFlowGraph'

export function toKey(position) {
  return `${position.x},${position.y},${position.z}`
}
