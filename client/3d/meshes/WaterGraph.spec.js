import {expect} from 'chai'
import FlowGraph from './WaterGraph'
import sinon from 'sinon'

describe('FlowGraph', () => {
  xdescribe('spawnCubesFromSources', () => {})
  describe('makeSourceAt', () => {
    let graph
    beforeEach(() => {
      graph = new FlowGraph()
    })
    it('creates a new source', () => {
      graph.makeSourceAt({x: 0, y: -64, z: 0})
      expect(graph.sourcePositions).to.have.property('0,-64,0')
      expect(graph.flowCubes).to.have.property('0,-64,0')
    })
  })
  describe('findSpacesToFlowFor', () => {
    let graph
    beforeEach(() => {
      graph = new FlowGraph()
    })
    it('works', () => {})
  })
  describe(`spawnSourceAt`, () => {
    let graph
    beforeEach(() => {
      graph = new FlowGraph()
    })
    it('spawns children for the new source', () => {
      // const mySpy = sinon.spy(source, 'spawnChildren') // can't do because source doesn't exist
      graph.spawnSourceAt({x: 0, y: -64, z: 0})
      expect(Object.values(graph.flowCubes).length).to.be.above(1)
    })
  })
  describe('createObstacleAt', () => {
    let sources
    let graph
    let position
    beforeEach(() => {
      sources = {
        '0,-64,0': {x: 0, y: -64, z: 0},
        '2,-64,0': {x: 2, y: -64, z: 0}
      }
      graph = new FlowGraph(sources)
      position = {x: 1, y: -64, z: 0}
    })
    it('does not change flowcubes or source if no flow cube there', () => {
      const originalFlowCubesLength = Object.values(graph.flowCubes).length
      const originalSourcesLength = Object.values(graph.sourcePositions).length
      const farAwayPosition = {x: 2, y: 0, z: 0}
      graph.createObstacleAt(farAwayPosition)
      expect(Object.values(graph.flowCubes)).to.have.lengthOf(
        originalFlowCubesLength
      )
      expect(Object.values(graph.sourcePositions)).to.have.lengthOf(
        originalSourcesLength
      )
    })
    it('updates worldCubes', () => {
      graph.createObstacleAt(position)
      expect(graph.worldCubes).to.have.property('1,-64,0')
    })
    it('calls destroyLineage on the cube', () => {
      const mySpy = sinon.spy(graph, 'destroyLineage')
      const flowCubeAtPosition = graph.flowCubes['1,-64,0']
      graph.createObstacleAt(position)
      expect(mySpy.calledWith(flowCubeAtPosition)).to.be.true
    })
    it('triggers a respawn in parents', () => {
      const mySpy = sinon.spy(graph, 'makeCubesRespawn')
      const parents = graph.flowCubes['1,-64,0'].parents
      graph.createObstacleAt(position)
      expect(mySpy.calledWith(...Object.values(parents))).to.be.true
    })
  })
  describe('makeCubesRespawn', () => {
    it('calls spawnChildrenFor on each parent', () => {
      const sources = {
        '0,-64,0': {x: 0, y: -64, z: 0},
        '2,-64,0': {x: 2, y: -64, z: 0}
      }
      const graph = new FlowGraph(sources)
      const parents = graph.flowCubes['1,-64,0'].parents
      const spy = sinon.spy(graph, 'spawnChildrenFor')
      graph.makeCubesRespawn(parents)
      Object.values(parents).forEach(
        parent => expect(spy.calledWith(parent)).to.be.true
      )

      // expect(spy.callCount).to.equal(Object.keys(parents).length)
    })
  })
  describe('destroyLineage', () => {
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
      graph.destroyLineage(removedCube)
      expect(mySpy.calledWith(removedCube)).to.equal(true)
    })
    it('unlinks the cube from its parents', () => {
      graph.destroyLineage(removedCube)
      expect(parent.children).to.not.have.property('2,-64,0')
    })
    it('destroys its children', () => {
      graph.destroyLineage(removedCube)
      expect(graph.flowCubes).to.not.have.property('3,-64,0')
    })
  })
  describe('removeFromGraph', () => {
    let sources
    let source
    let graph
    let cube
    beforeEach(() => {
      sources = {
        '0,-64,0': {x: 0, y: -64, z: 0}
      }
      graph = new FlowGraph(sources)
      cube = graph.flowCubes['2,-64,0']
      source = graph.flowCubes['0,-64,0']
    })
    it('removes the cube from the flowCubes property', () => {
      graph.removeFromGraph(cube)
      expect(graph.flowCubes).to.not.have.property('2,-64,0')
    })
    it('removes the source from the flowCubes and the sources', () => {
      graph.removeFromGraph(source)
      expect(graph.flowCubes).to.not.have.property('0,-64,0')
      expect(graph.sourcePositions).to.not.have.property('0,-64,0')
    })
  })
  describe('spawnChildrenFor', () => {
    const cubes = {'0,-64,0': 'stuff'}
    let graph
    let source
    before(() => {
      graph = new FlowGraph({}, cubes)
      graph.spawnSourceAt({x: 0, y: -62, z: 0})
      source = graph.flowCubes['0,-62,0']
    })
    it('creates the flow cubes properly', () => {
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
      expect(graph.flowCubes).to.have.all.keys(...waterPositions)
      graph.spawnChildrenFor(source)
      expect(graph.flowCubes).to.have.all.keys(...waterPositions)
    })
  })
})
