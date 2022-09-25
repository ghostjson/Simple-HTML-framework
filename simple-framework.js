/** SF INCLUDE */
class SFInclude extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.location = this.getAttribute("href");
    this._loadFromFile();
  }

  async _loadFromFile() {
    const response = await fetch(this.location);
    const html = await response.text();
    this.innerHTML = html;
  }
}

customElements.define("sf-include", SFInclude);
/** **/
