import 'babel-polyfill';
// Parent constructors are not called in IE. ima.js polyfill with fix this issue.
import 'ima.js-babel6-polyfill';
import 'whatwg-fetch';
import WidgetFactory from './helpers/factory';
import Matches from './matches';
import Stats from './stats';
import PieChart from './d3';

document.addEventListener('DOMContentLoaded', () => {
  WidgetFactory.attach('.top-section', Matches);
  WidgetFactory.attach('.gw-stats', Stats);
  WidgetFactory.attach('.d3', PieChart);
});
