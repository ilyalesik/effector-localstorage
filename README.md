# effector-localstorage

[![Tests Status](https://github.com/ilyalesik/effector-localstorage/workflows/test/badge.svg)](https://github.com/ilyalesik/effector-localstorage/actions?workflow=test)
[![License](https://img.shields.io/github/license/ilyalesik/effector-localstorage.svg?color=yellow)](./LICENSE)
[![NPM](https://img.shields.io/npm/v/effector-localstorage.svg)](https://www.npmjs.com/package/effector-localstorage)
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg)](#contributors)
![Made with Love](https://img.shields.io/badge/made%20with-❤-red.svg)

Tiny and elegant module for effector to keep store state in [localStorage] and synchronize changes between browser tabs.

- **Small.** 167 bytes (minified and compressed). Single file, no dependencies. [Size Limit](https://github.com/ai/size-limit) controls the size.
- **ESM-only.** It targets modern browsers and Deno. For older browsers, you will need to transpile it.
- **No Build.** Written with plain JavaScript, you can easily patch it locally, if you need, or make a fork and install directly from GitHub.
- **TypeScript support.** Even while it is written in plain JavaScript, types are included.

## Install

Depending on your package manager

```bash
# using `pnpm` ↓
$ pnpm add effector-localstorage

# using `yarn` ↓
$ yarn add effector-localstorage

# using `npm` ↓
$ npm install --save effector-localstorage
```

#### CDN

In Deno and modern browsers you can load it directly from CDN:

```javascript
// esm.sh
import persist from 'https://esm.sh/effector-localstorage'

// jspm.io
import persist from 'https://ga.jspm.io/npm:effector-localstorage'
```

#### Download

You can download single file and add it to your codebase manually:<br>
https://cdn.jsdelivr.net/npm/effector-localstorage/index.js

## Usage

```javascript
import { createStore, createEvent } from 'effector'
import persist from 'effector-localstorage'

const inc = createEvent()
const dec = createEvent()
const $counter = createStore(0)
  .on(inc, (state) => state + 1)
  .on(dec, (state) => state - 1)

// persist store in `localStorage`
persist({
  store: $counter,
  key: 'counter',
})
```

## Formulae

- `persist(options): void`

### Options

- `store` ([_Store_]): Store to synchronize with `localStorage`.
- `key` ([_string_]): Key for `localStorage`, to store value in.
- `def`?: (_any_): Default value, which will be passed to `store` in case of absent storage value. Default = `store.defaultState`.
- `fail`? ([_Event_] | [_Effect_]): Event or Effect, which will be triggered in case of any error (serialization/deserialization error, storage is full and so on).
- `sync`? ([_boolean_]): Add [`'storage'`] event listener or no. Default = `true`.

## Value Encoding

[LocalStorage] supports storeing only plain strings. Because of that it is required to do value serialization for persisting and string deserialization for restoring the value, if your value is more complex, than just plain string.

`effector-localstorage` uses [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) for serialization and [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) for deserialization.<br>
You cannot change it.

These methods has some limitations, because of JSON specification:

- Only simple types supported, which are valid JSON values
- Circular references are not supported

You can read more about it on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description).

## Server-Side Rendering

While you can use `effector-localstorage` in SSR environment, this will not throw an exception in runtime, BUT `persist` function will trigger `fail` (if you passed it) if `localStorage` and/or `addEventListener` are not available. If your business logic does not rely on `fail`, you can safely ignore this behaviour — `persist` will do nothing with store value on server side.

Note though, that you will probably want to add `serialize:'ignore'` to persisted stores, so server value will not interfere with browser value.

## Complex behaviour

`effector-localstorage` [does one thing well](https://en.wikipedia.org/wiki/Unix_philosophy), and we would like to leave this package in its "state of an art" status.

The only valid reason to increase package size — is to fix an issue, but not new functionality.

If you know, how to reduce package size without breaking tests — PRs are wellcome :)

If your business logic requires more complex behaviour, like custom serialization/deserialization, support for `sessionStorage` or other storages, like `IndexedDB`, or reactive pick-ups from non-reactive storage — take a look on [`effector-storage`](https://github.com/yumauri/effector-storage) package.

`effector-localstorage`'s API was intentianally changed in order for `effector-storage` to be "drop-in" replacement for it. You can just replace import and here you go, ready to enrich your application:

```diff
- import persist from 'effector-localstorage'
+ import { persist } from 'effector-storage/local'
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://twitter.com/ilialesik"><img src="https://avatars2.githubusercontent.com/u/1270648?v=4?s=100" width="100px;" alt="Ilya Lesik"/><br /><sub><b>Ilya Lesik</b></sub></a><br /><a href="https://github.com/lessmess-dev/effector-localstorage/commits?author=ilyalesik" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://stackoverflow.com/users/388916/hubro"><img src="https://avatars0.githubusercontent.com/u/597206?v=4?s=100" width="100px;" alt="Tomas Sandven"/><br /><sub><b>Tomas Sandven</b></sub></a><br /><a href="https://github.com/lessmess-dev/effector-localstorage/commits?author=Hubro" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/yumauri"><img src="https://avatars0.githubusercontent.com/u/6583994?v=4?s=100" width="100px;" alt="Victor Didenko"/><br /><sub><b>Victor Didenko</b></sub></a><br /><a href="https://github.com/lessmess-dev/effector-localstorage/commits?author=yumauri" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

[localstorage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[`'storage'`]: https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent
[_effect_]: https://effector.dev/docs/api/effector/effect
[_event_]: https://effector.dev/docs/api/effector/event
[_store_]: https://effector.dev/docs/api/effector/store
[_string_]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[_function_]: https://developer.mozilla.org/en-US/docs/Glossary/Function
[_boolean_]: https://developer.mozilla.org/en-US/docs/Glossary/Boolean
[_error_]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
