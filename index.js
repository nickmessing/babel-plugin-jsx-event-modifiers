module.exports = babel => {
  const t = babel.types
  const actions = {
    prevent:
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(
            t.identifier('event'),
            t.identifier('preventDefault')
          ),
          []
        )
      ),
    stop:
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(
            t.identifier('event'),
            t.identifier('stopPropagation')
          ),
          []
        )
      )
  }

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

  const generateCondition = keys => {
    const key = (keys.length === 1 ? keys[0] : (keys.length === undefined ? keys : false))
    if (key) {
      return t.binaryExpression(
        '===',
        t.memberExpression(
          t.identifier('event'),
          t.identifier('charCode')
        ),
        t.numericLiteral(key)
      )
    }
    const keyCode = keys.pop()
    return t.logicalExpression(
      '||',
      generateCondition(keys),
      generateCondition(keyCode)
    )
  }

  const generateConditionalExpression = (body, keys) => {
    return [t.ifStatement(
      generateCondition(keys),
      body
    )]
  }

  const generateExpressions = (value, modifier) => {
    if (actions[modifier] && !value) {
      return [actions[modifier]]
    }
    if (!value) {
      return
    }
    const body = t.expressionStatement(
      t.callExpression(
        value,
        [t.identifier('event')]
      )
    )
    if (actions[modifier]) {
      return [
        actions[modifier],
        body
      ]
    }
    if (aliases[modifier]) {
      return generateConditionalExpression(body, aliases[modifier])
    }
    if (/^k[0-9]*$/.test(modifier)) {
      return generateConditionalExpression(body, +modifier.substr(1))
    }
    return [body]
  }

  const transformAttribute = (attribute, events) => {
    const event = attribute.name.namespace.name
    const modifier = attribute.name.name.name
    const value = attribute.value ? attribute.value.expression : null
    if (!events[event]) {
      events[event] = []
    }
    events[event] = [...events[event], ...generateExpressions(value, modifier)]
  }

  return {
    inherits: require('babel-plugin-syntax-jsx'),
    visitor: {
      Program (path) {
        path.traverse({
          JSXOpeningElement (path) {
            const attributes = []
            const events = {}
            path.node.attributes.forEach(attribute => {
              if (attribute.name.type !== 'JSXNamespacedName' || attribute.name.namespace.name.indexOf('on') !== 0) {
                return attributes.push(attribute)
              }
              transformAttribute(attribute, events)
            })
            Object.entries(events).forEach(([event, body]) => {
              attributes.push(
                t.JSXAttribute(
                  t.JSXIdentifier(event),
                  t.JSXExpressionContainer(
                    t.arrowFunctionExpression(
                      [t.identifier('event')],
                      t.blockStatement(body)
                    )
                  )
                )
              )
            })
            path.node.attributes = attributes
          }
        })
      }
    }
  }
}
