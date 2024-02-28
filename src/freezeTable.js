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

  /**
   * Creates an instance of FreezeTable.
   * @param {string} id - The ID of the HTML table element to attach the FreezeTable.
   * @param {Options} [options] - The options object to configure the FreezeTable instance.
   */

  defaultOptions = {};

  constructor(id, options) {
    this.tableWrapper = document.querySelector(`#${id}`);
    [this.table] = this.tableWrapper.children;
    this.options = Object.assign(this.defaultOptions, options);
    this.validate();

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
