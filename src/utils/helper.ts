import validator from './validator'

const helper = {
  params2string: function (params?: { [key: string]: string|number|Array<number|string> }): string {
    if (!validator.is(params, Object)) return ''

    const items = []

    for (const key in params) {
      const item: any = params[key]

      if (validator.isEmpty(item)) continue

      if (validator.is(item, Array)) {
        item.forEach((child: any, idx: number) => {
          items.push(`${key}[${idx}]=${child}`)
        })

        continue
      }

      items.push(`${key}=${item}`)
    }

    return items.join('&')
  }
}

export default helper