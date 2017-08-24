import generateBindingBody from './generate-binding-body'

export default (t, bindings) => {
  return bindings.map(binding =>
    t.arrowFunctionExpression(
      [t.identifier('$event'), t.restElement(t.identifier('attrs'))],
      t.blockStatement(generateBindingBody(t, binding)),
    ),
  )
}
