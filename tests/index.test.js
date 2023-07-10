import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { snoop } from 'snoop'
import { createStore, createEvent } from 'effector'
import { createStorageMock } from './mocks/storage.mock.js'
import { createEventsMock } from './mocks/events.mock.js'
import persist from '../index.js'

//
// Mock `localStorage` and events
//

let events

test.before(() => {
  global.localStorage = createStorageMock()
  events = createEventsMock()
  global.addEventListener = events.addEventListener
})

test.after(() => {
  delete global.localStorage
  delete global.addEventListener
})

//
// Tests
//

test('should export function', () => {
  assert.type(persist, 'function')
})

test('store initial value should NOT be saved to storage', () => {
  const $counter = createStore(0, { name: 'counter1' })
  persist({ store: $counter, key: 'counter1' })
  assert.is(localStorage.getItem('counter1'), null)
  assert.is($counter.getState(), 0)
})

test('store new value should be saved to storage', () => {
  const $counter = createStore(0, { name: 'counter2' })
  persist({ store: $counter, key: 'counter2' })
  assert.is(localStorage.getItem('counter2'), null)
  $counter.setState(3)
  assert.is(localStorage.getItem('counter2'), '3')
  assert.is(
    $counter.getState(),
    JSON.parse(localStorage.getItem('counter2')),
  )
})

test('store `null` value should be saved to storage', () => {
  const $counter = createStore(0, { name: 'counter255' })
  persist({ store: $counter, key: 'counter255' })
  assert.is(localStorage.getItem('counter255'), null)
  $counter.setState(null)
  assert.is(localStorage.getItem('counter255'), 'null')
})

test('shoult reset value on init to default', async () => {
  const $counter = createStore(0, { name: 'counter00' })
  persist({ store: $counter, key: 'counter00', def: 42 })
  assert.is($counter.getState(), 42)
})

test('should get storage value on init', async () => {
  const $counter = createStore(0, { name: 'counter01' })
  global.localStorage.setItem('counter01', '1')
  persist({ store: $counter, key: 'counter01' })
  assert.is($counter.getState(), 1)
})

test('should get storage `null` value on init', async () => {
  const $counter = createStore(0, { name: 'counter015' })
  global.localStorage.setItem('counter015', 'null')
  persist({ store: $counter, key: 'counter015' })
  assert.is($counter.getState(), null)
})

test('should be synced by default', async () => {
  const $counter = createStore(0, { name: 'counter02' })
  persist({ store: $counter, key: 'counter02' })
  assert.is($counter.getState(), 0)

  global.localStorage.setItem('counter02', '1')
  await events.dispatchEvent('storage', {
    storageArea: global.localStorage,
    key: 'counter02',
    oldValue: null,
    newValue: '1',
  })

  assert.is($counter.getState(), 1)
})

test('should not be synced with sync:false', async () => {
  const $counter = createStore(0, { name: 'counter025' })
  persist({
    store: $counter,
    key: 'counter025',
    sync: false,
  })
  assert.is($counter.getState(), 0)

  global.localStorage.setItem('counter025', '1')
  await events.dispatchEvent('storage', {
    storageArea: global.localStorage,
    key: 'counter025',
    oldValue: null,
    newValue: '1',
  })

  assert.is($counter.getState(), 0)
})

test('should be restored on key removal', async () => {
  const $counter = createStore(0, { name: 'counter03' })
  persist({ store: $counter, key: 'counter03' })
  assert.is($counter.getState(), 0)
  $counter.setState(1)
  assert.is(global.localStorage.getItem('counter03'), '1')

  global.localStorage.removeItem('counter03')
  await events.dispatchEvent('storage', {
    storageArea: global.localStorage,
    key: 'counter03',
    oldValue: '1',
    newValue: null,
  })

  assert.is($counter.getState(), 0) // <- store.defaultState
})

test('should be restored on storage.clear()', async () => {
  const $counter = createStore(0, { name: 'counter04' })
  persist({ store: $counter, key: 'counter04' })
  assert.is($counter.getState(), 0)
  $counter.setState(2)
  assert.is(global.localStorage.getItem('counter04'), '2')

  global.localStorage.clear()
  await events.dispatchEvent('storage', {
    storageArea: global.localStorage,
    key: null,
  })

  assert.is($counter.getState(), 0) // <- store.defaultState
})

test('should be restored to default value on storage.clear()', async () => {
  const $counter = createStore(0, { name: 'counter05' })
  persist({ store: $counter, key: 'counter05', def: 42 })
  assert.is($counter.getState(), 42)
  $counter.setState(2)
  assert.is(global.localStorage.getItem('counter05'), '2')

  global.localStorage.clear()
  await events.dispatchEvent('storage', {
    storageArea: global.localStorage,
    key: null,
  })

  assert.is($counter.getState(), 42) // <- default value
})

test('reset store should reset it to given initial value', () => {
  localStorage.setItem('counter06', '42')
  const reset = createEvent()
  const $counter = createStore(0).reset(reset)
  persist({ store: $counter, key: 'counter06' })
  assert.is(localStorage.getItem('counter06'), '42')
  assert.is($counter.getState(), 42)
  reset()
  assert.is(localStorage.getItem('counter06'), '0')
  assert.is($counter.getState(), 0)
})

test('broken storage value should be ignored', () => {
  localStorage.setItem('counter07', 'broken')
  const $counter = createStore(13)
  persist({ store: $counter, key: 'counter07' })
  assert.is(localStorage.getItem('counter07'), 'broken')
  assert.is($counter.getState(), 13)
})

test('broken storage value should launch `fail` handler', () => {
  const fail = createEvent()
  const watch = snoop(() => undefined)
  fail.watch(watch.fn)

  localStorage.setItem('counter08', 'broken')
  const $counter = createStore(13)
  persist({ store: $counter, key: 'counter08', fail })

  assert.is(watch.callCount, 1)
  assert.is(watch.calls[0].arguments.length, 1)
  assert.instance(watch.calls[0].arguments[0], SyntaxError)

  assert.is(localStorage.getItem('counter08'), 'broken')
  assert.is($counter.getState(), 13)
})

test('broken store value should launch `fail` handler', () => {
  const fail = createEvent()
  const watch = snoop(() => undefined)
  fail.watch(watch.fn)

  const $store = createStore({ test: 1 })
  persist({ store: $store, key: 'store09', fail })

  assert.is(localStorage.getItem('store09'), null)
  assert.equal($store.getState(), { test: 1 })

  const recursive = {}
  recursive.recursive = recursive
  $store.setState(recursive)

  assert.is(watch.callCount, 1)
  assert.is(watch.calls[0].arguments.length, 1)
  assert.instance(watch.calls[0].arguments[0], TypeError)

  assert.is(localStorage.getItem('store09'), null)
  assert.is($store.getState(), recursive)
})

test('broken storage value should launch `fail` handler', async () => {
  const fail = createEvent()
  const watch = snoop(() => undefined)
  fail.watch(watch.fn)

  const $counter = createStore(0)
  persist({ store: $counter, key: 'counter10', fail })
  assert.is($counter.getState(), 0)

  localStorage.setItem('counter10', 'broken')
  await events.dispatchEvent('storage', {
    storageArea: localStorage,
    key: 'counter10',
    oldValue: null,
    newValue: 'broken',
  })

  assert.is(watch.callCount, 1)
  assert.is(watch.calls[0].arguments.length, 1)
  assert.instance(watch.calls[0].arguments[0], SyntaxError)

  assert.is(localStorage.getItem('counter10'), 'broken')
  assert.is($counter.getState(), 0)
})

test('persisted store should be force updated from storage', async () => {
  const $counter = createStore(0)
  persist({ store: $counter, key: 'counter11' })
  assert.is($counter.getState(), 0)

  localStorage.setItem('counter11', '42')
  await events.dispatchEvent('storage', {
    storageArea: localStorage,
    key: 'counter11',
    oldValue: null,
    newValue: '13', // <- should be ignored as obsolete value and `force` is enabled
  })

  assert.is($counter.getState(), 42) // <- should read value from storage
})

test('should not call .setItem on initially got value', async () => {
  const watch = snoop(() => undefined)
  const $counter = createStore(0, { name: 'counter12' })
  global.localStorage.setItem('counter12', '12')
  global.localStorage._callbacks({ setItem: watch.fn })
  persist({ store: $counter, key: 'counter12' })
  global.localStorage._callbacks({ setItem: undefined })
  assert.is($counter.getState(), 12)
  assert.is(watch.callCount, 0)
})

//
// Launch tests
//

test.run()
