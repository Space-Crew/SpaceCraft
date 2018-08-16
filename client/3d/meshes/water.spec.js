import {expect} from 'chai'
import {FlowCube} from './water'

describe('FlowCube', () => {
  describe('createChild', () => {
    describe('simply', () => {
      let source
      let flowMap
      let child
      beforeEach(() => {
        source = new FlowCube(0, 0, 0, true, 4)
        flowMap = {'0,0,0': source}
        child = source.createChild({x: 0, y: -1, z: 0}, flowMap)
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
    describe('modifies parent/children', () => {
      let source
      let flowMap
      let otherCube
      beforeEach(() => {
        source = new FlowCube(0, 0, 0, true, 4)
        otherCube = new FlowCube(0, 1, 0, false, 4)
        flowMap = {'0,0,0': source, '0,1,0': otherCube}
      })
      it('when flowing into another cube, will become a parent of that cube if that cube is not a source', () => {
        source.createChild({x: 0, y: 1, z: 0}, flowMap)
        expect(otherCube.parents['0,0,0']).to.equal(source)
      })
      it('when flowing into another cube, will add that cube as its child', () => {
        source.createChild({x: 0, y: 1, z: 0}, flowMap)
        expect(source.children['0,1,0']).to.equal(otherCube)
      })
      it('when flowing into another cube, will not become a parent of that cube if that cube is a source', () => {
        otherCube.isSource = true
        source.createChild({x: 0, y: 1, z: 0}, flowMap)
        expect(otherCube.parents).to.deep.equal({})
      })
      it('when flowing into another cube, will not add that cube as a child', () => {
        otherCube.isSource = true
        source.createChild({x: 0, y: 1, z: 0}, flowMap)
        expect(source.children).to.not.have.property('0,1,0')
      })
    })
  })
  describe('_clonePosition', () => {
    let source
    let clone
    before(() => {
      source = new FlowCube(0, -62, 0, true, 4)
      clone = source._clonePosition()
    })
    it('creates a new object with same position', () => {
      expect(clone).to.deep.equal(source.position)
      expect(clone).to.not.equal(source.position)
    })
  })
  describe('_getAdjacentPositions', () => {
    let source
    let adjacentPositions
    before(() => {
      source = new FlowCube(0, -62, 0, true, {}, 4)
      adjacentPositions = source._getAdjacentPositions()
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
      source = new FlowCube(0, -62, 0, true, 2)
      flowMap = {'0,-62,0': source}
      source.spawnChildren(cubes, flowMap)
    })
    it('updates flowMap with correct values', () => {
      expect(Object.keys(flowMap)).to.have.lengthOf(10)
      expect(flowMap).to.have.property('0,-62,0')
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
  describe('removeChildren', () => {
    const cubes = {'0,-64,0': 'stuff'}
    let source
    let flowMap
    beforeEach(() => {
      source = new FlowCube(0, -62, 0, true, {}, 2)
      flowMap = {'0,-62,0': source}
      source.spawnChildren(cubes, flowMap)
      source.removeChildren(flowMap)
    })
    it('removes all children from this cube', () => {
      expect(source.children).to.deep.equal({})
    })
    it('updates the flowMap', () => {
      expect(flowMap).to.deep.equal({'0,-62,0': source})
    })
    it('does not delete a child if the child has other parents', () => {
      let otherSource = new FlowCube(0, -62, 1, true, {}, 1)
      source = new FlowCube(0, -62, 0, true, {}, 2)
      flowMap = {'0,-62,0': source, '0,-62,1': otherSource}
      source.spawnChildren(cubes, flowMap)
      otherSource.spawnChildren(cubes, flowMap)
      console.log(otherSource.children)
      source.removeChildren(flowMap)
      expect(otherSource.children).to.have.property('0,-63,1')
      expect(Object.keys(flowMap)).to.have.lengthOf(4)
      expect(flowMap).to.have.property('0,-62,0')
      expect(flowMap).to.have.property('0,-62,1')
      expect(flowMap).to.have.property('0,-63,1')
      expect(flowMap).to.have.property('0,-64,1')
    })
  })
})
