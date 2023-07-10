function connectStorage(key) {
  var errorHandler

  function holder(value) {
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
      var item = localStorage.getItem(key)
      return item === null ? value : JSON.parse(item)
    } catch (err) {
      errorHandler && errorHandler(err)
    }
    return value
  }

  return holder
}

module.exports = connectStorage
