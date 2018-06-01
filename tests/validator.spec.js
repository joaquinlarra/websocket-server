'use strict'

const createValidator = require('../lib/validator')

describe('Test Validator', () => {
  const validator = createValidator()
  it('Test validation error', () => {
    const badMessage = JSON.stringify({
      t : 2,
      x : 4,
    })
    const badMessage2 = JSON.stringify({
      kind : 'aoeighaoignaoingaeoigfnaeona',
      source : '__aarae9',
      moment : 'now',
    })
    const result = validator.validate(badMessage)
    expect(result.errors.length).toBeGreaterThan(0)
    const result2 = validator.validate(badMessage2)
    expect(result2.errors.length).toBeGreaterThan(0)
  })
  it('Test validation OK', () => {
    const goodMessage = JSON.stringify({
      kind : 'roll',
      source : '130cb69699bcb0df1174fbb1e0e9fc74',
      args : {},
      moment : '2018-06-01T10:02:21',
    })
    const result = validator.validate(goodMessage)
    expect(result.errors).toHaveLength(0)
  })
})
