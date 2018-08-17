import {expect} from 'chai'
import FlowGraph from './WaterGraph'

describe('FlowGraph', () => {
  describe('spawnCubesFromSources', () => {})
  describe('addSourceAt', () => {
    let graph
    beforeEach(() => {
      graph = new FlowGraph()
      graph.addSourceAt({x: 0, y: -64, z: 0})
    })
    it('works', () => {
      expect(graph.sources).to.have.property('0,-64,0')
    })
    xit('spawns children for the new source', () => {
      //spy that spawnChildren gets called for the new source ?
    })
  })
})
