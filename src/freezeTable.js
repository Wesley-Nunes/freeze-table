const methodName = (k) => `build${k.charAt(0).toUpperCase() + k.slice(1)}`;

/**
 * Options for configuring a FreezeTable instance.
 * @typedef {Object} Options
 * @property {string} [fixedNavbar=''] - ID of the fixed navbar for offset consideration e.g. navbar
 * @property {boolean} [freezeHead=true] - Enable to freeze <thead>.
 * @property {boolean} [freezeColumn=true] - Enable to freeze column(s).
 * @property {boolean} [freezeColumnHead=true] - Enable to freeze column(s) head (Entire column).
 * @property {boolean} [scrollBar=false] - Enable fixed scrollBar for X axis.
 * @property {boolean} [scrollable=false] - Enable Scrollable mode for inner scroll Y axis.
 */

const OPTIONS = {
  fixedNavbar: 'string',
  freezeHead: 'boolean',
  freezeColumn: 'boolean',
  freezeColumnHead: 'boolean',
  scrollBar: 'boolean',
  scrollable: 'boolean',
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
  };

  /**
   * Creates an instance of FreezeTable.
   * @param {string} id - The ID of the HTML table element to attach the FreezeTable.
   * @param {Options} [options] - The options object to configure the FreezeTable instance.
   */
  constructor(id, options) {
    this.tableWrapper = document.querySelector(`#${id}`);
    [this.table] = this.tableWrapper.children;
    this.fixedNavbarHeight = 0;
    this.scrollBarHeight = '16px'; // Need to create the correct logic, placeholder value
    this.options = Object.assign(this.defaultOptions, options);
    this.validate();
    this.buildOptions();

    if (!this.scrollable) {
      this.tableWrapper.style.height = '100%';
      this.tableWrapper.style.minHeight = '100%';
      this.tableWrapper.style.mazHeight = '100%';
    }

    // const detectWindowScroll () => {...}
    this.isWindowScrollX = true;

    FreezeTable.initializedTables[this.table.id] = true;
  }

  validate() {
    if (!this.table) {
      throw new Error(
        'Table element not found. Please provide a valid table ID.',
      );
    }
    if (FreezeTable.initializedTables[this.table.id]) {
      throw new Error(
        `Table already initialized. ID: ${this.table.id} Cannot initialize the same table multiple times.`,
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
    const headWrapper = document.createElement('div');
    const tableClone = this.table.cloneNode(true);

    headWrapper.classList.add('header-wrapper');
    headWrapper.append(tableClone);
    headWrapper.style.top = `${this.fixedNavbarHeight}px`;

    tableClone.classList.add([
      'table',
      'table-sm',
      'table-bordered',
      'table-striped',
    ]);
    tableClone.style.backgroundColor = 'white';

    if (this.options.shadow) {
      console.log('Applying shadow to the headWrapper');
    }

    if (this.options.headWrapStyles) {
      console.log('Applying headWrapStyles to the headWrapper');
    }

    this.tableWrapper.append(headWrapper);

    this.tableWrapper.addEventListener('scroll', () => {
      headWrapper.scrollLeft = this.tableWrapper.scrollLeft;
    });

    if (this.options.scrollable) {
      const handler = () => {
        const top = this.tableWrapper.offsetTop;

        if (this.tableWrapper.scrollTop > 0 && top > this.fixedNavbarHeight) {
          headWrapper.style.top = `${top}px`;
          headWrapper.style.visibility = 'visible';
        } else {
          headWrapper.style.visibility = 'hidden';
        }
      };

      this.tableWrapper.addEventListener('scroll', handler);

      // this.container.addEventListener("scroll", handler);
    } else if (this.options.container === window) {
      console.log(
        'update the position of the header when scrolling directly on the window',
      );
    } else {
      console.log(
        'update the position of the header when scrolling inside a container different of the window',
      );
    }
  }

  buildFreezeColumn() {
    const columnWrapper = document.createElement('div');
    const tableClone = this.table.cloneNode(true);

    columnWrapper.classList.add('column-wrapper');
    columnWrapper.append(tableClone);

    if (this.options.shadow) {
      console.log('Applying shadow to the columnWrapper');
    }

    if (this.options.headWrapStyles) {
      console.log('Applying headWrapStyles to the columnWrapper');
    }

    this.tableWrapper.append(columnWrapper);

    this.tableWrapper.style.overflowX = 'scroll';

    if (this.options.scrollable) {
      let columnTableWrapHeight =
        this.tableWrapper.clientHeight - this.scrollBarHeight;
      columnTableWrapHeight =
        columnTableWrapHeight > 0
          ? columnTableWrapHeight
          : this.tableWrapper.clientHeight;
      columnWrapper.style.height = `${columnTableWrapHeight}px`;
    }

    if (this.options.columnKeep) {
      console.log('handle column keep');
    }

    if (!this.options.columnKeep && this.options.scrollable) {
      const handleScroll = () => {
        if (this.tableWrapper.scrollLeft > 0) {
          columnWrapper.scrollTop = this.tableWrapper.scrollTop;
          columnWrapper.style.visibility = 'visible';
        } else {
          columnWrapper.style.visibility = 'hidden';
        }
      };

      // Listener - Table scroll for effecting Freeze Column
      this.tableWrapper.addEventListener('scroll', handleScroll);
    }

    if (!this.options.columnKeep && !this.options.scrollable) {
      this.tableWrapper.addEventListener('scroll', () => {
        if (this.isWindowScrollX) return;

        if (this.scrollLeft > 0) {
          columnWrapper.style.visibility = 'visible';
        } else {
          columnWrapper.style.visibility = 'hidden';
        }
      });
    }
  }

  buildFreezeColumnHead() {
    const columnHeadWrapper = document.createElement('div');
    const tableClone = this.table.cloneNode(true);

    const detect = () => {
      const windowTop = window.scrollY || document.documentElement.scrollTop;
      const tableTop = this.table.offsetTop - 1;

      if (
        tableTop <= windowTop &&
        tableTop + this.table.offsetHeight - 1 >= windowTop &&
        this.tableWrapper.scrollLeft > 0
      ) {
        this.columnHeadTableWrap.style.top = `${windowTop}px`;
        this.columnHeadTableWrap.style.visibility = 'visible';
      } else {
        this.columnHeadTableWrap.style.visibility = 'hidden';
      }
    };

    columnHeadWrapper.classList.add('column-header-wrapper');
    columnHeadWrapper.append(tableClone);
    columnHeadWrapper.style.top = `${this.tableWrapper.offsetTop}px`;

    tableClone.style.backgroundColor = 'white';

    if (this.options.shadow) {
      console.log('Applying shadow to the columnHeadWrapper');
    }

    if (this.options.columnHeadWrapperStyles) {
      console.log('Applying columnHeadWrapperStyles to the columnHeadWrapper');
    }

    this.tableWrapper.append(columnHeadWrapper);

    this.tableWrapper.addEventListener('scroll', () => {
      if (this.isWindowScrollX) return;

      detect();
    });

    if (this.options.scrollable) {
      this.tableWrapper.addEventListener('scroll', () => {
        detect();
      });
    } else if (this.options.container === window) {
      console.log(
        'update the position of the header when scrolling directly on the window',
      );
    } else {
      console.log(
        'update the position of the header when scrolling inside a container different of the window',
      );
    }
  }

  buildScrollBar() {
    // const tHeadHeight = this.table.querySelector('thead').offsetHeight;
    const scrollBarContainer = document.createElement('div');

    scrollBarContainer.style.width = this.table.offsetWidth;
    scrollBarContainer.style.height = '1px';

    // handle the detectWindowScroll objects

    this.tableWrapper.addEventListener('scroll', () => {
      // that.$scrollBarWrap.scrollLeft($(this).scrollLeft());
    });
  }

  buildFixedNavbar() {
    if (this.options.fixedNavbar) {
      const navbar = document.querySelector(`#${this.options.fixedNavbar}`);
      this.fixedNavbarHeight = navbar.offsetHeight;
    }
  }

  //   buildScrollable() {
  //     console.log(1);
  //   }
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
