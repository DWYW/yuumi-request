export function isUndefine(input: any) {
  return input === null || input === undefined
}

export function isDefine(input: any) {
  return input !== null && input !== undefined
}

export function isString(input: any) {
  return typeof input === 'string'
}

export function isBoolean(input: any) {
  return typeof input === 'boolean'
}

export function isNumber(input: any) {
  return typeof input === 'number'
}

export function isNaN(input: any) {
  return Number.isNaN ? Number.isNaN(input) : isNumber(input) && input.toString() === "NaN"
}

export function isBigint(input: any) {
  return typeof input === 'bigint'
}

export function isSymbol(input: any) {
  return typeof input === 'symbol'
}

export function isFunction(input: any) {
  return typeof input === 'function'
}

export function isObject(input: any) {
  return Object.prototype.toString.call(input) === '[object Object]'
}

export function isArray(input: any) {
  return Object.prototype.toString.call(input) === '[object Array]'
}

export function isDate(input: any) {
  return Object.prototype.toString.call(input) === '[object Date]'
}

export function isRegExp(input: any) {
  return Object.prototype.toString.call(input) === '[object RegExp]'
}

export function isPromise(input: any) {
  return Object.prototype.toString.call(input) === '[object Promise]'
}

export function isFormData(input: any) {
  return Object.prototype.toString.call(input) === '[object FormData]'
}

export function isEmpty(input: any) {
  if (isUndefine(input)) return true
  if (isString(input)) return input === ""
  if (isNaN(input)) return true
  if (isArray(input) && input.length === 0) return true
  if (isDate(input) && input.toString() === 'Invalid Date') return true

  if (isObject(input)) {
    for (const key in input) return false
    return true
  }

  return false
}

export function dataRemoveEmpty(data?: Record<string, any>) {
  const res: Record<string, any> = {}
  if (!isObject(data)) return res

  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue
    if (data[key] === null || data[key] === undefined) continue
    res[key] = data[key]
  }

  return res
}

export function paramStringify(params?: any) {
  if (Object.prototype.toString.call(params) !== '[object Object]') return ''
  const items = []

  for (const key in params) {
    const item: any = params[key]

    if (isUndefine(item)) continue
    if (isNaN(item)) continue
    if (isArray(item)) {
      items.push(item.map((child:string|number, idx: number) => {
        return isObject(child) ? `${key}[${idx}]=${JSON.stringify(child)}` : `${key}[${idx}]=${child}`
      }).join('&'))
      continue
    }
    if (isObject(item)) {
      items.push(`${key}=${JSON.stringify(item)}`)
      continue
    }

    items.push(`${key}=${item}`)
  }

  return items.join('&')
}