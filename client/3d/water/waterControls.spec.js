import {expect} from 'chai'
import {initializeWaterControls} from './waterControls'
import {baseCubes, baseSources, oldWater} from '../../../testData/water'
import sinon from 'sinon'

describe('waterControls', () => {
  let mockScene
  beforeEach(() => {
    mockScene = initializeWaterControls(baseSources, baseCubes)
    mockScene.addWaterAt = sinon.stub().callsFake(() => 'blah')
    mockScene.removeWaterAt = sinon.stub().callsFake(() => 'blah')
  })
  describe('addAllWater', () => {
    it('calls add for each cube in the graph', () => {
      mockScene.addAllWater()
      expect(mockScene.addWaterAt.callCount).to.equal(
        Object.values(mockScene.waterGraph.flowCubes).length
      )
    })
  })
  describe('updateSceneWithDifferences', () => {
    it('works', () => {
      mockScene.updateSceneWithDifferences(oldWater.flowCubes)
      expect(mockScene.addWaterAt.callCount).to.equal(24)
      expect(mockScene.removeWaterAt.callCount).to.equal(1)
    })
  })
})
