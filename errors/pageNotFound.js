class PageNotFound extends Error {
  constructor(path) {
    super(`Page not found: ${path}`);
    this.name = "PageNotFound";
    this.statusCode = 404;
  }
}

export default PageNotFound;
