import {expect} from 'chai'
import * as THREE from 'three'
import {UndoStack} from './UndoStack'
import sinon from 'sinon'
const position = new THREE.Vector3(5, 3, 11)
const position2 = new THREE.Vector3(1, 8, -5)
const color = 0x4286f4
const color2 = 0x7d7d7d
const scene = new THREE.Scene()
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial({
  color
})
const block = new THREE.Mesh(geometry, material)
block.position.copy(position)
const addType = 'ADD'
const deleteType = 'DELETE'
const id = -1

describe('Undo Stack', () => {
  it('takes an id and returns an object with properties "worldId" and "stack"', () => {
    scene.undoStack = new UndoStack(id)
    expect(scene.undoStack).to.have.property('worldId')
    expect(scene.undoStack.worldId).to.equal(id)
    expect(scene.undoStack).to.have.property('stack')
    expect(scene.undoStack.stack).to.be.an('array')
    expect(scene.children.length).to.equal(0)
  })
  it('takes position,color,type and adds it to the top of the stack', () => {
    scene.undoStack.stackPushAdd(position, color)
    expect(scene.undoStack.stack.length).to.equal(1)
    expect(scene.undoStack.stack[0].position.x).to.equal(block.position.x)
    expect(scene.undoStack.stack[0].position.y).to.equal(block.position.y)
    expect(scene.undoStack.stack[0].position.z).to.equal(block.position.z)
    expect(scene.undoStack.stack[0].color).to.equal(color)
    expect(scene.undoStack.stack[0].type).to.equal(addType)
    scene.undoStack.stackPushDelete(position2, color2, deleteType)
    expect(scene.undoStack.stack.length).to.equal(2)
    expect(scene.undoStack.stack[1].position.x).to.equal(position2.x)
    expect(scene.undoStack.stack[1].position.y).to.equal(position2.y)
    expect(scene.undoStack.stack[1].position.z).to.equal(position2.z)
    expect(scene.undoStack.stack[1].color).to.equal(color2)
    expect(scene.undoStack.stack[1].type).to.equal(deleteType)
  })
  it('undo decrements the pointer and makes add/delete calls to the db', () => {
    const startPointer = scene.undoStack.pointer
    let addStub = sinon.stub(scene.undoStack, 'addBlockToDb').callsFake()
    let deleteStub = sinon
      .stub(scene.undoStack, 'deleteBlockFromDb')
      .callsFake()
    scene.undoStack.stackPushAdd(position, color)
    scene.undoStack.stackPushDelete(position2, color2)
    const middlePointer = scene.undoStack.pointer
    scene.undoStack.undo()
    expect(addStub.calledWith(position2, color2, id)).to.be.true
    expect(addStub.callCount).to.equal(1)
    scene.undoStack.undo()
    expect(deleteStub.callCount).to.equal(1)
    expect(deleteStub.calledWith(position, id)).to.be.true
    expect(scene.undoStack.pointer).to.equal(startPointer)
    const endPointer = scene.undoStack.pointer
    expect(startPointer).to.equal(middlePointer - 2)
    expect(endPointer).to.equal(middlePointer - 2)
    expect(startPointer).to.equal(endPointer)
  })
})
