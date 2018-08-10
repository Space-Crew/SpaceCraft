const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const db = require('../db')
const World = require('./world')
const {giantWorld} = require('../../../testData/world')

describe('World model', () => {
  beforeEach(async () => {
    //set up database
    await db.sync({force: true})
  })
  it('has a blocks property that can hold giant strings', async () => {
    const world = await World.create({blocks: giantWorld})
    expect(world.blocks).to.equal(giantWorld)
  })
  it('blocks property is required', () => {
    expect(World.create({})).to.rejectedWith('notNull Violation')
  })
})
