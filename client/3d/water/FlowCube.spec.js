import {expect} from 'chai'
import {FlowCube} from './FlowCube'

describe('FlowCube', () => {
  /*************
   * Volume
   *************/
  describe('maxVolumeOfParents', () => {
    const source1 = new FlowCube({x: 0, y: 0, z: 3}, true)
    const source2 = new FlowCube({x: 0, y: 2, z: 0}, true)

    const child = source1
      .createChildAt({x: 0, y: 0, z: 2})
      .createChildAt({x: 0, y: 0, z: 1})
      .createChildAt({x: 0, y: 0, z: 0})
    source2.createChildAt({x: 0, y: 1, z: 0}).linkChild(child)
    it('works', () => {
      expect(child.maxVolumeOfParents).to.equal(4)
    })
  })
  describe('volume and findVolumeBasedOnParents and hasVolumeToFlowTo', () => {
    it('works horizontally', () => {
      const source = new FlowCube({x: 0, y: -64, z: 0}, true)
      const child = source
        .createChildAt({x: 0, y: -64, z: -1})
        .createChildAt({x: 0, y: -64, z: -2})
        .createChildAt({x: 0, y: -64, z: -3})
      expect(child.volume).to.equal(1)
      expect(child.hasVolumeToFlowTo({x: 0, y: -64, z: -4})).to.equal(false)
    })
    it('works vertically', () => {
      const source = new FlowCube({x: 0, y: -63, z: 0}, true)
      const child = source
        .createChildAt({x: 0, y: -63, z: -1})
        .createChildAt({x: 0, y: -63, z: -2})
        .createChildAt({x: 0, y: -63, z: -3})
      expect(child.hasVolumeToFlowTo({x: 0, y: -64, z: -3})).to.equal(true)
      const child2 = source.createChildAt({x: 0, y: -64, z: 0})
      expect(child2.volume).to.equal(4)
    })
  })
  /*****************
   * Public methods
   *****************/
  describe('createChildAt and linkChild', () => {
    let source
    let child
    beforeEach(() => {
      source = new FlowCube({x: 0, y: 0, z: 0}, true)
      child = source.createChildAt({x: 0, y: 0, z: 1})
    })
    it('sets child position', () => {
      expect(child.position).to.include({x: 0, y: 0, z: 1})
    })
    it('does not make child a source', () => {
      expect(child.isSource).to.equal(false)
    })
    it('keeps its parent', () => {
      expect(child.parents).to.have.property('0,0,0')
    })
  })
  describe('linkChild', () => {
    let source
    let child
    let otherSource
    beforeEach(() => {
      source = new FlowCube({x: 0, y: 0, z: 0}, true)
      otherSource = new FlowCube({x: 0, y: 1, z: 2}, true)
      child = source
        .createChildAt({x: 0, y: 0, z: 1})
        .createChildAt({x: 0, y: 0, z: 2})
    })
    it('resets the volume of the child', () => {
      let targetVolume = source.volume - 2
      expect(child.volume).to.equal(targetVolume)
      otherSource.linkChild(child)
      expect(child.volume).to.equal(otherSource.volume)
    })
  })
  describe('unlinkChild', () => {
    let source
    let child
    beforeEach(() => {
      source = new FlowCube({x: 0, y: 0, z: 0}, true)
      child = source.createChildAt({x: 1, y: 0, z: 0})
      source.unlinkChild(child)
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
    let parent1
    let parent2
    beforeEach(() => {
      parent1 = new FlowCube({x: 0, y: 0, z: 0})
      parent2 = new FlowCube({x: 1, y: 1, z: 0})
      child = new FlowCube({x: 1, y: 0, z: 0})
      parent1.linkChild(child)
      parent2.linkChild(child)
      expect(parent1.children).to.have.property('1,0,0')
      expect(parent2.children).to.have.property('1,0,0')
    })
    it('unlinks the cube from its parents', () => {
      child.unlinkParents()
      expect(parent1.children).to.not.have.property('1,0,0')
      expect(parent2.children).to.not.have.property('1,0,0')
    })
  })
  describe('up', () => {
    const source = new FlowCube({x: 0, y: -62, z: 0}, true)
    it('returns the position above this one', () => {
      expect(source.up).to.deep.equal({x: 0, y: -61, z: 0})
    })
  })
  describe('neighbors', () => {
    let source
    let neighbors
    before(() => {
      source = new FlowCube({x: 0, y: -62, z: 0}, true)
      neighbors = source.neighbors
    })
    it('gets adjacent positions on the xy plane', () => {
      expect(neighbors).to.deep.equal([
        {x: 0, y: -62, z: 1},
        {x: 1, y: -62, z: 0},
        {x: 0, y: -62, z: -1},
        {x: -1, y: -62, z: 0},
        {x: 0, y: -63, z: 0}
      ])
    })
  })
  /*****************
   * Private methods
   *****************/
  describe('down', () => {
    const source = new FlowCube({x: 0, y: -62, z: 0}, true)
    it('returns the position below this one', () => {
      expect(source.down).to.deep.equal({x: 0, y: -63, z: 0})
    })
  })
  describe('clonePosition', () => {
    let source
    let clone
    before(() => {
      source = new FlowCube({x: 0, y: -62, z: 0}, true)
      clone = source.clonePosition()
    })
    it('creates a new object with same position', () => {
      expect(clone).to.deep.equal(source.position)
      expect(clone).to.not.equal(source.position)
    })
  })
  describe('flatNeighbors', () => {
    let source
    let flatNeighbors
    before(() => {
      source = new FlowCube({x: 0, y: -62, z: 0}, true)
      flatNeighbors = source.flatNeighbors
    })
    it('gets adjacent positions on the xy plane', () => {
      expect(flatNeighbors).to.deep.equal([
        {x: 0, y: -62, z: 1},
        {x: 1, y: -62, z: 0},
        {x: 0, y: -62, z: -1},
        {x: -1, y: -62, z: 0}
      ])
    })
  })
  describe('isFlowingDown', () => {
    let source
    let childDown
    let childSide
    before(() => {
      source = new FlowCube({x: 0, y: 0, z: 0}, true)
      childDown = source.createChildAt({x: 0, y: -1, z: 0})
      childSide = new FlowCube({x: 20, y: 0, z: 0})
    })
    it('returns true if parent is above', () => {
      expect(childDown.isFlowingDown()).to.be.true
    })
    it('returns false if parent is not above', () => {
      expect(childSide.isFlowingDown()).to.be.false
    })
  })
  describe('becameBigger', () => {
    let otherCube
    let source
    let child
    beforeEach(() => {
      source = new FlowCube({x: 0, y: -64, z: 0}, true)
      child = source
        .createChildAt({x: 1, y: -64, z: 0})
        .createChildAt({x: 2, y: -64, z: 0})
        .createChildAt({x: 3, y: -64, z: 0})
      otherCube = new FlowCube({x: 0, y: -64, z: 0}, true)
    })
    it('returns true if does', () => {
      const oldVolume = child.volume
      otherCube.linkChild(child)
      expect(child.becameBigger(oldVolume)).to.be.true
    })
    it("returns false if doesn't", () => {
      const oldVolume = otherCube.volume
      child.linkChild(otherCube)
      expect(otherCube.becameBigger(oldVolume)).to.be.false
    })
  })
})
