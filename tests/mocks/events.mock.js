export class EventsMock {
  listeners = new Map()

  async dispatchEvent(name, event) {
    const listeners = this.listeners.get(name)
    if (listeners && listeners.length > 0) {
      return Promise.all(
        listeners.map(
          (listener) =>
            new Promise((resolve) =>
              setTimeout(() => resolve(listener(event)), 0),
            ),
        ),
      )
    }
  }

  // have to be an arrow functions to keep `this` context when using detached, like
  // `global.addEventListener = mock.addEventListener`
  addEventListener = (name, listener) => {
    let listeners = this.listeners.get(name)
    if (!listeners) {
      this.listeners.set(name, (listeners = []))
    }
    listeners.push(listener)
  }

  // have to be an arrow functions to keep `this` context when using detached, like
  // `global.removeEventListener = mock.removeEventListener`
  removeEventListener = (name, listener) => {
    const listeners = this.listeners.get(name)
    if (listeners && listeners.length > 0) {
      const idx = listeners.indexOf(listener) // listener MUST be the same reference
      if (idx >= 0) {
        listeners.splice(idx, 1)
      }
    }
  }
}

export function createEventsMock() {
  return new EventsMock()
}
