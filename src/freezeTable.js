const methodName = (k) => `build${k.charAt(0).toUpperCase() + k.slice(1)}`;

/**
 * Options for configuring a FreezeTable instance.
 * @typedef {Object} Options
 * @property {boolean} [freezeHead=true] - Enable to freeze <thead>.
 * @property {boolean} [freezeColumn=true] - Enable to freeze column(s).
 */
const OPTIONS = {
  freezeHead: 'boolean',
  freezeColumn: 'boolean',
};
/**
 * Class representing a FreezeTable instance.
 */
export class FreezeTable {
  static initializedTables = {};

  defaultOptions = {
    freezeHead: true,
    freezeColumn: true,
  };

  /**
   * Creates an instance of FreezeTable.
   * @param {string} id - The ID of the HTML table element to attach the FreezeTable.
   * @param {Options} [options] - The options object to configure the FreezeTable instance.
   */
  constructor(id, options) {
    this.tableWrapper = document.querySelector(`#${id}`);
    [this.table] = this.tableWrapper.children;
    this.options = Object.assign(this.defaultOptions, options);
    this.validate();
    this.buildOptions();

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
    headWrapper.style.top = `${this.tableWrapper.offsetTop}px`;

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
      console.log('make it scrollable on y axis');
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
      console.log('make it scrollable on y axis');
    }

    if (this.options.columnKeep) {
      console.log('handle column keep');
    }

    if (!this.options.columnKeep && this.options.scrollable) {
      console.log('make it scrollable for when columnKeep == false');
    }

    if (!this.options.columnKeep && !this.options.scrollable) {
      this.tableWrapper.addEventListener('scroll', () => {
        if (this.isWindowScrollX) return;

        if (this.scrollLeft > 0) {
          this.columnWrapper.style.visibility = 'visible';
        } else {
          this.columnWrapper.style.visibility = 'hidden';
        }
      });
    }
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
