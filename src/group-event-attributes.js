export default t => (obj, attribute) => {
  if (t.isJSXSpreadAttribute(attribute)) {
    return obj
  }

  const isNamespaced = t.isJSXNamespacedName(attribute.get('name'))
  const event = (isNamespaced ? attribute.get('name').get('namespace') : attribute.get('name')).get('name').node
  const modifiers = isNamespaced ? new Set(attribute.get('name').get('name').get('name').node.split('-')) : new Set()

  if (event.indexOf('on') !== 0) {
    return obj
  }

  const value = attribute.get('value')

  attribute.remove()
  if (!t.isJSXExpressionContainer(value)) {
    return obj
  }

  const expression = value.get('expression').node

  let eventName = event.substr(2)
  if (eventName[0] === '-') {
    eventName = eventName.substr(1)
  }
  eventName = eventName[0].toLowerCase() + eventName.substr(1)
  if (modifiers.has('capture')) {
    eventName = '!' + eventName
  }
  if (modifiers.has('once')) {
    eventName = '~' + eventName
  }

  if (!obj[eventName]) {
    obj[eventName] = []
  }

  obj[eventName].push({ modifiers, expression, attribute })

  return obj
}
