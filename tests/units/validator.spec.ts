import validator from '../../src/utils/validator'

describe('yuumi-request validator', () => {
  describe('is', () => {
    it('null', () => {
      expect(validator.is(null, null)).toBe(true)
    })

    it('undefined', () => {
      expect(validator.is(undefined, undefined)).toBe(true)
    })

    it('string', () => {
      expect(validator.is('', String)).toBe(true)
      expect(validator.is(2, String)).toBe(false)
      expect(validator.is({}, String)).toBe(false)
      expect(validator.is([], String)).toBe(false)
    })

    it('number', () => {
      expect(validator.is(0, Number)).toBe(true)
      expect(validator.is(NaN, Number)).toBe(true)
      expect(validator.is({}, Number)).toBe(false)
      expect(validator.is([], Number)).toBe(false)
    })

    it('object', () => {
      expect(validator.is(0, Object)).toBe(false)
      expect(validator.is(NaN, Object)).toBe(false)
      expect(validator.is([], Object)).toBe(false)
      expect(validator.is({}, Object)).toBe(true)
      expect(validator.is(new Array(), Object)).toBe(false)
    })

    it('array', () => {
      expect(validator.is(0, Array)).toBe(false)
      expect(validator.is(NaN, Array)).toBe(false)
      expect(validator.is({}, Array)).toBe(false)
      expect(validator.is([], Array)).toBe(true)
      expect(validator.is(new Array(), Array)).toBe(true)
    })

    it('function', () => {
      expect(validator.is(0, Function)).toBe(false)
      expect(validator.is(NaN, Function)).toBe(false)
      expect(validator.is({}, Function)).toBe(false)
      expect(validator.is([], Function)).toBe(false)
      expect(validator.is(() => {}, Function)).toBe(true)
    })

    it('custom', () => {
      class Custom {}
      expect(validator.is(new Custom(), Custom)).toBe(true)
    })

    it('self', () => {
      expect(validator.is(1, 1)).toBe(true)
      expect(validator.is('string', 'string')).toBe(true)
      expect(validator.is(true, true)).toBe(true)
    })
  })

  describe('isEmpty', () => {
    it('期待返回 true', () => {
      expect(validator.isEmpty(null)).toBe(true)
      expect(validator.isEmpty(undefined)).toBe(true)
      expect(validator.isEmpty('')).toBe(true)
      expect(validator.isEmpty("")).toBe(true)
      expect(validator.isEmpty(NaN)).toBe(true)
      expect(validator.isEmpty(new Date('df'))).toBe(true)
      expect(validator.isEmpty([])).toBe(true)
    })

    it('期待返回 false', () => {
      expect(validator.isEmpty({})).toBe(false)
      expect(validator.isEmpty(new Date())).toBe(false)
      expect(validator.isEmpty(new Map())).toBe(false)
      expect(validator.isEmpty(new Set())).toBe(false)
    })
  })
})