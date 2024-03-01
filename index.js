import { FreezeTable /* freezeTableCall */ } from './src/freezeTable.js';

// freezeTableCall('my-table', { scrollable: true });
// freezeTableCall('my-table-2');
// freezeTableCall('my-table-3');
// freezeTableCall('my-table-2', { freezeHead: false, freezeColumn: true });
const myTable = new FreezeTable('my-table', {
  fixedNavbar: 'navbar',
  scrollBar: true,
  scrollable: true,
});
console.log(myTable.options);
