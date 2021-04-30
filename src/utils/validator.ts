class Validator {
  isDefine (input: any) {
    return input !== null && input !== undefined
  }

  isString (input: any) {
    return typeof input === 'string'
  }

  isBoolean (input: any) {
    return typeof input === 'boolean'
  }

  isNumber (input: any) {
    return typeof input === 'number'
  }

  isNaN (input: any) {
    return Number.isNaN ? Number.isNaN(input) : this.isNumber(input) && isNaN(input)
  }

  isBigint (input: any) {
    return typeof input === 'bigint'
  }

  isSymbol (input: any) {
    return typeof input === 'symbol'
  }

  isFunction (input: any) {
    return typeof input === 'function'
  }

  isObject (input: any) {
    return typeof input === 'object' && input === Object(input)
  }

  isArray (input: any) {
    return Object.prototype.toString.call(input) === '[object Array]'
  }

  isDate (input: any) {
    return Object.prototype.toString.call(input) === '[object Date]'
  }

  isRegExp (input: any) {
    return Object.prototype.toString.call(input) === '[object RegExp]'
  }

  isPromise (input: any) {
    return Object.prototype.toString.call(input) === '[object Promise]'
  }

  isFormData (input: any) {
    return Object.prototype.toString.call(input) === '[object FormData]'
  }

  isEmpty (input: any) {
    if (!this.isDefine(input)) return true
    if (this.isString(input) && /^\s*$/.test(input)) return true
    if (this.isNaN(input)) return true
    if (this.isArray(input) && input.length === 0) return true
    if (this.isDate(input) && input.toString() === 'Invalid Date') return true

    if (this.isObject(input)) {
      for (let key in input) return false

      return true
    }

    return false
  }
}

export default new Validator()