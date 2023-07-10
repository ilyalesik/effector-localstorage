import { test } from 'uvu'
import { snoop } from 'snoop'
import * as assert from 'uvu/assert'
import { createEvent, createStore } from 'effector'
import { createStorageMock } from './mocks/storage.mock.js'
import persist from '../index.js'

//
// Mock `localStorage`, but not events
//

test.before(() => {
  global.localStorage = createStorageMock()
})

test.after(() => {
  delete global.localStorage
})

//
// Tests
//

test('should not fail on absent addEventListener when sync:false', async () => {
  const fail = createEvent()
  const watch = snoop(() => undefined)
  fail.watch(watch.fn)

  const $counter = createStore(0)
  assert.not.throws(() =>
    persist({
      store: $counter,
      key: 'counter40',
      fail,
      sync: false,
    }),
  )

  assert.is(watch.callCount, 0)
})

//
// Launch tests
//

test.run()
