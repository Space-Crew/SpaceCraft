const Sequelize = require('sequelize')
const db = require('../db')

const World = db.define('world', {
  blocks: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

module.exports = World
