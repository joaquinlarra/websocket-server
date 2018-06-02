'use strict'

const validator = require('../lib/validator')

const basicSchema = {
  type : 'object',
  properties : {
    kind : {
      type : 'string',
      maxLength : 10,
      minLength : 2,
    },
    source : {
      type : 'string',
      pattern : /^\w{32}$/,
    },
    moment : {
      type : 'string',
      pattern : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    },
  },
  required : ['kind', 'source', 'moment'],
}

describe('Test Validator', () => {
  it('Test validation error', () => {
    const badMessage = {
      t : 2,
      x : 4,
    }
    const badMessage2 = {
      kind : 'aoeighaoignaoingaeoigfnaeona',
      source : '__aarae9',
      moment : 'now',
    }
    const result = validator.validate(badMessage, basicSchema)
    expect(result.errors.length).toBeGreaterThan(0)
    const result2 = validator.validate(badMessage2, basicSchema)
    expect(result2.errors.length).toBeGreaterThan(0)
  })
  it('Test validation OK', () => {
    const goodMessage = {
      kind : 'roll',
      source : '130cb69699bcb0df1174fbb1e0e9fc74',
      args : {},
      moment : '2018-06-01T10:02:21',
    }
    const result = validator.validate(goodMessage, basicSchema)
    expect(result.errors).toHaveLength(0)
  })
})
