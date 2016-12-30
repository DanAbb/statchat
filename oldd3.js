import * as d3 from "d3";
import * as colors from 'd3-scale-chromatic';
import DataWidget from '../helpers/data';
import queryStringParser from '../helpers/query-string-parser';

class PieChart extends DataWidget {
   constructor(element) {
      super();
      this.element = element;
      this.env = 'dev';

      if (this.element) {
         this.getData();
      }
   }

   getUrl() {
    if (this.env === 'dev') {
      return `http://localhost:3000/api/gw/0`;
    } else {
      return `http://fplchat.com/api/gw/0`;
    }
   }

   getData() {
      this.fetch(`${this.getUrl()}`)
         .then(response => {
            this.searchPlayer(response);
         }).catch(err => this.handleErrors(err));
   }

   handleErrors(err) {
      console.log(err);
   }

   searchPlayer(res) {
      const searchTerm = this.getSearchTerm();
      for (const player of res) {
         if (player.Name === searchTerm) {
            this.dataset = this.getSchema(player);
            this.build();
            this.element.querySelector('.player-name').innerHTML = searchTerm;
            this.element.querySelector('.total-points').innerHTML = `Total Points: ${player.Total}`;
            break;
         } else {
            this.element.querySelector('.player-name').innerHTML = 'Can\'t find player. Check your spelling yo!';
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

   build() {
    const _this = this;

    const options = {
      height: 600,
      width: 600,
      donutWidth: 100,
      radius: Math.min(this.width, this.height) / 2,
      legendRectSize: 25,
      legendSpacing: 6,
      color: _this.getColourScheme(),
      svg: _this.getSVG(this.height, this.width),
      arc: _this.getArc(this.radius, this.donutWidth),
      pie: _this.getPie()
    };

      this.buildPie(options);
   }

   getColourScheme() {
      return d3.scaleOrdinal(colors.schemePaired);
   }

   getSVG(height, width) {
      return d3.select('#chart')
         .append('svg')
         .attr('width', width)
         .attr('height', height)
         .append('g')
         .attr('transform', `translate(${width / 2},${height / 2})`);
   }

   getArc(radius, donutWidth) {
      return d3.arc()
         .innerRadius(radius - donutWidth)
         .outerRadius(radius);
   }

   getPie() {
      return d3.pie()
         .value(d => d.count)
         .sort(null);
   }

   buildPie(options) {
    radius = options.radius;
    color = options.color;
    svg = options.svg;
    arc = options.arc;
    pie = options.pie;

    const path = svg.selectAll('path')
      .data(pie(this.dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => color(d.data.label))
      .each(function(d) { this._current = d; });

    const tooltip = d3.select('#chart')
      .append('div')
      .attr('class', 'tooltip');

      tooltip.append('div')
      .attr('class', 'label');

      tooltip.append('div')
      .attr('class', 'count');

      tooltip.append('div')
      .attr('class', 'percent');

      path.on('mouseover', d => {
        const total = d3.sum(this.dataset.map(d => (d.enabled) ? d.count : 0));
        const percent = Math.round(1000 * d.data.count / total) / 10;
        tooltip.select('.label').html(`<span class="tooltip-head">${this.getLabel(d.data.label)}</span>`);
        tooltip.select('.count').html(d.data.count + ' Points');
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('visibility', 'visible');
        tooltip.style('opacity', '1');
      });

      path.on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
        tooltip.style('opacity', '0');
      });

      this.buildLegend(options, path);
   }

   getLabel(label) {
    const arr = label.split(/(?=[A-Z])/);
    let newLabel = '';
    for (let i = 0; i < arr.length; i++) {
      newLabel += arr[i] + ' ';
    }

    return newLabel;
   }

   buildLegend(options, path) {
    legendRectSize = options.legendRectSize;
    legendSpacing = options.legendSpacing;
    svg = options.svg;
    color = options.color;
    height = options.height;

      const legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => {
          var height = legendRectSize + legendSpacing;
          var offset =  height * color.domain().length / 2;
          var horz = -2 * legendRectSize;
          var vert = i * height - offset;
          return `translate(${horz},${vert})`;
        });

      legend.append('rect')
          .attr('width', legendRectSize)
          .attr('height', legendRectSize)
          .style('fill', color)
          .style('stroke', color)
          .on('click', function(label) {
            var rect = d3.select(this);
            var enabled = true;
            var totalEnabled = d3.sum(this.dataset.map(function(d) {
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

            path = path.data(pie(this.dataset));

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
         .text(d => d);
   }
}

export default PieChart;