const validator = {
  is: function (input, type): boolean {
    if (input === null || input === undefined) {
      return input === type
    }

    const expectType = type.name || type
    let inputType = ''
    if (input.constructor && input.constructor.hasOwnProperty('name')) {
      inputType = input.constructor.name
    }

    return inputType === expectType
  },

  isEmpty: function (input): boolean {
    if (input === null || input === undefined) return true

    if (input.toString) {
      const valueString = input.toString()
      return valueString === '' || valueString === 'NaN' || valueString === 'Invalid Date'
    }

    return false
  }
}

export default validator
