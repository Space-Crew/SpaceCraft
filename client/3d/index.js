import {Vector3} from 'three'
export function toKey(position) {
  return `${position.x},${position.y},${position.z}`
}
/* const removePeriod = coord => {
  // more efficient way to remove a period? //
  return coord
    .toString()
    .split('.')
    .join('')
}
export function cameraPositionToKey(position) {
  return `${removePeriod(position.x)},${removePeriod(
    position.y
  )},${removePeriod(position.z)}`
} */
export function toPosition(key) {
  const positions = key.split(',')
  return new Vector3(positions[0], positions[1], positions[2])
}
