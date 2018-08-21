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
    this.dragging = null
    this.pointer = null
    this.addBlockToDb = addBlockToDb
    this.deleteBlockFromDb = deleteBlockFromDb
  }
  stackPushAdd({x, y, z}, color) {
    this.clearBlocksAbovePointer()
    this.incrementPointer()
    this.stack.push({position: {x, y, z}, color, type: 'ADD'})
  }
  stackPushDelete({x, y, z}, color) {
    this.clearBlocksAbovePointer()
    this.incrementPointer()
    this.stack.push({position: {x, y, z}, color, type: 'DELETE'})
  }
  startDrag({x, y, z}, color) {
    if (!this.dragging)
      this.dragging = {
        position: {start: {x, y, z}},
        color,
        type: 'DRAG'
      }
  }
  endDrag({x, y, z}) {
    if (this.dragging) {
      this.clearBlocksAbovePointer()
      this.incrementPointer()
      this.dragging.position.end = {x, y, z}
      this.stack.push({...this.dragging})
      this.dragging = null
    }
  }
  undo() {
    if (this.pointer !== null) {
      const currentBlock = this.getCurrentBlock()
      const {position, color, type} = currentBlock
      if (type === 'ADD') {
        this.deleteBlockFromDb(position, this.worldId)
      } else if (type === 'DELETE') {
        this.addBlockToDb(position, color, this.worldId)
      } else if (type === 'DRAG') {
        this.deleteBlockFromDb(position.end, this.worldId)
        this.addBlockToDb(position.start, color, this.worldId)
      }
      this.decrementPointer()
    }
  }
  redo() {
    if (this.checkBlocksAbovePointer()) {
      this.incrementPointer()
      const currentBlock = this.getCurrentBlock()
      const {position, color, type} = currentBlock
      if (type === 'ADD') {
        this.addBlockToDb(position, color, this.worldId)
      } else if (type === 'DELETE') {
        this.deleteBlockFromDb(position, this.worldId)
      } else if (type === 'DRAG') {
        this.addBlockToDb(position.end, color, this.worldId)
        this.deleteBlockFromDb(position.start, this.worldId)
      }
    }
  }
  getCurrentBlock() {
    return this.stack[this.pointer]
  }
  incrementPointer() {
    if (this.pointer === null) {
      this.pointer = 0
    } else {
      this.pointer += 1
    }
  }
  decrementPointer() {
    if (this.pointer > 0) {
      this.pointer -= 1
    } else {
      this.pointer = null
    }
  }
  checkBlocksAbovePointer() {
    if (this.pointer === null) {
      return this.stack.length ? true : false
    } else {
      return this.stack.length > this.pointer + 1
    }
  }
  clearBlocksAbovePointer() {
    if (this.pointer === null) {
      this.clear()
    } else {
      this.stack = this.stack.slice(0, this.pointer + 1)
    }
  }
  size() {
    return this.stack.length
  }
  clear() {
    this.stack = []
  }
}
export default UndoStack
