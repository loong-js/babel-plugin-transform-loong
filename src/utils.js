const types = require('@babel/types');

export function replaceLabel(path, currentLabel, newLabel) {
  if (
    path.node.name === currentLabel && 
    (path.parent.type === 'JSXOpeningElement' || path.parent.type === 'JSXClosingElement')
  ) {
    path.node.name = newLabel;
  }
}
    
export function getTypeParams(params) {
  // TODO: 错误提示行和列 ([row], [col])
  const restRegexp = /^\.\.\.([^.]+)/;
  const hasRestRegexp = /\.\.\.([^.]+)/;
  const result = params.map(
    item => {
      item = item.trim();
      // item,,index 这种形式
      if (!item) {
        throw new Error('Unexpected token');
      }
      if (hasRestRegexp.test(item)) {
        if (restRegexp.test(item)) {
          return types.restElement(
            types.identifier(
              restRegexp.exec(item)[1]
            )
          );
        }
        // aaaa...args 这种形式
        throw new Error('Unexpected token, expected ","');
      }
      return types.identifier(item);
    }
  );
  // ...args, aaa 或者 ...args, ...args 这种形式
  if (result.some((typeParam, index) => types.isRestElement(typeParam) && index !== result.length - 1)) {
    throw new Error('Rest element must be last element.');
  }
  return result;
}
    
export function processForeach(path) {
  try {
    if (/^foreach$/i.test(path.node.openingElement.name.name)) {
      const node = path.node.children.find(child => child.type === 'JSXElement');
      if (!node) {
        const openingElement = path.node.openingElement;
        openingElement.attributes = openingElement.attributes.filter(attribute => attribute.name.name !== 'variable');
      }
    }
    if (/^foreach$/i.test(path.parentPath.node.openingElement.name.name)) {
      const foreachPath = path.parentPath.node.openingElement;
      const match = foreachPath.attributes.find(attribute => attribute.name.name === 'variable');
      const params = (match ? match.value.value : '').split(',');
      const newNode = types.jsxExpressionContainer(
        types.arrowFunctionExpression(
          getTypeParams(params),
          path.node,
        )
      );
      foreachPath.attributes = foreachPath.attributes.filter(attribute => attribute.name.name !== 'variable');
      path.replaceWith(newNode);
    }
  } catch (error) {}
}
    
export function processSlot(path) {
  try {
    if (path.node.openingElement.name.name === 'slot') {
      const slotAttributes = path.node.openingElement.attributes;
      const node = path.node.children.find(child => child.type === 'JSXElement');
      if (!node) {
        path.remove();
        return;
      }
      const rendering = slotAttributes.find(attribute => attribute.name.name === 'rendering');
      const name = slotAttributes.find(attribute => attribute.name.name === 'name');
      let newNode = node;
      if (rendering && rendering.value !== false) {
        const variable = slotAttributes.find(attribute => attribute.name.name === 'variable');
        const params = (variable ? variable.value.value : '').split(',');
        newNode = types.arrowFunctionExpression(
          getTypeParams(params),
          node,
        );
      }
      newNode = types.jsxExpressionContainer(newNode);
      const attributes = path.parentPath.node.openingElement.attributes;
      if (name && !attributes.find(attribute => attribute.name.name === name.value.value)) {
        const newAttributes = [...attributes, types.jsxAttribute(
          types.jsxIdentifier(name.value.value),
          newNode
        )];
        path.parentPath.node.openingElement.attributes = newAttributes;
      }
      path.remove();
    }
  } catch (error) {}
}