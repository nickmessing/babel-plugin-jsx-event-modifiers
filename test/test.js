import test from 'ava'
import { transform } from 'babel-core'

const transpile = src => {
  return transform(src, {
    plugins: './index'
  }).code.trim()
}

test(':{ keyCode } modifier', t => {
  t.is(
    transpile(`<input onKeyUp:k13={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 13) _this.method(event);
}} />;`
  )
})

test(':prevent modifier', t => {
  t.is(
    transpile(`<input onKeyUp:prevent={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  event.preventDefault();

  _this.method(event);
}} />;`
  )
})

test(':prevent modifier with no body', t => {
  t.is(
    transpile(`<input onKeyUp:prevent />`),
    `<input onKeyUp={event => {
  event.preventDefault();
}} />;`
  )
})

test(':stop modifier', t => {
  t.is(
    transpile(`<input onKeyUp:stop={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  event.stopPropagation();

  _this.method(event);
}} />;`
  )
})

test(':unknown modifier', t => {
  t.is(
    transpile(`<input onKeyUp:randomid={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  _this.method(event);
}} />;`
  )
})

test(':esc modifier', t => {
  t.is(
    transpile(`<input onKeyUp:esc={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 27) _this.method(event);
}} />;`
  )
})

test(':tab modifier', t => {
  t.is(
    transpile(`<input onKeyUp:tab={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 9) _this.method(event);
}} />;`
  )
})

test(':enter modifier', t => {
  t.is(
    transpile(`<input onKeyUp:enter={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 13) _this.method(event);
}} />;`
  )
})

test(':space modifier', t => {
  t.is(
    transpile(`<input onKeyUp:space={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 32) _this.method(event);
}} />;`
  )
})

test(':up modifier', t => {
  t.is(
    transpile(`<input onKeyUp:up={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 38) _this.method(event);
}} />;`
  )
})

test(':left modifier', t => {
  t.is(
    transpile(`<input onKeyUp:left={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 37) _this.method(event);
}} />;`
  )
})

test(':right modifier', t => {
  t.is(
    transpile(`<input onKeyUp:right={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 39) _this.method(event);
}} />;`
  )
})

test(':down modifier', t => {
  t.is(
    transpile(`<input onKeyUp:down={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 40) _this.method(event);
}} />;`
  )
})

test(':delete modifier', t => {
  t.is(
    transpile(`<input onKeyUp:delete={this.method} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 8 || event.keyCode === 46) _this.method(event);
}} />;`
  )
})

test('combine :up and :down modifiers', t => {
  t.is(
    transpile(`<input onKeyUp:up={this.methodUp} onKeyUp:down={this.methodDown} />`),
    `var _this = this;

<input onKeyUp={event => {
  if (event.keyCode === 38) _this.methodUp(event);
  if (event.keyCode === 40) _this.methodDown(event);
}} />;`
  )
})
