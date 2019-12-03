# effector-localstorage
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors)
[![npm version](https://img.shields.io/npm/v/effector-localstorage.svg)](https://www.npmjs.com/package/effector-localstorage)

Minimalistic (99 B) module for [effector](https://github.com/zerobias/effector) that sync stores with `localStorage`.

```javascript
import {createStore, createEvent} from 'effector'
import connectLocalStorage from "effector-localstorage";

const increment = createEvent('increment')
const decrement = createEvent('decrement')
const resetCounter = createEvent('reset counter')

const counterLocalStorage = connectLocalStorage("counter")
  .onError((err) => console.log(err)) // setup error callback

const counter = createStore(counterLocalStorage.init(0)) // initialize store with localStorage value
  .on(increment, state => state + 1)
  .on(decrement, state => state - 1)
  .reset(resetCounter)

counter.watch(counterLocalStorage) // update localStorage on every store change
```
View example at [codesandbox](https://codesandbox.io/s/effector-localstorage-85czp) or [repository](/example).

### Synchronize store between different tabs/windows

Local storage has one awesome feature — it can be synced between two (or more) widows/tabs. Window has [storage](https://www.w3schools.com/jsref/event_storage_url.asp) event, which is only triggered when a window **other than itself** makes the changes.

This way it is possible to synchronise counter on two tabs of a browser. Or, closer to reality, abstract flag `authenticated`, when user performs logout on one tab — that triggers logout on all other opened tabs with the same application.

To make store synchronizable, just use `effector-localstorage/sync` instead of `effector-localstorage`. Also you will need to create event, which will set store value to new one (which came from another tab/window).

```javascript
import {createStore, createEvent} from 'effector'
import connectLocalStorage from "effector-localstorage/sync";

const increment = createEvent('increment')
const decrement = createEvent('decrement')
const resetCounter = createEvent('reset counter')
const setCounter = createEvent('set counter') // event to set store value

const counterLocalStorage = connectLocalStorage("counter")
  .onError((err) => console.log(err)) // setup error callback
  .onChange(setCounter) // call event on external storage change

const counter = createStore(counterLocalStorage.init(0)) // initialize store with localStorage value
  .on(increment, state => state + 1)
  .on(decrement, state => state - 1)
  .on(setCounter, (state, value) => value) // set store value due to external tab/window change
  .reset(resetCounter)

counter.watch(counterLocalStorage) // update localStorage on every store change
```

## Installation

Install it with yarn:

```
yarn add effector-localstorage
```

Or with npm:

```
npm i effector-localstorage --save
```

## Sponsored

<a href="https://lessmess.agency/?utm_source=effector-localstorage">
  <img src="https://lessmess.agency/badges/sponsored_by_lessmess.svg"
       alt="Sponsored by Lessmess" width="236" height="54">
</a>

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/ilialesik"><img src="https://avatars2.githubusercontent.com/u/1270648?v=4" width="100px;" alt="Ilya Lesik"/><br /><sub><b>Ilya Lesik</b></sub></a><br /><a href="https://github.com/lessmess-dev/effector-localstorage/commits?author=ilyalesik" title="Code">💻</a></td>
    <td align="center"><a href="http://stackoverflow.com/users/388916/hubro"><img src="https://avatars0.githubusercontent.com/u/597206?v=4" width="100px;" alt="Tomas Sandven"/><br /><sub><b>Tomas Sandven</b></sub></a><br /><a href="https://github.com/lessmess-dev/effector-localstorage/commits?author=Hubro" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/yumauri"><img src="https://avatars0.githubusercontent.com/u/6583994?v=4" width="100px;" alt="Victor"/><br /><sub><b>Victor</b></sub></a><br /><a href="https://github.com/lessmess-dev/effector-localstorage/commits?author=yumauri" title="Code">💻</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
