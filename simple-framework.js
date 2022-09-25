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

/** SF ROUTER */
class SFRouter {
  constructor() {
    this._initRoutes();
    this.routeMap = [];
    this._prepareRouteMap();
  }

  _prepareRouteMap() {
    const routes = document.querySelectorAll("sf-route");
    routes.forEach((route) => {
      const routeName = route.getAttribute("route");
      const href = route.getAttribute("href");
      this.routeMap[routeName] = href;
    });
  }

  async loadPage(location) {
    const routerOutlet = document.getElementsByTagName("sf-router")[0];
    const htmlContents = await this._getHtmlContents(location);
    routerOutlet.innerHTML = htmlContents;
  }

  async _getHtmlContents(location) {
    const response = await fetch(location);
    const html = await response.text();
    return html;
  }

  goto(link) {
    const href = this.routeMap[link];
    this.loadPage(href);
  }

  _initRoutes() {
    const links = document.querySelectorAll("[to]");
    links.forEach((link) => {
      link.addEventListener("click", () => {
        this.goto(link.getAttribute("to"));
      });
    });
  }
}

window.addEventListener("load", () => {
  new SFRouter();
});
/** **/
