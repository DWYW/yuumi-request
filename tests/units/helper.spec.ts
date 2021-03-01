import helper from '../../src/utils/helper'

describe('yuumi-request helper', () => {
  describe('params2string', () => {
    it('如果参数为空，期待返回空字符串', () => {
      expect(helper.params2string()).toBe('')
    })

    it('参数为非 Object 的参数，期待返回空字符串', () => {
      let arr: any = [1]
      expect(helper.params2string(arr)).toBe('')
      arr = new Set()
      expect(helper.params2string()).toBe('')
      arr = new Map()
      expect(helper.params2string()).toBe('')
    })

    it('参数为Object 的参数，期待返回字符', () => {
      const data: any = {
        test: 'test',
        num: 0,
        empty: null,
        empty1: undefined,
        nan: NaN
      }
      expect(helper.params2string(data)).toBe('test=test&num=0')
    })
  })
})