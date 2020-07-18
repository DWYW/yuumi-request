import validator from './validator'

const helper = {
  params2string: function (params): string {
    if (!validator.is(params, Object)) return ''

    const items = []

    for (const key in params) {
      const item = params[key]

      if (!validator.isEmpty(item)) {
        items.push(`${key}=${item}`)
      }
    }

    return items.join('&')
  }
}

export default helper
