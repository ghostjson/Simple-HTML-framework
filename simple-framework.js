/** SF INCLUDE */
class SFInclude extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    // load the html document using href attribute provided
    this.location = this.getAttribute("href");
    this._loadFromFile();
  }

  /**
   * Load HTML content
   */
  async _loadFromFile() {
    const response = await fetch(this.location);
    const html = await response.text();
    this.innerHTML = html;
  }
}

// define a new tag with this behaviour
customElements.define("sf-include", SFInclude);
/** **/

/** SF ROUTER */
class SFRouter {
  constructor() {
    // array of tuples contains all route name and it's corresponding path
    this.routeMap = [];

    // initialize routes
    this._initRoutes();

    // prepare route map array
    this._prepareRouteMap();

    // redirect the given route
    this._checkCurrentRoute();
  }

  /**
   * Fetch all links from the html document (has `to` attribute) then
   * add routing behaviour
   */
  _initRoutes() {
    // fetch all links
    const links = document.querySelectorAll("[to]");
    // add event listener to each link
    links.forEach((link) => {
      link.addEventListener("click", () => {
        this.goto(link.getAttribute("to"));
      });
    });
  }

  /**
   * Function for prepare route map table
   */
  _prepareRouteMap() {
    // fetch all routes
    const routes = document.querySelectorAll("sf-route");

    routes.forEach((route) => {
      const routeName = route.getAttribute("route");
      const href = route.getAttribute("href");
      this.routeMap[routeName] = href;

      // load page if there is a default
      if (route.hasAttribute("default")) {
        this.loadPage(href);
      }
    });
  }

  /**
   * Goto the specified link
   * (Link should be present inside routeMap)
   * @param {string} link key present inside routeMap
   * @param {boolean} history enable if route history needed -> default `true`
   */
  goto(link, history = true) {
    const href = this.routeMap[link];
    this.loadPage(href);

    if (history) {
      window.history.pushState({}, "", "#/" + link);
    }
  }

  /**
   * Load page from the given path and mount it to the <sf-router>
   * @param {*} location path of the HTML document
   */
  async loadPage(location) {
    const routerOutlet = document.getElementsByTagName("sf-router")[0];

    // load contents from html document
    const htmlContents = await this._getHtmlContents(location);

    // mount html content to the routerOutlet
    routerOutlet.innerHTML = htmlContents;

    // run each scripts inside html documents
    const scripts = routerOutlet.querySelectorAll("script");
    scripts.forEach((script) => {
      eval(script.innerText);
    });
  }

  /**
   * returns the HTML content from the given document path
   * @param {string} location path of the HTML document
   * @returns html document as string
   */
  async _getHtmlContents(location) {
    const response = await fetch(location);
    const html = await response.text();
    return html;
  }

  /**
   * Function to fetch document if path already given
   */
  _checkCurrentRoute() {
    const path = location.href;

    // check if the custom path given
    if (path.includes("#")) {
      const href = path.split("#/")[1];
      this.goto(href);
    }
  }
}

// load SFRouter after DOM loaded
window.addEventListener("DOMContentLoaded", () => {
  new SFRouter();
});
/** **/
