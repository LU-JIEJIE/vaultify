# vaultify

[![npm version][npm-version-badge]][npm-version-href]
[![minzip][minzip-badge]][minzip-href]
[![jsdocs][jsdocs-badge]][jsdocs-href]
[![license][license-badge]][license-href]

Conveniently manage the configuration file in your command-line project based on Node.js.

It just provides some simple features instead of a strict typecheck and validation cause a lighter package suit me a lot.

Inspiration comes from [`Tampermonkey`](https://www.tampermonkey.net/) api.

The configuration file will be stored default in `C:/Users/USERNAME/AppData/Roaming/PROJECT_NAME/config.json` on `Windows`, `~/.config/PROJECT_NAME/config.json` on `Linux` and `~/Library/Preferences/PROJECT_NAME/config.json` on `macOS`.

## Install

```bash
npm install vaultify
```

## Usage

```typescript
import Vault from './vault'

const vault = new Vault({
  name: 'myproject'
})

// set a value
vault.set('first', 1)
console.log(vault.get('first')) // 1

// delete a value
vault.delete('first')
console.log(vault.get('first')) // undefined
```

## Vault

All api is based on the `Vault` class.

### Options

The `Vault` class accepts an options object with the following properties:

#### name [string, required]

The name of your project, it matters to the path of the configuration file.

#### displayNameTemplate [string]

Guess you want to change the name of the folder where the configuration file stored. It should contain a placeholder `[NAME]` which will be replaced by the `name` property.
For example, if you set `displayNameTemplate` to `config-[NAME]` and `name` to `myproject`, the configuration file will be stored in the folder `config-myproject`.

#### fileName [string]

The name of the configuration file. Default is `config`.

#### fileExtension [string]

The extension of the configuration file. Default is `json`.

Of course you can set it to `haha` or whatever you like, even without an extension.

The configuration will be stored like a json, so whatever you set the extension to, it will be parsed as a json by default.

#### defaults [object]

The default values of the configuration file. It will be merged with the existing configuration file when the `Vault` instance is created. The existing values that have the same key will be kept.

#### obfuscate [boolean]

Whether to obfuscate the configuration file. Default is `false`.

It designed to prevent users from modifying the configuration file manually, maybe useful in some cases?

### instance attributes and methods

#### set(key, value)

Set a value to the configuration file.

The `dot notation` is supported, which means you can set a nested value like this:

```typescript
vault.set('a.b.c', 1)

// equals to
vault.set('a', {
  b: {
    c: 1
  }
})
```
> [!IMPORTANT]
> You should ensure the value is not `undefined`, `Symbol` or other values that cannot be stored in a json file.

#### get(key, defaultValue?)

Get a value from the configuration file. If the value is not found, it will return the `defaultValue` if provided, otherwise `undefined`.

Of course, the dot notation is supported.

#### delete(key)

Delete a value from the configuration file. The dot notation is supported.

#### reset(hard?)

Reset all values in the configuration file to the default values. If `hard` is `true`, all values will be removed.

#### store

The data object that stores all values in the configuration file.

It's writable, so you can reassign it to update the configuration file if you want, like this:

```typescript
vault.store = {
  a: 1
}
```
> [!IMPORTANT]
> Be careful, only reassign it can update the configuration file, instead of reassign its properties.

#### filePath

The path of the configuration file.

#### cwd

The path of the folder where the configuration file stored.

#### displayName

The name of the folder where the configuration file stored.

#### defaults

The default values of `Vault`.

<!-- Badge -->
[npm-version-badge]: https://img.shields.io/npm/v/vaultify?style=flat&color=ddd&labelColor=444
[npm-version-href]: https://www.npmjs.com/package/vaultify
[minzip-badge]: https://img.shields.io/bundlephobia/minzip/vaultify?style=flat&color=ddd&labelColor=444&label=minizip
[minzip-href]: https://bundlephobia.com/result?p=vaultify
[jsdocs-badge]: https://img.shields.io/badge/jsDocs-reference-ddd?style=flat&color=ddd&labelColor=444
[jsdocs-href]: https://www.jsdocs.io/package/vaultify
[license-badge]: https://img.shields.io/github/license/Lu-Jiejie/vaultify?style=flat&color=ddd&labelColor=444
[license-href]: https://github.com/Lu-Jiejie/vaultify/blob/main/LICENSE
