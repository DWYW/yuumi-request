import * as utils from '../../src/core/utils'

describe('yuumi-request utils', () => {
  describe('validate', () => {
    it('isUndefine', () => {
      expect(utils.isUndefine(null)).toBe(true)
      expect(utils.isUndefine(undefined)).toBe(true)
      expect(utils.isUndefine("")).toBe(false)
      expect(utils.isUndefine({})).toBe(false)
    })

    it('isDefine', () => {
      expect(utils.isDefine(null)).toBe(false)
      expect(utils.isDefine(undefined)).toBe(false)
      expect(utils.isDefine("")).toBe(true)
      expect(utils.isDefine({})).toBe(true)
    })

    it('isString', () => {
      expect(utils.isString("")).toBe(true)
      expect(utils.isString({})).toBe(false)
    })

    it('isBoolean', () => {
      expect(utils.isBoolean(true)).toBe(true)
      expect(utils.isBoolean(false)).toBe(true)
      expect(utils.isBoolean({})).toBe(false)
    })

    it('isNumber', () => {
      expect(utils.isNumber(1)).toBe(true)
      expect(utils.isNumber(NaN)).toBe(true)
      expect(utils.isNumber({})).toBe(false)
    })

    it('isNaN', () => {
      expect(utils.isNaN(1)).toBe(false)
      expect(utils.isNaN(NaN)).toBe(true)
      expect(utils.isNaN({})).toBe(false)
    })

    it('isBigint', () => {
      expect(utils.isBigint(BigInt(1))).toBe(true)
      expect(utils.isBigint(NaN)).toBe(false)
      expect(utils.isBigint(-1)).toBe(false)
    })

    it('isSymbol', () => {
      expect(utils.isSymbol(Symbol(1))).toBe(true)
    })

    it('isFunction', () => {
      expect(utils.isFunction(() => {})).toBe(true)
      expect(utils.isFunction(new Function())).toBe(true)
      expect(utils.isFunction(function() {})).toBe(true)
    })

    it('isObject', () => {
      expect(utils.isObject({})).toBe(true)
      expect(utils.isObject([])).toBe(false)
      expect(utils.isObject(class A {})).toBe(false)
    })

    it('isArray', () => {
      expect(utils.isArray({})).toBe(false)
      expect(utils.isArray([])).toBe(true)
      expect(utils.isArray(new Array())).toBe(true)
    })

    it('isRegExp', () => {
      expect(utils.isRegExp(new RegExp(""))).toBe(true)
      expect(utils.isRegExp(/\./)).toBe(true)
      expect(utils.isRegExp([])).toBe(false)
    })

    it('isPromise', () => {
      expect(utils.isPromise(new Promise(() => {}))).toBe(true)
      expect(utils.isPromise(Promise.resolve(void 0))).toBe(true)
      expect(utils.isPromise(Promise.reject("").catch(() => void 0))).toBe(true)
    })

    it('isFormData', () => {
      expect(utils.isFormData(new FormData())).toBe(true)
      expect(utils.isFormData({})).toBe(false)
    })

    it('isDate', () => {
      expect(utils.isDate(new Date(""))).toBe(true)
      expect(utils.isDate(new Date())).toBe(true)
      expect(utils.isDate([])).toBe(false)
    })


    it('isEmpty', () => {
      expect(utils.isEmpty(undefined)).toBe(true)
      expect(utils.isEmpty(null)).toBe(true)
      expect(utils.isEmpty("")).toBe(true)
      expect(utils.isEmpty({})).toBe(true)
      expect(utils.isEmpty([])).toBe(true)
      expect(utils.isEmpty(NaN)).toBe(true)
      expect(utils.isEmpty(new Date("xxxx"))).toBe(true)
      expect(utils.isEmpty(111)).toBe(false)
      expect(utils.isEmpty({ a: 1 })).toBe(false)
    })
  })

  describe('paramStringify', () => {
    it('如果参数为空，期待返回空字符串', () => {
      expect(utils.paramStringify()).toBe('')
    })

    it('参数为非 Object 的参数，期待返回空字符串', () => {
      let arr: any = [1]
      expect(utils.paramStringify(arr)).toBe('')
      arr = new Set()
      expect(utils.paramStringify(arr)).toBe('')
      arr = new Map()
      expect(utils.paramStringify(arr)).toBe('')
    })

    it('参数为Object 的参数，期待返回字符', () => {
      const data: any = {
        test: 'test',
        num: 0,
        empty: null,
        empty1: undefined,
        nan: NaN,
        str: ""
      }
      expect(utils.paramStringify(data)).toBe('test=test&num=0&str=')

      const data2: any = {
        obj: { a: 1},
        str: "test"
      }
      expect(utils.paramStringify(data2)).toBe(`obj=${JSON.stringify(data2.obj)}&str=test`)

      const data3: any = {
        arr: [1, 2]
      }
      expect(utils.paramStringify(data3)).toBe(`arr[0]=1&arr[1]=2`)
    })
  })

  describe('dataRemoveEmpty', () => {
    it('如果不是Object类型，期待返回空字符串', () => {
      expect(JSON.stringify(utils.dataRemoveEmpty())).toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty([]))).toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty(new String("")))).toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty(new Date()))).toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty(new Set()))).toBe("{}")
    })

    it('去除 undefind null', () => {
      expect(JSON.stringify(utils.dataRemoveEmpty({a: undefined, b: null}))).toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty({a: []}))).not.toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty({a: {}}))).not.toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty({a: NaN}))).not.toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty({a: 0}))).not.toBe("{}")
      expect(JSON.stringify(utils.dataRemoveEmpty({a: "", b:[], c: NaN}))).toBe(JSON.stringify({a: "", b:[], c: NaN}))
      expect(JSON.stringify(utils.dataRemoveEmpty({a: new Date()}))).not.toBe("{}")
    })
  })
})