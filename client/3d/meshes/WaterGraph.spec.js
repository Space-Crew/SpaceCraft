import {expect} from 'chai'
import FlowGraph from './WaterGraph'
import sinon from 'sinon'

describe('FlowGraph', () => {
  xdescribe('spawnCubesFromSources', () => {})
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
  xdescribe('createObstacleAt', () => {
    it('updates worldCubes', () => {})
    it('does nothing if no cube there', () => {
      //how test this?
    })
    it('', () => {})
  })
  describe('triggerParents', () => {
    it('calls spawnChildren on each parent', () => {
      const sources = {
        '0,-64,0': {x: 0, y: -64, z: 0},
        '2,-64,0': {x: 2, y: -64, z: 0}
      }
      const graph = new FlowGraph(sources)
      const parents = graph.flowCubes['1,-64,0'].parents
      const spies = Object.values(parents).map(parent =>
        sinon.spy(parent, 'spawnChildren')
      )
      graph.triggerParents(parents)
      spies.forEach(spy => expect(spy.calledOnce).to.equal(true))
    })
  })
  xdescribe('destroy', () => {
    let sources
    let graph
    let removedCube
    let parent
    beforeEach(() => {
      sources = {
        '0,-64,0': {x: 0, y: -64, z: 0}
      }
      graph = new FlowGraph(sources)
      removedCube = graph.flowCubes['2,-64,0']
      parent = graph.flowCubes['1,-64,0']
    })
    it('asks for a remove from the graph', () => {
      const mySpy = sinon.spy(graph, 'removeFromGraph')
      graph.destroy(removedCube)
      expect(mySpy.calledWith(removedCube)).to.equal(true)
    })
    it('unlinks the cube from its parents', () => {
      expect(parent.children).to.not.have.property('2,-64,0')
    })
    it('destroys its children', () => {
      expect(graph.flowCubes).to.not.have.property('3,-64,0')
    })
  })
})
