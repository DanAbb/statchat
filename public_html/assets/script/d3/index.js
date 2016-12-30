import * as d3 from "d3";
import * as colors from 'd3-scale-chromatic';
import DataWidget from '../helpers/data';
import queryStringParser from '../helpers/query-string-parser';

class PieChart extends DataWidget {
   constructor(element) {
      super();
      this.element = element;
      this.gw = '0';

      if (this.element) {
         this.listen();
         this.getData();
      }
   }

   listen() {
      const selectors = this.element.querySelectorAll('.gw-selector');

      for (const selector of selectors) {
         selector.addEventListener('click', ev => {
            this.gw = selector.dataset.gw;
            this.getData();
         });
      }
   }

   getUrl() {
      if (window.location.hostname === 'statchat.dev') {
         return `http://localhost:3000/api/gw/${this.gw}`;
      } else {
         return `http://fplchat.com/api/gw/${this.gw}`;
      }
   }

   getData() {
      this.fetch(`${this.getUrl()}`)
      .then(response => {
         this.searchPlayer(response);
      }).catch(err => this.handleErrors(err));
   }

   handleErrors(err) {
      this.element.querySelector('.total-points').innerHTML = '';
      this.element.querySelector('#chart').innerHTML = '<h1>Ain\'t got no data yet bro!</h1>';
   }

   searchPlayer(res) {
      const searchTerm = this.getSearchTerm();
      for (const player of res) {
         if (player.Name.toLowerCase().includes(searchTerm.toLowerCase())) {
            const dataset = this.getSchema(player);
            this.element.querySelector('#chart').innerHTML = '';
            this.build(dataset);
            if (this.gw === '0') {
               this.element.querySelector('.player-name').innerHTML = `${player.Name} Overall Points`;
            } else {
               this.element.querySelector('.player-name').innerHTML = `${player.Name} GW${this.gw} Points`;
            }
            this.element.querySelector('.total-points').innerHTML = `Total Points: <span class="red">${player.Total}</span>`;
            break;
         } else {
            this.element.querySelector('.player-name').innerHTML = '';
            this.element.querySelector('.total-points').innerHTML = 'Can\'t find player or got no data. Check your spelling yo or come back later!';
            this.element.querySelector('#chart').innerHTML = '';
         }
      }
   }

   getSearchTerm() {
      const queryString = window.location.search;
      const queryStringObject = queryStringParser(queryString);
      const str = queryStringObject.player.split("+");
      let newStr = '';
      for (let i = 0; i < str.length; i++) {
         if (i+1 === str.length) {
            newStr += `${str[i]}`;
         } else {
            newStr += `${str[i]} `;
         }
      }
      return newStr;
   }

   getSchema(player) {
      const points = {
         Goals: 15,
         Assists: 7,
         ShotsOnTarget: 5,
         ChancesCreated: 3,
         TacklesWon: 2,
         ShotsBlocked: 2,
         Interceptions: 1.5,
         Clearances: 1,
         FoulWon: 0.5,
         Passes: 0.05
      };

      return [
      { label: "Goals", count: player.Goals * points.Goals, enabled: true },
      { label: "Assists", count: player.Assists * points.Assists, enabled: true },
      { label: "ShotsOnTarget", count: player.ShotsOnTarget * points.ShotsOnTarget, enabled: true },
      { label: "ChancesCreated", count: player.ChancesCreated * points.ChancesCreated, enabled: true },
      { label: "TacklesWon", count: player.TacklesWon * points.TacklesWon, enabled: true },
      { label: "ShotsBlocked", count: player.ShotsBlocked * points.ShotsBlocked, enabled: true },
      { label: "Interceptions", count: player.Interceptions * points.Interceptions, enabled: true },
      { label: "Clearances", count: player.Clearances * points.Clearances, enabled: true },
      { label: "FoulsWon", count: player.FoulsWon * points.FoulsWon, enabled: true },
      { label: "Passes", count: player.Passes * points.Passes, enabled: true }
      ];
   }

   getLabel(label) {
      const arr = label.split(/(?=[A-Z])/);
      let newLabel = '';
      for (let i = 0; i < arr.length; i++) {
         newLabel += arr[i] + ' ';
      }

       return newLabel;
   }

   build(dataset) {
      const windowWidth = window.innerWidth;
      if (windowWidth < 600) {
         var width = 320;
         var height = 320;
         var donutWidth = 40;
         var legendRectSize = 16;
         var legendSpacing = 4;
      } else {
         var width = 600;
         var height = 600;
         var donutWidth = 100;
         var legendRectSize = 25;
         var legendSpacing = 6;
      }
      var radius = Math.min(width, height) / 2;
      const _this = this;

      var color = d3.scaleOrdinal(colors.schemePaired);

      var svg = d3.select('#chart')
         .append('svg')
         .attr('width', width)
         .attr('height', height)
         .append('g')
         .attr('transform', 'translate(' + (width / 2) + 
         ',' + (height / 2) + ')');

      var arc = d3.arc()
         .innerRadius(radius - donutWidth)
         .outerRadius(radius);

      var pie = d3.pie()
         .value(function(d) { return d.count; })
         .sort(null);

      var tooltip = d3.select('#chart')
         .append('div')
         .attr('class', 'tooltip');

      tooltip.append('div')
         .attr('class', 'label');

      tooltip.append('div')
         .attr('class', 'count');

      tooltip.append('div')
         .attr('class', 'percent');

      var path = svg.selectAll('path')
         .data(pie(dataset))
         .enter()
         .append('path')
         .attr('d', arc)
         .attr('fill', function(d, i) {
            return color(d.data.label);
         })
         .each(function(d) { this._current = d; });

      path.on('mouseover', function(d) {
         var total = d3.sum(dataset.map(function(d) {
            return (d.enabled) ? d.count : 0;
         }));
         var percent = Math.round(1000 * d.data.count / total) / 10;
         tooltip.select('.label').html(`<span class="tooltip-head">${_this.getLabel(d.data.label)}</span>`);
         tooltip.select('.count').html(d.data.count + ' Points');
         tooltip.select('.percent').html(percent + '%');
         tooltip.style('visibility', 'visible');
         tooltip.style('opacity', '1');
      });

      path.on('mouseout', function() {
         tooltip.style('visibility', 'hidden');
         tooltip.style('opacity', '0');
      });

      var legend = svg.selectAll('.legend')
         .data(color.domain())
         .enter()
         .append('g')
         .attr('class', 'legend')
         .attr('transform', function(d, i) {
            var height = legendRectSize + legendSpacing;
            var offset =  height * color.domain().length / 2;
            if (windowWidth < 600) {
               var horz = -2 * legendRectSize -20;
            } else {
               var horz = -2 * legendRectSize;
            }
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
         });

      legend.append('rect')
         .attr('width', legendRectSize)
         .attr('height', legendRectSize)
         .style('fill', color)
         .style('stroke', color)
         .on('click', function(label) {
            var rect = d3.select(this);
            var enabled = true;
            var totalEnabled = d3.sum(dataset.map(function(d) {
               return (d.enabled) ? 1 : 0;
            }));

      if (rect.attr('class') === 'disabled') {
         rect.attr('class', '');
      } else {
         if (totalEnabled < 2) return;
         rect.attr('class', 'disabled');
         enabled = false;
      }

      pie.value(function(d) {
         if (d.label === label) d.enabled = enabled;
         return (d.enabled) ? d.count : 0;
      });

      path = path.data(pie(dataset));

      path.transition()
         .duration(750)
         .attrTween('d', function(d) {
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
               return arc(interpolate(t));
            };
         });
      });

      legend.append('text')
         .attr('x', legendRectSize + legendSpacing)
         .attr('y', legendRectSize - legendSpacing)
         .text(function(d) { return d; });
   }
}

export default PieChart;