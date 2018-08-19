import {addBlockToDb} from './addBlock'
import {deleteBlockFromDb} from './deleteBlock'
class UndoStack {
  constructor(worldId) {
    /*
    example of array elements = {
      position:{x: 0, y: 0, z: 0},
      color: 0xb9c4c0,
      type: "ADD" || "DELETE"
    }
    */
    this.worldId = worldId
    this.stack = []
    this.addBlockToDb = addBlockToDb
    this.deleteBlockFromDb = deleteBlockFromDb
  }
  add({x, y, z}, color, type) {
    this.stack.push({position: {x, y, z}, color, type})
  }
  undo() {
    if (this.stack.length) {
      const lastBlock = this.stack.pop()
      const {position, color, type} = lastBlock
      if (type === 'ADD') {
        this.deleteBlockFromDb(position, this.worldId)
      } else if (type === 'DELETE') {
        this.addBlockToDb(position, color, this.worldId)
      }
    }
  }
  getAll() {
    return this.stack
  }
  getFirst() {
    return this.stack[0]
  }
  getLast() {
    return this.stack[this.stack.length - 1]
  }
  size() {
    return this.stack.length
  }
  clear() {
    this.stack = []
  }
}
export default UndoStack
