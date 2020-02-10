export default {
  typeof (data:any): string {
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
  },

  isFunction (data: any): boolean {
    return this.typeof(data) === 'function'
  },

  isObject (data: any): boolean {
    return this.typeof(data) === 'object'
  },

  isArray (data: any): boolean {
    return this.typeof(data) === 'array'
  },

  isString (data: any): boolean {
    return this.typeof(data) === 'string'
  },

  isEmpty (data: any): boolean {
    return data === null || data === undefined || data === ''
  }
}
