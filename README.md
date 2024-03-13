# Freeze Table

Freeze head and columns.

## Table of Contents

- [How to use](#how-to-use)

## <a name="how-to-use"></a>How to use

### Add a unique ID on the table wrapper element.

```html
<section id="my-table-wrapper">
  <table>
    <thead>
      <th>...</th>
    </thead>
    <tbody>
      <td>...</td>
    </tbody>
    <tbody></tbody>
  </table>
</section>
```

### Initialize via JavaScript

#### Using function call

It's useful when you don't need table manipulations after the creation.

```js
import { freezeTableCall } from 'freezeTable';

freezeTableCall('my-freeze-table');
```

#### Using the Class

It's useful when you need table manipulations after the creation.

```js
import { FreezeTable } from 'freezeTable';

const options = {};
const myFreezeTable = new FreezeTable('my-freeze-table', options);
```

> The parameter [options](####options) are optional. It loads the configuration options of the table.

#### Options

Options could be passed via JavaScript with object.

| Name                 | Type    | Default | Description                                                               |
| :------------------- | :------ | :------ | :------------------------------------------------------------------------ |
| fixedNavbar          | string  | ""      | ID of the fixed navbar for offset consideration. Example: `navbar`        |
| freezeHead           | boolean | true    | Enable to freeze `<thead>`                                                |
| freezeColumn         | boolean | true    | Enable to freeze column(s)                                                |
| freezeColumnHead     | boolean | true    | Enable to freeze column(s) head (Entire column)                           |
| scrollBar            | boolean | false   | Enable fixed scrollBar for X axis                                         |
| scrollable           | boolean | false   | Enable Scrollable mode for inner scroll Y axis                            |
| columnNum            | integer | 1       | The number of column(s) for freeze                                        |
| columnKeep           | boolean | false   | Freeze column(s) will always be displayed to support interactive table    |
| headWrapStyles       | object  | {}      | Customized CSS styles for freeze head(s) wrap. `{marginTop: '4px'}`       |
| columnWrapStyles     | object  | {}      | Customized CSS styles for freeze column(s) wrap. `{border: 'dashed red'}` |
| columnHeadWrapStyles | object  | {}      | Customized CSS styles for freeze column-head wrap. `{'style': 'value'}`   |
| backgroundColor      | string  | 'white' | Default table background color. `white`, `#FFFFFF`, `rgb(255,255,255,1)`  |
