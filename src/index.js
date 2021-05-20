import { createUtils } from './utils';

export default ({
  types
}) => {
  const {
    getTypeParams,
    processForeach,
    processSlot,
    replaceLabel,
  } = createUtils(types);

  const visitor = {
    StringLiteral(path) {
      let isVariableProperty = false;
      try {
        isVariableProperty = path.parentPath.node.name.name === 'variable'
      } catch (error) {}
      if (isVariableProperty) {
        const params = (path.parentPath.node.value.value || '')
          .split(',')
          ;
        try {
          getTypeParams(params);
        } catch (error) {
          throw path.buildCodeFrameError(error);
        }
      }
    },
    JSXIdentifier(path) {
      replaceLabel(path, 'if', 'If');
      replaceLabel(path, 'elseif', 'Elseif');
      replaceLabel(path, 'else', 'Else');
      replaceLabel(path, 'condition', 'Condition');
      replaceLabel(path, 'foreach', 'Foreach');
    },
    JSXElement: {
      exit(path) {
        processForeach(path);
        processSlot(path);
      }
    }
  };

  return {
    visitor,
  };
}