export function checkPositionOccupied(position, objects) {
  return objects.some(
    e =>
      position.x === e.position.x &&
      position.y === e.position.y &&
      position.z === e.position.z
  )
}
