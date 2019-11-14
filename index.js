function connectStorage (key, storage) {
  storage = storage || localStorage
  var errorHandler = function () {} // eslint-disable-line func-style

  function holder (value) {
    try {
      storage.setItem(key, JSON.stringify(value))
    } catch (err) {
      errorHandler(err)
    }
  }

  holder.onError = function (handler) {
    errorHandler = handler
    return holder
  }

  holder.onChange = function (event) {
    addEventListener('storage', function (e) {
      e.key === key && event(holder.init())
    })
    return holder
  }

  holder.init = function (value) {
    try {
      value = JSON.parse(storage.getItem(key))
    } catch (err) {
      errorHandler(err)
    }
    return value == null ? null : value
  }

  return holder
}

module.exports = connectStorage
