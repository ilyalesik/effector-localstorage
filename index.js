export default (
  { fail, store, sync = 1, def = store.defaultState, key },

  call = (fn) => (value) => {
    try {
      fn(value)
    } catch (e) {
      if (fail) fail(e)
    }
  },

  pick = call((value) =>
    store.setState(
      (value = localStorage.getItem(key)) == null
        ? def
        : JSON.parse(value),
    ),
  ),
) => {
  pick()

  if (sync)
    call((fn) => addEventListener('storage', fn))(
      (e) => !(e.key && e.key != key) && pick(),
    )

  store.updates.watch(
    call((value) =>
      localStorage.setItem(key, JSON.stringify(value)),
    ),
  )
}
