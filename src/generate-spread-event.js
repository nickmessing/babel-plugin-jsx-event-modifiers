import generateBindingsList from './generate-bindings-list'

export default t => ([event, bindings]) => {
  const callbacks = generateBindingsList(t, bindings)
  return t.objectProperty(t.stringLiteral(event), callbacks.length === 1 ? callbacks[0] : t.arrayExpression(callbacks))
}
