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
    it('does not make child a source', () => {
      expect(child.isSource).to.equal(false)
    })
    it('keeps its parent', () => {
      expect(child.parents).to.have.property('0,0,0')
    })
  })
  describe('spawnChildren', () => {
    const cubes = {'0,-63,0': 'stuff'}
    let source
    let flowMap
    before(() => {
      source = new FlowCube(0, -62, 0, true, {}, 4)
      flowMap = {'0,-62,0': source}
      source.spawnChildren(cubes, flowMap)
    })
    it('flows down if possible', () => {
      // expect(flowMap).to.have.property('0,0,0')
    })
    it('cannot go below y = -64', () => {
      expect()
    })
  })
})
