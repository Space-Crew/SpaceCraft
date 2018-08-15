import * as THREE from 'three'
import {expect} from 'chai'
import {makeUnitCube} from '../meshes'
import {addBlock} from './addBlock'

const scene = new THREE.Scene()
const objects = []
const newCube = makeUnitCube(new THREE.Vector3(1, 1, 1), 0xb9c4c0, 1)
const sceneBefore = scene.children.length
const objectsBefore = objects.length
addBlock(new THREE.Vector3(1, 1, 1), 0xb9c4c0, scene, objects)
const sceneAfter = scene.children.length
const objectsAfter = objects.length

describe('Adding a THREE Cube mesh object', () => {
  it('should have a defined BoxGeometry', () => {
    expect(newCube.geometry.type).to.be.equal('BoxGeometry')
  })
  it('should have a fixed geometry height, width, and depth of 1', () => {
    expect(newCube.scale.x).to.equal(1)
    expect(newCube.scale.y).to.equal(1)
    expect(newCube.scale.z).to.equal(1)
  })
  for (let x = 0; x < 2; x++) {
    for (let y = 0; y < 2; y++) {
      for (let z = 0; z < 2; z++) {
        let cube = makeUnitCube(new THREE.Vector3(x, y, z), 0xb9c4c0, 1)
        it('should have a position in 3D space', () => {
          expect(cube.position.x).to.be.equal(x)
          expect(cube.position.y).to.be.equal(y)
          expect(cube.position.z).to.be.equal(z)
        })
      }
    }
  }
  it('should have a material', () => {
    expect(newCube.material).to.not.be.equal(undefined)
  })

  it('should be added to the scene', () => {
    expect(sceneAfter).to.be.equal(sceneBefore + 1)
  })
  it('should be added to the global objects array for controls', () => {
    expect(objectsAfter).to.be.equal(objectsBefore + 1)
  })
})
