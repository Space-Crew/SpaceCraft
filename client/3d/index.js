import {Vector3} from 'three'
export function toKey(position) {
  return `${position.x},${position.y},${position.z}`
}
export function toPosition(key) {
  const positions = key.split(',')
  return new Vector3(positions[0], positions[1], positions[2])
}
