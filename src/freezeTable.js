const methodName = (k) => `build${k.charAt(0).toUpperCase() + k.slice(1)}`;
const getOuterHeight = (element) => {
  const style = window.getComputedStyle(element);
  const marginTop = parseFloat(style.marginTop);
  const marginBottom = parseFloat(style.marginBottom);
  return element.offsetHeight + marginTop + marginBottom;
};
/**
 * Options for configuring a FreezeTable instance.
 * @typedef {Object} Options
 * @property {string} [fixedNavbar=''] - ID of the fixed navbar for offset consideration e.g. navbar
 * @property {boolean} [freezeHead=true] - Enable to freeze <thead>.
 * @property {boolean} [freezeColumn=true] - Enable to freeze column(s).
 * @property {boolean} [freezeColumnHead=true] - Enable to freeze column(s) head (Entire column).
 * @property {boolean} [scrollBar=false] - Enable fixed scrollBar for X axis.
 * @property {boolean} [scrollable=false] - Enable Scrollable mode for inner scroll Y axis.
 * @property {integer} [columnBorderWidth=1] - The addon border width for freeze column(s).
 * @property {integer} [columnNum=1] - The number of column(s) for freeze.
 * @property {boolean} [columnKeep=false]
 * @property {boolean} [shadow=false] - Enable default box-shadow UI.
 *  - Freeze column(s) will always be displayed to support interactive table.
 * @property {object} [headWrapStyles={}]
 *  - Customized CSS styles for freeze head(s) wrap. {marginTop: '4px'}.
 * @property {object} [columnWrapStyles={}]
 *  - Customized CSS styles for freeze column(s) wrap. {border: 'dashed red'}.
 * @property {object} [columnHeadWrapStyles={}]
 *  - Customized CSS styles for freeze column-head wrap. {'style': 'value'}.
 * @property {string} [backgroundColor='white']
 *  - Default table background color for Bootstrap transparent UI.
 */

const OPTIONS = {
  fixedNavbar: 'string',
  freezeHead: 'boolean',
  freezeColumn: 'boolean',
  freezeColumnHead: 'boolean',
  scrollBar: 'boolean',
  scrollable: 'boolean',
  columnBorderWidth: 'number',
  columnNum: 'number',
  columnKeep: 'boolean',
  shadow: 'boolean',
  headWrapStyles: 'object',
  columnWrapStyles: 'object',
  columnHeadWrapStyles: 'object',
  backgroundColor: 'string',
};
/**
 * Class representing a FreezeTable instance.
 */
export class FreezeTable {
  static initializedTables = {};

  defaultOptions = {
    fixedNavbar: '',
    freezeHead: true,
    freezeColumn: true,
    freezeColumnHead: true,
    scrollBar: false,
    scrollable: false,
    columnBorderWidth: 1,
    columnNum: 1,
    columnKeep: false,
    shadow: false,
    headWrapStyles: {},
    columnWrapStyles: {},
    columnHeadWrapStyles: {},
    backgroundColor: 'white',
  };

  container = window;

  headWrapper = document.createElement('div');

  columnWrapper = document.createElement('div');

  columnHeadWrapper = document.createElement('div');

  scrollBarWrapper = document.createElement('div');

  /**
   * Creates an instance of FreezeTable.
   * @param {string} id - The ID of the HTML table wrapper to attach the FreezeTable.
   * @param {Options} [options] - The options object to configure the FreezeTable instance.
   */
  constructor(id, options) {
    this.tableWrapper = document.querySelector(`#${id}`);
    [this.table] = this.tableWrapper.children;
    this.fixedNavbarHeight = 0;
    this.scrollBarHeight =
      window.innerWidth - document.documentElement.clientWidth;
    this.options = Object.assign(this.defaultOptions, options);
    this.validate();

    if (!this.options.scrollable) {
      this.tableWrapper.style.height = '100%';
      this.tableWrapper.style.minHeight = '100%';
      this.tableWrapper.style.mazHeight = '100%';
    }

    this.buildContainer();
    this.buildOptions();
    this.initEvents();
    FreezeTable.initializedTables[this.table.id] = true;
  }

  validate() {
    if (!this.table) {
      throw new Error(
        'Table element not found. Please provide a valid table ID.',
      );
    }
    if (FreezeTable.initializedTables[this.tableWrapper.id]) {
      throw new Error(
        `Table already initialized. ID: ${this.tableWrapper.id} Cannot initialize the same table multiple times.`,
      );
    }
    if (this.table.nodeName.toLowerCase() !== 'table') {
      throw new Error(
        `Element with ID ${this.table.id} is not a table element.`,
      );
    }
    if (!this.hasTbodyAndThead()) {
      throw new Error('Table must have both tbody and thead elements.');
    }
    if (this.validateOptionsObject()) {
      throw new Error(
        'Wrong key name or type. Please provide a valid key for the options object.',
      );
    }
    if (
      this.options.fixedNavbar &&
      !document.querySelector(`#${this.options.fixedNavbar}`)
    ) {
      throw new Error('Fixed Navbar not found. Please provide a valid ID.');
    }
  }

  hasTbodyAndThead() {
    let hasTbody = false;
    let hasThead = false;
    for (let i = 0; i < this.table.childNodes.length; i += 1) {
      const node = this.table.childNodes[i];
      if (node.nodeName.toLowerCase() === 'tbody') {
        hasTbody = true;
      }
      if (node.nodeName.toLowerCase() === 'thead') {
        hasThead = true;
      }
    }
    return hasTbody && hasThead;
  }

  validateOptionsObject() {
    const hasInvalidOption = Object.entries(this.options).some(
      ([option, value]) => {
        const receivedType = typeof value;
        const expectedType = OPTIONS[option];
        return receivedType !== expectedType;
      },
    );

    return hasInvalidOption;
  }

  buildOptions() {
    Object.keys(this.options).forEach((element) => {
      if (this.options[element]) {
        const method = methodName(element);
        if (typeof this[method] === 'function') {
          this[method]();
        }
      }
    });
  }

  buildFreezeHead() {
    const tableClone = this.table.cloneNode(true);

    this.headWrapper.classList.add('header-wrapper');
    this.headWrapper.append(tableClone);
    this.headWrapper.style.top = `${this.fixedNavbarHeight}px`;

    tableClone.style.backgroundColor = this.options.backgroundColor;

    if (this.options.shadow) {
      this.headWrapper.style.boxShadow =
        '0px 6px 10px -5px rgba(159, 159, 160, 0.8)';
    }

    if (Object.keys(this.options.headWrapStyles).length) {
      Object.entries(this.options.headWrapStyles).forEach(([key, value]) => {
        this.headWrapper.style[key] = value;
      });
    }

    this.tableWrapper.append(this.headWrapper);

    this.tableWrapper.addEventListener('scroll', () => {
      this.headWrapper.scrollLeft = this.tableWrapper.scrollLeft;
    });

    if (this.options.scrollable) {
      const handler = () => {
        const { top } = this.tableWrapper.getBoundingClientRect();
        if (this.tableWrapper.scrollTop > 0 && top > this.fixedNavbarHeight) {
          this.headWrapper.style.top = `${top}px`;
          this.headWrapper.style.visibility = 'visible';
        } else {
          this.headWrapper.style.visibility = 'hidden';
        }
      };

      this.tableWrapper.addEventListener('scroll', handler);
      this.container.addEventListener('scroll', handler);
    } else if (this.container === window) {
      this.container.addEventListener('scroll', () => {
        const topPosition = this.container.scrollY + this.fixedNavbarHeight;
        const tableTop = this.table.offsetTop - 1;

        if (
          tableTop - 1 <= topPosition &&
          tableTop + this.table.offsetHeight - 1 >= topPosition
        ) {
          this.headWrapper.style.visibility = 'visible';
        } else {
          this.headWrapper.style.visibility = 'hidden';
        }
      });
    }

    const resizeHeadWrapper = () => {
      const headWrapWidth = this.options.scrollable
        ? this.tableWrapper.offsetWidth - this.scrollBarHeight
        : this.tableWrapper.offsetWidth;
      const adjustedWidth =
        headWrapWidth > 0 ? headWrapWidth : this.tableWrapper.offsetWidth;

      this.headWrapper.style.width = `${adjustedWidth}px`;
      this.headWrapper.style.height = `${
        this.table.querySelector('thead').offsetHeight
      }px`;
    };

    this.container.addEventListener('resize', resizeHeadWrapper);

    // observer the resize changes
    const resizeObserver = new ResizeObserver(resizeHeadWrapper);
    resizeObserver.observe(this.tableWrapper);
  }

  buildFreezeColumn() {
    const tableClone = this.table.cloneNode(true);

    this.columnWrapper.classList.add('column-wrapper');
    this.columnWrapper.append(tableClone);

    tableClone.style.backgroundColor = this.options.backgroundColor;

    const defaultColumnBorderWidth = this.options.shadow ? 0 : 1;
    const columnBorderWidth =
      this.options.columnBorderWidth || defaultColumnBorderWidth;

    if (this.options.shadow) {
      this.columnWrapper.style.boxShadow =
        '6px 0px 10px -5px rgba(159, 159, 160, 0.8)';
    }

    if (Object.keys(this.options.columnWrapStyles).length) {
      Object.entries(this.options.columnWrapStyles).forEach(([key, value]) => {
        this.columnWrapper.style[key] = value;
      });
    }

    this.tableWrapper.append(this.columnWrapper);

    this.tableWrapper.style.overflowX = 'scroll';

    const localizeWrap = () => {
      this.columnWrapper.style.top = `${
        this.tableWrapper.getBoundingClientRect().top
      }px`;
    };

    if (this.options.scrollable) {
      let columnWrapHeight =
        this.tableWrapper.clientHeight - this.scrollBarHeight;
      columnWrapHeight =
        columnWrapHeight > 0
          ? columnWrapHeight
          : this.tableWrapper.clientHeight;
      this.columnWrapper.style.height = `${columnWrapHeight}px`;
    }

    if (this.options.columnKeep) {
      this.columnWrapper.style.visibility = 'visible';
    }

    if (!this.options.columnKeep && this.options.scrollable) {
      const handleScroll = () => {
        if (this.tableWrapper.scrollLeft > 0) {
          this.columnWrapper.scrollTop = this.tableWrapper.scrollTop;
          this.columnWrapper.style.visibility = 'visible';
        } else {
          this.columnWrapper.style.visibility = 'hidden';
        }
      };

      this.tableWrapper.addEventListener('scroll', handleScroll);
    }

    if (!this.options.columnKeep && !this.options.scrollable) {
      this.tableWrapper.addEventListener('scroll', () => {
        if (this.isWindowScrollX) return;

        if (this.tableWrapper.scrollLeft > 0) {
          this.columnWrapper.style.visibility = 'visible';
        } else {
          this.columnWrapper.style.visibility = 'hidden';
        }
      });
    }

    this.container.addEventListener('resize', () => {
      tableClone.style.width = `${this.table.clientWidth}px`;

      let width = 0 + columnBorderWidth;
      for (let i = 1; i <= this.options.columnNum; i += 1) {
        const th = this.table.querySelector(`th:nth-child(${i})`).offsetWidth;
        const addWidth = th;
        //   th > 0
        //     ? th
        //     : this.table.querySelector(`td:nth-child(${i})`).offsetWidth;
        width += addWidth;
      }
      this.columnWrapper.style.width = `${width}px`;

      localizeWrap();
    });

    this.container.addEventListener('scroll', localizeWrap);
  }

  buildFreezeColumnHead() {
    if (!this.options.freezeHead) {
      this.buildFreezeHead();
    }
    if (!this.options.freezeColumn) {
      this.buildFreezeColumn();
    }

    let detect;

    this.columnHeadWrapper = this.headWrapper.cloneNode(true);
    this.columnHeadWrapper.classList.add('column-header-wrapper');
    this.tableWrapper.append(this.columnHeadWrapper);

    if (this.options.shadow) {
      this.columnHeadWrapper.style.boxShadow = 'none';
    }

    if (Object.keys(this.options.columnHeadWrapStyles).length) {
      Object.entries(this.options.columnHeadWrapStyles).forEach(
        ([key, value]) => {
          this.columnHeadWrapper.style[key] = value;
        },
      );
    }

    if (this.options.scrollable) {
      detect = () => {
        const { top } = this.tableWrapper.getBoundingClientRect();
        if (this.tableWrapper.scrollTop > 0 && top > this.fixedNavbarHeight) {
          this.columnHeadWrapper.style.top = `${top}px`;
          this.columnHeadWrapper.style.visibility = 'visible';
        } else {
          this.columnHeadWrapper.style.visibility = 'hidden';
        }
      };

      this.tableWrapper.addEventListener('scroll', detect);
    } else if (this.container === window) {
      detect = () => {
        const topPosition = this.container.scrollY + this.fixedNavbarHeight;
        const tableTop = this.table.offsetTop - 1;
        const tableOuterHeight = getOuterHeight(this.table);

        if (
          tableTop - 1 <= topPosition &&
          tableTop + tableOuterHeight - 1 >= topPosition &&
          this.tableWrapper.scrollLeft > 0
        ) {
          this.columnHeadWrapper.style.visibility = 'visible';
        } else {
          this.columnHeadWrapper.style.visibility = 'hidden';
        }
      };
    }

    this.container.addEventListener('scroll', detect);
    this.tableWrapper.addEventListener('scroll', () => {
      if (!this.isWindowScrollX) {
        detect();
      }
    });

    this.container.addEventListener('resize', () => {
      const tableOfColumnHeadWrapper =
        this.columnHeadWrapper.querySelector('table');
      const tableStyle = window.getComputedStyle(this.table);
      const columnTableStyle = window.getComputedStyle(this.columnWrapper);
      const tHeadOfTable = this.table.querySelector('thead');
      const tHeadOfTableOuterHeight = getOuterHeight(tHeadOfTable);

      tableOfColumnHeadWrapper.style.width = tableStyle.width;
      this.columnHeadWrapper.style.width = columnTableStyle.width;
      this.columnHeadWrapper.style.height = `${tHeadOfTableOuterHeight}px`;
    });
  }

  buildScrollBar() {
    const tableStyle = window.getComputedStyle(this.table);
    const tableWrapperStyle = window.getComputedStyle(this.tableWrapper);
    const scrollBarContainer = document.createElement('div');

    scrollBarContainer.style.width = tableStyle.width;
    scrollBarContainer.style.height = '1px';

    this.scrollBarWrapper.classList.add('scroll-bar-wrapper');
    this.scrollBarWrapper.style.width = tableWrapperStyle.width;
    this.scrollBarWrapper.style.height = this.scrollBarHeight;

    this.scrollBarWrapper.append(scrollBarContainer);
    this.tableWrapper.append(this.scrollBarWrapper);

    this.scrollBarWrapper.addEventListener('scroll', () => {
      this.tableWrapper.scrollLeft = this.scrollBarWrapper.scrollLeft;
    });

    this.tableWrapper.addEventListener('scroll', () => {
      this.scrollBarWrapper.scrollLeft = this.tableWrapper.scrollLeft;
    });

    this.container.addEventListener('scroll', () => {
      const tHeadHeight = getOuterHeight(this.table.querySelector('thead'));
      const windowScrollTop =
        window.screenY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const bottomPosition =
        windowScrollTop + windowHeight - tHeadHeight + this.fixedNavbarHeight;
      const tableTop = this.table.getBoundingClientRect().top;
      const tableOuterHeight = getOuterHeight(this.table);

      if (
        tableTop - 1 <= bottomPosition &&
        tableTop + tableOuterHeight - 1 >= bottomPosition
      ) {
        this.scrollBarWrapper.style.visibility = 'visible';
      } else {
        this.scrollBarWrapper.style.visibility = 'hidden';
      }
    });

    this.container.addEventListener('resize', () => {
      scrollBarContainer.width = tableStyle.width;
      this.scrollBarWrapper.width = tableWrapperStyle.width;
    });
  }

  buildFixedNavbar() {
    if (this.options.fixedNavbar) {
      const navbar = document.querySelector(`#${this.options.fixedNavbar}`);
      this.fixedNavbarHeight = navbar.offsetHeight;
    }
  }

  buildContainer() {
    const detectHorizontalWindowScroll = () => {
      if (this.container.scrollLeft > 0) {
        this.isWindowScrollX = true;
        if (this.headTableWrap) {
          this.headTableWrap.style.visibility = 'hidden';
        }
        if (this.columnTableWrap) {
          this.columnTableWrap.style.visibility = 'hidden';
        }
        if (this.columnHeadTableWrap) {
          this.columnHeadTableWrap.style.visibility = 'hidden';
        }
        if (this.scrollBarWrap) {
          this.scrollBarWrap.style.visibility = 'hidden';
        }
      } else {
        this.isWindowScrollX = false;
      }
    };

    this.container.addEventListener('scroll', () => {
      detectHorizontalWindowScroll();
    });
  }

  initEvents() {
    const resizeEvent = new Event('resize');
    const scrollEvent = new Event('scroll');

    this.container.dispatchEvent(resizeEvent);
    this.container.dispatchEvent(scrollEvent);
    this.tableWrapper.dispatchEvent(scrollEvent);
  }
}

/**
 * Call the FreezeTable class for the specified HTML element.
 * @param {string} id - The ID of the HTML table element to attach the FreezeTable.
 * @param {Options} [options] - The options object to configure the FreezeTable instance.
 */
export const freezeTableCall = (id, options) => {
  // eslint-disable-next-line no-new
  new FreezeTable(id, options);
};
