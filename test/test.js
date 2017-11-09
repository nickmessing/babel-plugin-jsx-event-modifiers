import test from 'ava'
import { transform } from 'babel-core'

const transpile = src => {
  return transform(src, {
    plugins: './dist/bundle-test',
  }).code.trim()
}

const snapshotTest = (name, code) =>
  test(name, t => {
    t.snapshot(code, `${name} - before`)
    t.snapshot(transpile(code), `${name} - compiled`)
  })

snapshotTest('No Events', '<a />')
snapshotTest('Ignores spread', '<a {...b} />')
snapshotTest('Ignores attributes', '<a href="#" />')
snapshotTest('Ignores not jsx expressions', '<a onEvent="str" />')
snapshotTest('Plain Event', '<a onEvent={this.action} />')
snapshotTest('Supports Dash', '<a on-event={this.action} />')
snapshotTest('Combine Events', '<a onEvent={this.action1} onEvent={this.action2} />')
snapshotTest('Simple :capture', '<a onEvent:capture={this.action1} />')
snapshotTest('Simple :once', '<a onEvent:once={this.action1} />')
snapshotTest(':capture-once', '<a onEvent:capture-once={this.action1} />')
snapshotTest('Simple stopPropagation :stop', '<a onEvent:stop={this.action1} />')
snapshotTest('Simple preventDefault :prevent', '<a onEvent:prevent={this.action1} />')
snapshotTest('Simple :self', '<a onEvent:self={this.action1} />')
snapshotTest('Simple no-key-modifier :bare', '<a onEvent:bare={this.action1} />')
snapshotTest('Simple key-modifier :shift', '<a onEvent:shift={this.action1} />')
snapshotTest(
  'No key modifier but alt and shift and must be both alt and shift :bare-alt-shift',
  '<a onEvent:bare-alt-shift={this.action1} />',
)
snapshotTest('Simple alias :enter', '<a onEvent:enter={this.action1} />')
snapshotTest('Simple double alias :delete', '<a onEvent:delete={this.action1} />')
snapshotTest('Simple key code :k120', '<a onEvent:k120={this.action1} />')

// TSX support
snapshotTest('- prefix -bare-alt-shift', '<a onEvent-bare-alt-shift={this.action1} />')
