import { FreezeTable, freezeTableCall } from './src/freezeTable.js';

freezeTableCall('my-table');
freezeTableCall('my-table-2');
const myTable = new FreezeTable('my-table-3');
console.log('myTable:', myTable);
