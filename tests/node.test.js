import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { snoop } from 'snoop'
import { createStore, createEvent } from 'effector'
import persist from '../index.js'

//
// Delete `localStorage`, if any
//

let storage

test.before(() => {
  storage = global.localStorage
  delete global.localStorage
})

test.after(() => {
  global.localStorage = storage
})

//
// Tests
//

test('store should ignore initial value if localStorage is not exists', () => {
  const $counter = createStore(42)
  persist({ store: $counter, key: 'counter00' })
  assert.is($counter.getState(), 42)
})

test('store new value should be ignored by storage', () => {
  const $counter = createStore(0)
  persist({ store: $counter, key: 'counter01' })
  $counter.setState(42)
  assert.is($counter.getState(), 42)
})

test('absent localStorage should trigger `fail`', () => {
  const fail = createEvent()
  const watch = snoop(() => undefined)
  fail.watch(watch.fn)

  const $counter = createStore(13)
  persist({ store: $counter, key: 'counter02', fail })

  assert.is(watch.callCount, 2)

  // addEventListener reference error
  let error = watch.calls[0].arguments[0]
  assert.instance(error, ReferenceError)

  // localStorage reference error
  error = watch.calls[1].arguments[0]
  assert.instance(error, ReferenceError)

  assert.is($counter.getState(), 13)
})

//
// Launch tests
//

test.run()
