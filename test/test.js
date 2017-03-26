import test from 'ava'
import { transform } from 'babel-core'

const transpile = src => {
  return transform(src, {
    plugins: './index'
  }).code.trim()
}

test(':{ keyCode } modifier', t => {
  t.is(
    transpile(`<input onKeypress:k13={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 13) _this.method(event);
}} />;`
  )
})

test(':prevent modifier', t => {
  t.is(
    transpile(`<input onKeypress:prevent={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  event.preventDefault();

  _this.method(event);
}} />;`
  )
})

test(':prevent modifier with no body', t => {
  t.is(
    transpile(`<input onKeypress:prevent />`),
    `<input onKeypress={event => {
  event.preventDefault();
}} />;`
  )
})

test(':stop modifier', t => {
  t.is(
    transpile(`<input onKeypress:stop={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  event.stopPropagation();

  _this.method(event);
}} />;`
  )
})

test(':unknown modifier', t => {
  t.is(
    transpile(`<input onKeypress:randomid={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  _this.method(event);
}} />;`
  )
})

test(':esc modifier', t => {
  t.is(
    transpile(`<input onKeypress:esc={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 27) _this.method(event);
}} />;`
  )
})

test(':tab modifier', t => {
  t.is(
    transpile(`<input onKeypress:tab={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 9) _this.method(event);
}} />;`
  )
})

test(':enter modifier', t => {
  t.is(
    transpile(`<input onKeypress:enter={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 13) _this.method(event);
}} />;`
  )
})

test(':space modifier', t => {
  t.is(
    transpile(`<input onKeypress:space={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 32) _this.method(event);
}} />;`
  )
})

test(':up modifier', t => {
  t.is(
    transpile(`<input onKeypress:up={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 38) _this.method(event);
}} />;`
  )
})

test(':left modifier', t => {
  t.is(
    transpile(`<input onKeypress:left={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 37) _this.method(event);
}} />;`
  )
})

test(':right modifier', t => {
  t.is(
    transpile(`<input onKeypress:right={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 39) _this.method(event);
}} />;`
  )
})

test(':down modifier', t => {
  t.is(
    transpile(`<input onKeypress:down={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 40) _this.method(event);
}} />;`
  )
})

test(':delete modifier', t => {
  t.is(
    transpile(`<input onKeypress:delete={this.method} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 8 || event.charCode === 46) _this.method(event);
}} />;`
  )
})

test('combine :up and :down modifiers', t => {
  t.is(
    transpile(`<input onKeypress:up={this.methodUp} onKeypress:down={this.methodDown} />`),
    `var _this = this;

<input onKeypress={event => {
  if (event.charCode === 38) _this.methodUp(event);
  if (event.charCode === 40) _this.methodDown(event);
}} />;`
  )
})
