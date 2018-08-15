const {expect} = require('chai')
const THREE = require('three')
const {deleteBlock} = require('./deleteBlock')
const position = new THREE.Vector3(1, 6, 9)
const color = 0x4286f4
const scene = new THREE.Scene()
let objects = []
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial({
  color
})
const block = new THREE.Mesh(geometry, material)
block.position.copy(position)
describe('Delete Block', () => {
  it('scene has a key called children and type array', () => {
    expect(scene).to.have.property('children')
    expect(scene.children).to.be.an('array')
    expect(scene.children.length).to.equal(0)
  })
  it('Adding a block to scene increases the number of children', () => {
    scene.add(block)
    objects.push(block)
    expect(scene.children.length).to.equal(1)
    expect(scene.children[0]).to.equal(block)
    expect(scene.children[0].uuid).to.equal(block.uuid)
    expect(block.position.x).to.equal(position.x)
    expect(block.position.y).to.equal(position.y)
    expect(block.position.z).to.equal(position.z)
  })
  describe('deleteBlock(block,scene,objects)', () => {
    it('removes the block from the scene', () => {
      objects = deleteBlock(block, scene, objects)
      expect(scene.children.length).to.equal(0)
    })
    it('returns an array with the block filtered out', () => {
      expect(objects.length).to.equal(0)
    })
    it('works with multiple blocks', () => {
      const block2 = new THREE.Mesh(geometry, material)
      const block3 = new THREE.Mesh(geometry, material)
      scene.add(block2)
      objects.push(block2)
      scene.add(block3)
      objects.push(block3)
      objects = deleteBlock(block2, scene, objects)
      expect(scene.children.includes(block2)).to.equal(false)
      expect(scene.children.includes(block3)).to.equal(true)
      expect(objects.includes(block2)).to.equal(false)
      expect(objects.includes(block3)).to.equal(true)
      objects = deleteBlock(block3, scene, objects)
      expect(scene.children.includes(block2)).to.equal(false)
      expect(scene.children.includes(block3)).to.equal(false)
      expect(objects.includes(block2)).to.equal(false)
      expect(objects.includes(block3)).to.equal(false)
    })
  })
})
