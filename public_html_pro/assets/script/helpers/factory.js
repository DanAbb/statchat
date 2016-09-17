/**
 * Creates a new instance of `WidgetFactory` call `create` to create a new instance
 * of a widget, passing in the relevant parameters.
 * @param  {string}  selector - the className for the relevant widget
 * @param  {object}  WidgetName - the name of the Class you want to instantiate
 *                   default is `Widget`.
 * @return {object}  factory - the instance of the WidgetFactory.
 */
class WidgetFactory {
  static attach(selector, WidgetName, ...args) {
    this.elements = [...document.querySelectorAll(selector)];

    if (this.elements.length) {
      for (const element of this.elements) {
        new WidgetName(element, ...args);
      }
    }
  }
}

export default WidgetFactory;
