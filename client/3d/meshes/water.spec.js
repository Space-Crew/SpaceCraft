import {expect} from 'chai'
import {FlowCube} from './water'

describe('FlowCube', () => {
  describe('createChild', () => {
    let source
    let flowMap
    let child
    before(() => {
      source = new FlowCube(0, 0, 0, true, {}, 4)
      flowMap = {'0,0,0': source}
      source.createChild({x: 0, y: -1, z: 0}, flowMap)
      child = source.children['0,-1,0']
    })
    it('sets child position', () => {
      expect(child.position).to.include({x: 0, y: -1, z: 0})
    })
    it('adds to flowMap', () => {
      expect(flowMap['0,-1,0'].position).to.include({x: 0, y: -1, z: 0})
    })
    it('decreases the volume', () => {
      expect(child.volume).to.equal(3)
    })
    it('does not decrease volume if specified', () => {
      const childWithSameVolume = source.createChild(
        {x: 1, y: -1, z: 0},
        flowMap,
        false
      )
      expect(childWithSameVolume.volume).to.equal(4)
    })
    it('does not make child a source', () => {
      expect(child.isSource).to.equal(false)
    })
    it('keeps its parent', () => {
      expect(child.parents).to.have.property('0,0,0')
    })
  })
  describe('clonePosition', () => {
    let source
    let clone
    before(() => {
      source = new FlowCube(0, -62, 0, true, {}, 4)
      clone = source.clonePosition()
    })
    it('creates a new object with same position', () => {
      expect(clone).to.deep.equal(source.position)
      expect(clone).to.not.equal(source.position)
    })
  })
  describe('getAdjacentPositions', () => {
    let source
    let adjacentPositions
    before(() => {
      source = new FlowCube(0, -62, 0, true, {}, 4)
      adjacentPositions = source.getAdjacentPositions()
    })
    it('gets adjacent positions on the xy plane', () => {
      expect(adjacentPositions).to.deep.equal([
        {x: 0, y: -62, z: 1},
        {x: 1, y: -62, z: 0},
        {x: 0, y: -62, z: -1},
        {x: -1, y: -62, z: 0}
      ])
    })
  })
  describe('spawnChildren', () => {
    const cubes = {'0,-64,0': 'stuff'}
    let source
    let flowMap
    before(() => {
      source = new FlowCube(0, -62, 0, true, {}, 2)
      flowMap = {'0,-62,0': source}
      source.spawnChildren(cubes, flowMap)
    })
    it('updates flowMap with correct values', () => {
      expect(Object.keys(flowMap)).to.have.lengthOf(10)
      expect(flowMap).to.have.property('0,-63,0')
      expect(flowMap).to.have.property('1,-63,0')
      expect(flowMap).to.have.property('-1,-63,0')
      expect(flowMap).to.have.property('0,-63,1')
      expect(flowMap).to.have.property('0,-63,-1')
      expect(flowMap).to.have.property('1,-64,0')
      expect(flowMap).to.have.property('-1,-64,0')
      expect(flowMap).to.have.property('0,-64,1')
      expect(flowMap).to.have.property('0,-64,-1')
    })
  })
})
