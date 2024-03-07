import { freezeTableCall } from './src/freezeTable.js';

freezeTableCall('table-basic-wrapper');

freezeTableCall('table-columns-only', {
  freezeHead: false,
  freezeColumnHead: false,
});

freezeTableCall('table-head-only', {
  freezeColumn: false,
  freezeColumnHead: false,
});
