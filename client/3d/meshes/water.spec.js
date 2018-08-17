import {expect} from 'chai'
import {FlowCube} from './water'

describe('FlowCube', () => {
  describe('_createChild', () => {
    describe('simply', () => {
      let source
      let flowMap
      let child
      beforeEach(() => {
        source = new FlowCube(0, 0, 0, true)
        flowMap = {'0,0,0': source}
        child = source._createChild({x: 0, y: 0, z: 1}, flowMap)
      })
      it('sets child position', () => {
        expect(child.position).to.include({x: 0, y: 0, z: 1})
      })
      it('adds to flowMap', () => {
        expect(flowMap['0,0,1'].position).to.include({x: 0, y: 0, z: 1})
      })
      it('decreases the volume', () => {
        expect(child.volume).to.equal(3)
      })
      it('does not decrease volume if created downwards', () => {
        const childWithSameVolume = source._createChild(
          {x: 0, y: -1, z: 0},
          flowMap
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
    describe('modifies parent/children during collision and the source', () => {
      let source
      let otherSource
      let flowMap
      let otherCube
      beforeEach(() => {
        source = new FlowCube(0, 0, 0, true)
        otherSource = new FlowCube(1, 1, 0, true)
        flowMap = {'0,0,0': source, '0,1,0': otherCube}
        otherCube = otherSource._createChild({x: 0, y: 1, z: 0}, flowMap)
      })
      it('will become a parent of a cube if that cube is not a source', () => {
        source._createChild({x: 0, y: 1, z: 0}, flowMap)
        expect(otherCube.parents['0,0,0']).to.equal(source)
      })
      it('will add that cube as its child', () => {
        source._createChild({x: 0, y: 1, z: 0}, flowMap)
        expect(source.children['0,1,0']).to.equal(otherCube)
      })
      it('will become an additional parent of a cube if that cube has another parent', () => {
        source._createChild({x: 0, y: 1, z: 0}, flowMap)
        expect(otherCube.parents).to.have.property('0,0,0', source)
        expect(otherCube.parents).to.have.property('1,1,0', otherSource)
      })
      it('will not become a parent of that cube if that cube is a source', () => {
        source._createChild({x: 1, y: 1, z: 0}, flowMap)
        expect(otherSource.parents).to.deep.equal({})
      })
      it('will not add that cube as a child', () => {
        otherCube.isSource = true
        source._createChild({x: 0, y: 1, z: 0}, flowMap)
        expect(source.children).to.not.have.property('0,1,0')
      })
      afterEach(() => {
        source = undefined
        otherSource = undefined
        flowMap = undefined
        otherCube = undefined
      })
    })
  })
  describe('_clonePosition', () => {
    let source
    let clone
    before(() => {
      source = new FlowCube(0, -62, 0, true)
      clone = source._clonePosition()
    })
    it('creates a new object with same position', () => {
      expect(clone).to.deep.equal(source.position)
      expect(clone).to.not.equal(source.position)
    })
  })
  describe('_adjacentPositions', () => {
    let source
    let adjacentPositions
    before(() => {
      source = new FlowCube(0, -62, 0, true)
      adjacentPositions = source._adjacentPositions
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
      source = new FlowCube(0, -62, 0, true)
      flowMap = {'0,-62,0': source}
      source.spawnChildren(cubes, flowMap)
    })
    it('updates flowMap with correct values', () => {
      const waterPositions = [
        '0,-62,0',
        '0,-63,0',
        '0,-63,1',
        '1,-63,0',
        '0,-63,-1',
        '-1,-63,0',
        '0,-64,1',
        '0,-64,2',
        '1,-64,1',
        '-1,-64,1',
        '0,-64,3',
        '1,-64,2',
        '-1,-64,2',
        '2,-64,1',
        '1,-64,0',
        '-1,-64,0',
        '-2,-64,1',
        '0,-64,-1',
        '1,-64,-1',
        '0,-64,-2',
        '-1,-64,-1',
        '2,-64,-1',
        '1,-64,-2',
        '0,-64,-3',
        '-1,-64,-2',
        '-2,-64,-1',
        '-2,-64,0',
        '-1,-64,0',
        '1,-64,0',
        '2,-64,0'
      ]
      expect(flowMap).to.have.all.keys(...waterPositions)
    })
  })
  xdescribe('removeChildren', () => {
    describe('simply', () => {
      const cubes = {'0,-64,0': 'stuff'}
      let source
      let flowMap
      beforeEach(() => {
        source = new FlowCube(0, -62, 0, true, 2)
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
    })
    it('does not delete a child if the child has other parents', () => {
      const cubes = {'0,-64,0': 'stuff'}
      const otherSource = new FlowCube(0, -62, 1, true, 1)
      const source = new FlowCube(0, -62, 0, true, 2)
      const flowMap = {'0,-62,0': source, '0,-62,1': otherSource}

      source.spawnChildren(cubes, flowMap)
      otherSource.spawnChildren(cubes, flowMap)
      expect(otherSource.children).to.have.property('0,-63,1')

      source.removeChildren(flowMap)
      expect(Object.keys(flowMap)).to.have.lengthOf(4)
      expect(flowMap).to.have.property('0,-62,0')
      expect(flowMap).to.have.property('0,-62,1')
      expect(flowMap).to.have.property('0,-63,1')
      expect(flowMap).to.have.property('0,-64,1')
    })
  })
  describe('_up', () => {
    const source = new FlowCube(0, -62, 0, true)
    it('returns the position above this one', () => {
      expect(source._up).to.deep.equal({x: 0, y: -61, z: 0})
    })
  })
  describe('_down', () => {
    const source = new FlowCube(0, -62, 0, true)
    it('returns the position below this one', () => {
      expect(source._down).to.deep.equal({x: 0, y: -63, z: 0})
    })
  })
  describe('_maxVolumeOfParents', () => {
    const source1 = new FlowCube(0, -62, 0, true)
    const source2 = new FlowCube(0, -64, -3, true)
    const flowMap = {'0,-62,0': source1, '0,-64,-3': source2}

    source2
      ._createChild({x: 0, y: -64, z: -2}, flowMap)
      ._createChild({x: 0, y: -64, z: -1}, flowMap)
      ._createChild({x: 0, y: -64, z: 0}, flowMap)
    source1
      ._createChild({x: 0, y: -63, z: 0}, flowMap)
      ._createChild({x: 0, y: -64, z: 0}, flowMap)
    it('works', () => {
      expect(flowMap['0,-64,0']._maxVolumeOfParents).to.equal(4)
    })
  })
  describe('_hasVolumeToFlow', () => {
    const source = new FlowCube(0, -64, 0, true)
    const flowMap = {'0,-64,0': source}

    source
      ._createChild({x: 0, y: -64, z: -1}, flowMap)
      ._createChild({x: 0, y: -64, z: -2}, flowMap)
      ._createChild({x: 0, y: -64, z: -3}, flowMap)
      ._createChild({x: 0, y: -64, z: -4}, flowMap)

    it('works', () => {
      expect(flowMap['0,-64,-3'].volume).to.equal(1)
      expect(flowMap['0,-64,-3']._hasVolumeToFlow()).to.equal(false)
      expect(flowMap).to.not.have.property('0,-64,-4')
    })
  })
})
