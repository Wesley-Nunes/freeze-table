import { freezeTableCall } from './src/freezeTable.js';

freezeTableCall('table-basic-wrapper');

freezeTableCall('table-scrollable', { scrollable: true });

freezeTableCall('table-columns-only', {
  freezeHead: false,
  freezeColumnHead: false,
});

freezeTableCall('table-head-only', {
  freezeColumn: false,
  freezeColumnHead: false,
});

freezeTableCall('multi-columns', {
  columnNum: 2,
});

freezeTableCall('shadow-table', {
  shadow: true,
});

freezeTableCall('outside-head-styles', {
  headWrapStyles: { backgroundColor: 'bisque', paddingTop: '8px' },
});

freezeTableCall('outside-column-styles', {
  columnWrapStyles: { border: 'dashed red' },
});

freezeTableCall('outside-column-head-styles', {
  columnHeadWrapStyles: { backgroundColor: 'indianred', paddingLeft: '8px' },
});

freezeTableCall('scroll-bar-table', {
  scrollBar: true,
});
