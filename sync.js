function connectStorage (key) {
  var errorHandler

  function holder (value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      errorHandler && errorHandler(err)
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
      value = JSON.parse(localStorage.getItem(key))
    } catch (err) {
      errorHandler && errorHandler(err)
    }
    return value == null ? null : value
  }

  return holder
}

module.exports = connectStorage
