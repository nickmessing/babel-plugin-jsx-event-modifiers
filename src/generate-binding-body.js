import { aliases, keyModifiers, keyCodeRE } from './constants'

export default (t, { modifiers, expression }) => {
  const callStatement = t.expressionStatement(
    t.callExpression(expression, [t.identifier('$event'), t.spreadElement(t.identifier('attrs'))]),
  )
  const result = []
  const conditions = []
  const keyConditions = [
    t.unaryExpression('!', t.binaryExpression('in', t.stringLiteral('button'), t.identifier('$event'))),
  ]

  modifiers.forEach(modifier => {
    if (modifier === 'stop') {
      result.push(
        t.expressionStatement(
          t.callExpression(t.memberExpression(t.identifier('$event'), t.identifier('stopPropagation')), []),
        ),
      )
    } else if (modifier === 'prevent') {
      result.push(
        t.expressionStatement(
          t.callExpression(t.memberExpression(t.identifier('$event'), t.identifier('preventDefault')), []),
        ),
      )
    } else if (modifier === 'self') {
      conditions.push(
        t.binaryExpression(
          '!==',
          t.memberExpression(t.identifier('$event'), t.identifier('target')),
          t.memberExpression(t.identifier('$event'), t.identifier('currentTarget')),
        ),
      )
    } else if (keyModifiers.includes(modifier)) {
      conditions.push(
        t.unaryExpression('!', t.memberExpression(t.identifier('$event'), t.identifier(`${modifier}Key`))),
      )
    } else if (modifier === 'bare') {
      conditions.push(
        keyModifiers
          .filter(keyModifier => !modifiers.has(keyModifier))
          .map(keyModifier => t.memberExpression(t.identifier('$event'), t.identifier(`${keyModifier}Key`)))
          .reduce((leftCondition, rightCondition) => t.logicalExpression('||', leftCondition, rightCondition)),
      )
    } else if (aliases[modifier]) {
      keyConditions.push(
        t.callExpression(t.memberExpression(t.thisExpression(), t.identifier('_k')), [
          t.memberExpression(t.identifier('$event'), t.identifier('keyCode')),
          t.stringLiteral(modifier),
          Array.isArray(aliases[modifier])
            ? t.arrayExpression(aliases[modifier].map(el => t.numericLiteral(el)))
            : t.numericLiteral(aliases[modifier]),
        ]),
      )
    } else if (modifier.match(keyCodeRE)) {
      const keyCode = +modifier.match(keyCodeRE)[1]
      keyConditions.push(
        t.binaryExpression(
          '!==',
          t.memberExpression(t.identifier('$event'), t.identifier('keyCode')),
          t.numericLiteral(keyCode),
        ),
      )
    }
  })

  if (keyConditions.length > 1) {
    conditions.push(
      keyConditions.reduce((leftCondition, rightCondition) => t.logicalExpression('&&', leftCondition, rightCondition)),
    )
  }

  if (conditions.length > 0) {
    result.push(
      t.ifStatement(
        conditions.reduce((leftCondition, rightCondition) => t.logicalExpression('||', leftCondition, rightCondition)),
        t.returnStatement(t.nullLiteral()),
      ),
    )
  }

  result.push(callStatement)
  return result
}
