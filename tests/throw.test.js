import { test } from 'uvu'
import { snoop } from 'snoop'
import * as assert from 'uvu/assert'
import { createEvent, createStore } from 'effector'
import persist from '../index.js'

//
// Mock `localStorage` which throws on access
//

test.before(() => {
  Object.defineProperty(global, 'localStorage', {
    configurable: true,
    get() {
      throw new Error('Access denied')
    },
  })
})

test.after(() => {
  delete global.localStorage
})

//
// Tests
//

test('should not fail on forbidden localStorage', async () => {
  const fail = createEvent()
  const watch = snoop(() => undefined)
  fail.watch(watch.fn)

  const $counter = createStore(0)
  assert.not.throws(() =>
    persist({ store: $counter, key: 'counter30', fail }),
  )

  assert.is(watch.callCount, 2)

  // localStorage access denied error
  let error = watch.calls[0].arguments[0]
  assert.instance(error, Error)
  assert.match(error, /Access denied/)

  // addEventListener reference error
  error = watch.calls[1].arguments[0]
  assert.instance(error, ReferenceError)
})

//
// Launch tests
//

test.run()
