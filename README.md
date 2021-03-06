# @loong-js/babel-plugin-transform-loong

Use Loong syntax to write react components.

`babel-plugin-transform-loong` is a plugin for babel which transpiles LSX syntax within template literals to JSX.

## ðĶ Installation

```bash
npm install --save-dev babel-plugin-syntax-jsx @loong-js/babel-plugin-transform-loong
```

Add the following line to your .babelrc file:

```json
{
  "plugins": [
    "@babel/plugin-syntax-jsx",
    "@loong-js/babel-plugin-transform-loong"
  ]
}
```

## ðĻ Usage

LSX syntax is a simplified version of JSX syntax. There are some JS features in LSX that cannot be used, such as rendering functions, loops, ternary, etc.

### Condition

```jsx
<condition>
  <if condition={data > 1}>This condition 1</if>
  <elseif condition={data === 2}>This condition 2</elseif>
  <else>This condition 3</else>
</condition>
```

To

```jsx
<Condition>
  <Condition.If condition={data > 1}>This condition 1</Condition.If>
  <Condition.Elseif condition={data === 2}>This condition 2</Condition.Elseif>
  <Condition.Else>This condition 3</Condition.Else>
</Condition>
```

### Foreach

```jsx
<foreach iterable={data} variable="item,index">
  <div>
    {item.name}-{index}
  </div>
</foreach>
```

To

```jsx
<Foreach>
  {(item, index) => (
    <div>
      {item.name}-{index}
    </div>
  )}
</Foreach>
```

## Slot

```jsx
<Component>
  <slot name="prefix">
    <div>åįž</div>
  </slot>
  // After adding the rendering property, enable the rendering function
  <slot rendering name="renderPrefix" variable="value">
    <div>{value}åįž</div>
  </slot>
</Component>
```

To

```jsx
<Component
  prefix={<div>åįž</div>}
  renderPrefix={(value) => <div>{value}åįž</div>}
/>
```

## ð Issues

If you find a bug, please file an issue on [our issue tracker on GitHub](https://github.com/loong-js/babel-plugin-transform-loong/issues).

## ð Changelog

Changes are tracked in the [CHANGELOG.md](https://github.com/loong-js/babel-plugin-transform-loong/blob/master/CHANGELOG.md).

## ð License

`babel-plugin-transform-loong` is available under the [MIT](https://github.com/loong-js/babel-plugin-transform-loong/blob/master/LICENSE) License.
