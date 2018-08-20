import {expect} from 'chai'
import {FlowGraph} from './WaterGraph'
import sinon from 'sinon'
import {FlowCube} from './water'

describe('FlowGraph', () => {
  xdescribe('spawnCubesFromSources', () => {})
  describe('makeSourceAt', () => {
    let graph
    beforeEach(() => {
      graph = new FlowGraph()
      graph.spawnCubesFromSourcePositions()
    })
    it('creates a new source', () => {
      graph.makeSourceAt({x: 0, y: -64, z: 0})
      expect(graph.sourcePositions).to.have.property('0,-64,0')
      expect(graph.flowCubes).to.have.property('0,-64,0')
    })
  })
  xdescribe('findSpacesToFlowFor', () => {
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
      graph.spawnCubesFromSourcePositions()
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
      graph.spawnCubesFromSourcePositions()
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
    it('triggers a respawn in parents', () => {
      const mySpy = sinon.spy(graph, 'makeCubesRespawn')
      const parents = graph.flowCubes['1,-64,0'].parents
      graph.createObstacleAt(position)
      expect(mySpy.calledWith(...Object.values(parents))).to.be.true
    })
  })
  describe('makeCubesRespawn', () => {
    it('calls spawnLineageFor on each parent', () => {
      const sources = {
        '0,-64,0': {x: 0, y: -64, z: 0},
        '2,-64,0': {x: 2, y: -64, z: 0}
      }
      const graph = new FlowGraph(sources)
      graph.spawnCubesFromSourcePositions()
      const parents = graph.flowCubes['1,-64,0'].parents
      const spy = sinon.spy(graph, 'spawnLineageFor')
      graph.makeCubesRespawn(parents)
      Object.values(parents).forEach(
        parent => expect(spy.calledWith(parent)).to.be.true
      )

      // expect(spy.callCount).to.equal(Object.keys(parents).length)
    })
  })
  describe('destroyCubeAndLineage', () => {
    let sources
    let graph
    let removedCube
    let parent
    beforeEach(() => {
      sources = {
        '0,-64,0': {x: 0, y: -64, z: 0}
      }
      graph = new FlowGraph(sources)
      graph.spawnCubesFromSourcePositions()
      removedCube = graph.flowCubes['2,-64,0']
      parent = graph.flowCubes['1,-64,0']
    })
    it('asks for a remove from the graph', () => {
      const mySpy = sinon.spy(graph, 'removeFromGraph')
      graph.destroyCubeAndLineage(removedCube)
      expect(mySpy.calledWith(removedCube)).to.equal(true)
    })
    it('unlinks the cube from its parents', () => {
      graph.destroyCubeAndLineage(removedCube)
      expect(parent.children).to.not.have.property('2,-64,0')
    })
    it('destroys its children by calling destoryLineage', () => {
      const mySpy = sinon.spy(graph, 'destroyLineage')
      graph.destroyCubeAndLineage(removedCube)
      expect(mySpy.called).to.be.true
    })
    it('destoryLineage works', () => {
      graph.destroyLineage(removedCube)
      expect(graph.flowCubes).to.have.property('2,-64,0')
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
      graph.spawnCubesFromSourcePositions()
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
  describe('spawnLineageFor', () => {
    const cubes = {'0,-64,0': 'stuff'}
    let graph
    let source
    before(() => {
      graph = new FlowGraph({}, cubes)
      graph.spawnCubesFromSourcePositions()
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
      graph.spawnLineageFor(source)
      expect(graph.flowCubes).to.have.all.keys(...waterPositions)
    })
  })
  describe('deleteWorldCubeAt', () => {
    let worldCubes
    let sources
    let graph
    let position
    beforeEach(() => {
      worldCubes = {'2,-64,0': true}
      position = {x: 2, y: -64, z: 0}
      sources = {
        '0,-64,0': {x: 0, y: -64, z: 0}
      }
      graph = new FlowGraph(sources, worldCubes)
      graph.spawnCubesFromSourcePositions()
    })
    it('updates worldCubes', () => {
      graph.deleteWorldCubeAt(position)
      expect(graph.worldCubes).to.not.have.property('2,-64,0')
    })
    it('tries to make parents flow horizontally', () => {
      graph.deleteWorldCubeAt(position)
      expect(graph.flowCubes).to.have.property('2,-64,0')
      expect(graph.flowCubes).to.have.property('3,-64,0')
    })
    it('tries to make parents flow vertically and overwrites prior horizontal flow', () => {
      worldCubes = {'0,0,0': true}
      sources = {
        '0,1,0': {x: 0, y: 1, z: 0}
      }
      graph = new FlowGraph(sources, worldCubes)
      graph.spawnCubesFromSourcePositions()
      expect(graph.flowCubes).to.have.property('1,1,0')
      position = {x: 0, y: 0, z: 0}
      graph.deleteWorldCubeAt(position)
      expect(graph.flowCubes).to.not.have.property('1,1,0')
    })
  })
  describe('spawnNextGeneration', () => {
    it('works', () => {
      let generation = [
        new FlowCube({x: 0, y: 0, z: 0}, true),
        new FlowCube({x: 20, y: 0, z: 0}, true)
      ]
      let graph = new FlowGraph()
      let nextGeneration = graph.spawnNextGeneration(generation)
      expect(nextGeneration).to.be.an('array')
      expect(nextGeneration).to.have.lengthOf(2)
    })
  })
  describe('destroyCubes', () => {
    let cubes
    let graph
    beforeEach(() => {
      const sources = {
        '0,-64,0': {x: 0, y: -64, z: 0}
      }
      graph = new FlowGraph(sources)
      graph.spawnCubesFromSourcePositions()
      cubes = [graph.flowCubes['0,-64,0'], graph.flowCubes['1,-64,0']]
    })
    it('works', () => {
      graph.destroyCubes(cubes)
      expect(graph.flowCubes).to.not.have.property('0,-64,0')
      expect(graph.flowCubes).to.not.have.property('1,-64,0')
    })
  })
  describe('getNextGeneration', () => {
    let generation
    let graph
    beforeEach(() => {
      const sources = {
        '0,-64,0': {x: 0, y: -64, z: 0}
      }
      graph = new FlowGraph(sources)
      graph.spawnCubesFromSourcePositions()
      generation = [graph.flowCubes['0,-64,0']]
    })
    it('works', () => {
      const nextGeneration = graph.getNextGeneration(generation)
      Object.values(generation[0].children).forEach(child => {
        expect(nextGeneration).to.include(child)
      })
    })
  })
  describe('determineIfShouldRespawn', () => {
    let source
    let graph
    let child
    beforeEach(() => {
      const sources = {
        '0,-64,0': {x: 0, y: -64, z: 0}
      }
      graph = new FlowGraph(sources)
      graph.spawnCubesFromSourcePositions()
      child = graph.flowCubes['3,-64,0']
      source = graph.makeSourceAt({x: 3, y: -63, z: 0})
    })
    it('returns true if does', () => {
      source.linkChild(child)
      expect(graph.determineIfShouldRespawn(child)).to.be.true
    })
    it("returns false if doesn't", () => {})
  })
})
