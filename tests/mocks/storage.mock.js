const noop = () => undefined

export class StorageMock {
  storage = new Map()

  getCallback = noop
  setCallback = noop
  removeCallback = noop
  clearCallback = noop

  constructor() {
    return new Proxy(this, {
      get(target, property, receiver) {
        if (property in target) {
          return Reflect.get(target, property, receiver)
        }
        return target.storage.get(String(property))
      },
      set(target, property, value, receiver) {
        if (property in target) {
          return Reflect.set(
            target,
            property,
            value,
            receiver,
          )
        }
        target.storage.set(String(property), String(value))
        return true
      },
    })
  }

  setItem(key, value) {
    key = String(key)
    value = String(value)
    this.setCallback(key, value)
    this.storage.set(key, value)
  }

  getItem(key) {
    key = String(key)
    this.getCallback(key)
    return this.storage.has(key)
      ? this.storage.get(key) ?? null
      : null
  }

  removeItem(key) {
    key = String(key)
    this.removeCallback(key)
    this.storage.delete(key)
  }

  clear() {
    this.clearCallback()
    this.storage.clear()
  }

  get length() {
    return this.storage.size
  }

  key(n) {
    const key = Array.from(this.storage.keys())[n]
    return key === undefined ? null : key
  }

  _callbacks({ getItem, setItem, removeItem, clear }) {
    this.getCallback = getItem || noop
    this.setCallback = setItem || noop
    this.removeCallback = removeItem || noop
    this.clearCallback = clear || noop
  }
}

export function createStorageMock() {
  return new StorageMock()
}
