const validator = {
  is: function (input: any, type: any): boolean {
    if (input === null || input === undefined) return input === type

    let expectType = type
    if (type.name) {
      expectType = type.name
    } else if (Object.prototype.hasOwnProperty.call(type.constructor, 'name')) {
      expectType = type.constructor.name
    }

    let inputType = input
    if (Object.prototype.hasOwnProperty.call(input.constructor, 'name')) {
      inputType = input.constructor.name
    }

    return inputType === expectType
  },

  isEmpty: function (input: any): boolean {
    if (input === null || input === undefined) return true

    const emptyString = validator.is(input, String) && input === ''
    const emptyNumber = validator.is(input, Number) && input.toString() === 'NaN'
    const emptyArray = validator.is(input, Array) && input.length === 0
    const invalidDate = validator.is(input, Date) && input.toString() === 'Invalid Date'

    return emptyString || emptyNumber || emptyArray || invalidDate
  }
}

export default validator