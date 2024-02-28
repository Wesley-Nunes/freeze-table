# Freeze Table

Freeze head and columns.

## Table of Contents

-   [How to use](#how-to-use)

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
import { freezeTableCall } from "freezeTable";

freezeTableCall("my-freeze-table");
```

#### Using the Class

It's useful when you need table manipulations after the creation.

```js
import { FreezeTable } from "freezeTable";

const options = {};
const myFreezeTable = new FreezeTable("my-freeze-table", options);
```

> The parameter [options](####options) are optional. It loads the configuration options of the table.

#### Options

Options could be passed via JavaScript with object.

| Name       | Type    | Default | Description                |
| :--------- | :------ | :------ | :------------------------- |
| freezeHead | boolean | true    | Enable to freeze `<thead>` |
