## Event Modifiers for JSX

This babel plugin adds some syntactic sugar to JSX.

### Usage:

```bash
npm i babel-plugin-jsx-event-modifiers -D
```
or
```bash
yarn add babel-plugin-jsx-event-modifiers -D
```

Then add `jsx-event-modifiers` to your `.babelrc` file under `plugins`

example .babelrc (for vue):
```json
{
  "presets": ["es2015"],
  "plugins": ["jsx-event-modifiers", "transform-vue-jsx"]
}
```
example .babelrc (for react):
```json
{
  "presets": [
    "es2015",
    "react"
  ],
  "plugins": ["jsx-event-modifiers"]
}
```

#### Event Modifiers

Example:
```js
export default {
  render () {
    return (
      <input
        onKeyUp:up={this.methodForPressingUp}
        onKeyUp:down={this.methodForPressingDown}
      />
    )
  }
}
```
will be transpiled into:
```js
export default {
  render () {
    return (
      <input
        onKeyUp={event => {
          if (event.charCode === 38)
            this.methodForPressingUp(event);

          if (event.charCode === 40)
            this.methodForPressingDown(event);
        }} />
    );
  }
}
```

#### API:

| Modifier | Description |
|---|---|
| [`:stop`](#stop) | executes `event.stopPropagation()` |
| [`:prevent`](#prevent) | executes `event.preventDefault()` |
| [`:k{keyCode}`](#keycode) | checks for the `keyCode` |
| [`:{keyAlias}`](#keyalias) | checks for the `keyCode` that is assigned to this `keyAlias`

##### Stop

`event.stopPropagation()` is called before the expression

Example:
```js
export default {
  render () {
    return (
      <div>
        <a href="/" onClick:stop />
        <a href="/" onClick:stop={this.method} />
      </div>
    )
  }
}
```
is transpiled to:
```js
export default {
  render () {
    return (
      <div>
        <a href="/" onClick={event => {
          event.stopPropagation();
        }} />
        <a href="/" onClick={event => {
          event.stopPropagation();
          this.method(event);
        }} />
      </div>
    );
  }
}
```

##### Prevent

`event.preventDefault()` is called before the expression

Example:
```js
export default {
  render () {
    return (
      <div>
        <a href="/" onClick:prevent />
        <a href="/" onClick:prevent={this.method} />
      </div>
    )
  }
}
```
is transpiled to:
```js
export default {
  render () {
    return (
      <div>
        <a href="/" onClick={event => {
          event.preventDefault();
        }} />
        <a href="/" onClick={event => {
          event.preventDefault();
          this.method(event);
        }} />
      </div>
    );
  }
}
```

##### KeyCode

`event.charCode` is compared to the keyCode

Example:
```js
export default {
  render () {
    return <input onKeyUp:k13={this.method} />
  }
}
```
is transpiled to:
```js
export default {
  render () {
    return (
      <input onKeyUp={event => {
        if (event.charCode === 13)
          this.method(event);
      }} />
    );
  }
}
```

##### KeyAlias

There is a predefined list of aliases for keycodes:
```js
const aliases = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
}
```

Example:
```js
export default {
  render () {
    return <input onKeyUp:enter={this.method} />
  }
}
```
is transpiled to:
```js
export default {
  render () {
    return (
      <input onKeyUp={event => {
        if (event.charCode === 13)
          this.method(event);
      }} />
    );
  }
}
```

#### You can combine them:

Example:
```js
export default {
  render () {
    return <input
      onKeyUp:enter={this.method}
      onKeyUp:k60={this.otherMethod} />
  }
}
```
is transpiled to:
```js
export default {
  render () {
    return (
      <input
        onKeyUp={event => {
          if (event.charCode === 13)
            this.method(event);

          if (event.charCode === 60)
            this.otherMethod(event);
        }} />
    );
  }
}
```
