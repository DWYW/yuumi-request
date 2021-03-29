import validator from './validator'

const helper = {
  params2string: function (params?: any): string {
    if (!validator.is(params, Object)) return ''

    const items = []

    for (const key in params) {
      const item: any = params[key]

      if (validator.isEmpty(item)) continue

      if (validator.is(item, Array)) {
        item.forEach((child: any, idx: number) => {
          if (validator.is(child, Object)) {
            items.push(`${key}[${idx}]=${JSON.stringify(child)}`)
          } else {
            items.push(`${key}[${idx}]=${child}`)
          }
        })

        continue
      }

      if (validator.is(item, Object)) {
        items.push(`${key}=${JSON.stringify(item)}`)
        continue
      }

      items.push(`${key}=${item}`)
    }

    return items.join('&')
  },

  dataRemoveEmpty: function (data: { [key: string]: any }) {
    const res: { [key: string]: any } = {}

    if (!validator.is(data, Object)) return res

    for (const key in data) {
      if (!Object.prototype.hasOwnProperty.call(data, key)) continue
      if (data[key] === null || data[key] === undefined) continue

      res[key] = data[key]
    }

    return res
  }
}

export default helper