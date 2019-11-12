
function connectLocalStorage (key) {
  function holder (storeValue) {
    try {
      var saveState = JSON.stringify(storeValue)
      localStorage.setItem(key, saveState)
    } catch (err) {
      holder.errorHandler(err)
    }
  }
  holder.errorHandler = function () {}
  holder.onError = function (errorHandler) {
    holder.errorHandler = errorHandler
    return holder
  }
  holder.init = function (def) {
    try {
      var savedState = localStorage.getItem(key)
      if (savedState !== null) {
        return JSON.parse(savedState)
      }
    } catch (err) {
      holder.errorHandler(err)
    }
    return def === undefined ? null : def
  }
  return holder
}

module.exports = connectLocalStorage
