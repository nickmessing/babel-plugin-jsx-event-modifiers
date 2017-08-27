import syntaxJsx from 'babel-plugin-syntax-jsx'
import groupEventAttributes from './group-event-attributes'
import generateSpreadEvent from './generate-spread-event'

export default ({ types: t }) => ({
  inherits: syntaxJsx,
  visitor: {
    Program(path) {
      path.traverse({
        JSXOpeningElement(path) {
          const attributes = path.get('attributes')
          const groupedEventAttributes = attributes.reduce(groupEventAttributes(t), {})
          const events = Object.keys(groupedEventAttributes).map(key => [key, groupedEventAttributes[key]])
          if (events.length > 0) {
            path.pushContainer(
              'attributes',
              t.jSXSpreadAttribute(
                t.objectExpression([
                  t.objectProperty(t.identifier('on'), t.objectExpression(events.map(generateSpreadEvent(t)))),
                ]),
              ),
            )
          }
        },
      })
    },
  },
})
