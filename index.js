
function connectLocalStorage (key) {
  function holder (storeValue) {
    try {
      var saveState = JSON.stringify(storeValue)
      localStorage.setItem(key, saveState)
    } catch (err) {
      holder.onError && holder.onError(err)
    }
  }
  holder.onError = function (errorHandler) {
    holder.errorHandler = errorHandler
    return holder
  }
  holder.init = function () {
    try {
      var savedState = localStorage.getItem(key)
      if (savedState !== null) {
        return JSON.parse(savedState)
      }
    } catch (err) {
      holder.onError && holder.onError(err)
    }
    return null
  }
  return holder
}

module.exports = connectLocalStorage
