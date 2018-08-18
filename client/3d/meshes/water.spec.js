import {expect} from 'chai'
import FlowCube from './water'

describe('FlowCube', () => {
  describe('_createChild', () => {
    describe('simply', () => {
      let source
      let flowMap
      let child
      beforeEach(() => {
        source = new FlowCube({x: 0, y: 0, z: 0}, true)
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
        source = new FlowCube({x: 0, y: 0, z: 0}, true)
        otherSource = new FlowCube({x: 1, y: 1, z: 0}, true)
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
      source = new FlowCube({x: 0, y: -62, z: 0}, true)
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
      source = new FlowCube({x: 0, y: -62, z: 0}, true)
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
      source = new FlowCube({x: 0, y: -62, z: 0}, true)
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
      source.spawnChildren(cubes, flowMap)
      expect(flowMap).to.have.all.keys(...waterPositions)
    })
  })
  describe('_up', () => {
    const source = new FlowCube({x: 0, y: -62, z: 0}, true)
    it('returns the position above this one', () => {
      expect(source._up).to.deep.equal({x: 0, y: -61, z: 0})
    })
  })
  describe('_down', () => {
    const source = new FlowCube({x: 0, y: -62, z: 0}, true)
    it('returns the position below this one', () => {
      expect(source._down).to.deep.equal({x: 0, y: -63, z: 0})
    })
  })
  describe('_maxVolumeOfParents', () => {
    const source1 = new FlowCube({x: 0, y: -62, z: 0}, true)
    const source2 = new FlowCube({x: 0, y: -64, z: -3}, true)
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
    it('works horizontally', () => {
      const source = new FlowCube(0, -64, 0, true)
      const flowMap = {'0,-64,0': source}

      source
        ._createChild({x: 0, y: -64, z: -1}, flowMap)
        ._createChild({x: 0, y: -64, z: -2}, flowMap)
        ._createChild({x: 0, y: -64, z: -3}, flowMap)
        ._createChild({x: 0, y: -64, z: -4}, flowMap)
      expect(flowMap['0,-64,-3'].volume).to.equal(1)
      expect(
        flowMap['0,-64,-3']._hasVolumeToFlow({x: 0, y: -64, z: -4})
      ).to.equal(false)
      expect(flowMap).to.not.have.property('0,-64,-4')
    })
    it('works vertically', () => {
      const source = new FlowCube(0, -63, 0, true)
      const flowMap = {'0,-63,0': source}

      source
        ._createChild({x: 0, y: -63, z: -1}, flowMap)
        ._createChild({x: 0, y: -63, z: -2}, flowMap)
        ._createChild({x: 0, y: -63, z: -3}, flowMap)
      expect(flowMap['0,-63,-3'].volume).to.equal(1)
      expect(
        flowMap['0,-63,-3']._hasVolumeToFlow({x: 0, y: -64, z: -3})
      ).to.equal(true)
    })
  })
  describe('_parentWithBiggestVolume', () => {
    let source1
    let source2
    let flowMap
    beforeEach(() => {
      source1 = new FlowCube({x: 0, y: -64, z: 1}, true)
      source2 = new FlowCube({x: 0, y: -63, z: -1}, true)
      flowMap = {'0,-64,1': source1, '0,-63,-1': source2}
    })
    it('returns null if no parents', () => {
      expect(source1._parentWithBiggestVolume).to.equal(null)
    })

    it('works for one parent', () => {
      source2._createChild({x: 0, y: -64, z: -1}, flowMap)
      expect(flowMap['0,-64,-1']._parentWithBiggestVolume).to.equal(source2)
    })
    it('works for multiple parents', () => {
      source1
        ._createChild({x: 0, y: -64, z: 0}, flowMap)
        ._createChild({x: 0, y: -64, z: -1}, flowMap)
      source2._createChild({x: 0, y: -64, z: -1}, flowMap)
      expect(flowMap['0,-64,-1']._parentWithBiggestVolume).to.equal(source2)
    })
    afterEach(() => {
      source1 = undefined
      source2 = undefined
      flowMap = undefined
    })
  })
  describe('_unlinkChild', () => {
    let source
    let flowMap
    let child
    beforeEach(() => {
      source = new FlowCube({x: 0, y: 0, z: 0}, true)
      flowMap = {'0,0,0': source}
      child = source._createChild({x: 0, y: 0, z: 1}, flowMap)
      source._unlinkChild(child)
    })
    it('removes the child form the parent', () => {
      expect(source.children).to.be.empty
    })
    it('removes the parent form the child', () => {
      expect(child.parents).to.be.empty
    })
  })
  describe('unlinkParents', () => {
    let child
    let parent
    beforeEach(() => {
      parent = new FlowCube({x: 0, y: 0, z: 0})
      child = new FlowCube({x: 1, y: 0, z: 0})
      parent._linkChild(child)
      expect(parent.children).to.have.property('1,0,0')
    })
    it('unlinks the cube from its parents', () => {
      child.unlinkParents()
      expect(parent.children).to.not.have.property('1,0,0')
    })
  })
})
