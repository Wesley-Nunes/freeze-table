const methodName = (k) => `_build${k.charAt(0).toUpperCase() + k.slice(1)}`;

/**
 * Options for configuring a FreezeTable instance.
 * @typedef {Object} Options
 * @property {boolean} [freezeHead=true] - Enable to freeze <thead>.
 */

/**
 * Class representing a FreezeTable instance.
 */
export class FreezeTable {
  static initializedTables = {};

  defaultOptions = {
    freezeHead: true,
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
    const keys = Object.keys(this.options);
    let invalidKey = true;

    if (keys.length) {
      const optionsType = [{ name: 'freezeHead', type: 'boolean' }];
      optionsType.forEach((obj) => {
        if (keys.includes(obj.name)) {
          const validType = typeof this.options[obj.name];
          if (validType === obj.type) {
            invalidKey = false;
          }
        }
      });
    }

    return invalidKey;
  }

  buildOptions() {
    Object.keys(this.options).array.forEach((key) => {
      if (this.options[key]) {
        const method = methodName(key);
        if (typeof this[method] === 'function') {
          this[method]();
        }
      }
    });
  }

  buildFreezeHead() {
    // será se eu tenho que clonar para dar a impressão que o head é fixo
    // talvez eu tenha que criar um wrapper
    /**
     * 1 - Clone the table to handles the header, maybe clone only the head for performance
     *      maybe use web components, when handling the styles add the this.options.shadowBox
     *      and this.options.headWrapStyles
     * 2 - Add scroll event listener to the wrapper on the x axis
     * 3 - Check if is need to add/create the scroll to y axis
     * 4 - Check the container options, and create if need
     * 5 - Handle the case where scrollable is false and container is false
     * 6 - Add event listener to window resize
     */
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
