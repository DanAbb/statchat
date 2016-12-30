import fetch from '../helpers/fetch';
import DataWidget from '../helpers/data';
import Moment from 'moment';

class Stats extends DataWidget {
  constructor(element) {
    super();
    this.element = element;
    this.gameweek = this.element.dataset.gameweek;

    if (this.element) {
      this.getData();
    }
  }

  getUrl() {
    return `http://fplchat.com/api/gw/`;
  }

  getData() {
    this.fetch(`${this.getUrl()}${this.gameweek}`)
      .then(response => {
        this.renderStats(response);
      }).catch(err => this.handleErrors(err));
  }

  handleErrors(err) {
    console.log(err);
  }

  getTemplate() {
    const row = this.element.querySelector('.row-data');
    row.parentNode.removeChild(row);

    return row;
  }

  renderStats(stats) {
    const rowTemplate = this.getTemplate();
    const frag = document.createDocumentFragment();
    const body = this.element.querySelector('.stat-body');

    for (const stat of stats) {
      const row = rowTemplate.cloneNode(true);
      row.querySelector('.Total').innerHTML = stat.Total;
      row.querySelector('.Name').innerHTML = stat.Name;
      row.querySelector('.Team').innerHTML = stat.Team;
      row.querySelector('.Passes').innerHTML = stat.Passes;
      row.querySelector('.FoulsWon').innerHTML = stat.FoulsWon;
      row.querySelector('.Clearances').innerHTML = stat.Clearances;
      row.querySelector('.Interceptions').innerHTML = stat.Interceptions;
      row.querySelector('.ShotsBlocked').innerHTML = stat.ShotsBlocked;
      row.querySelector('.TacklesWon').innerHTML = stat.TacklesWon;
      row.querySelector('.ChancesCreated').innerHTML = stat.ChancesCreated;
      row.querySelector('.ShotsOnTarget').innerHTML = stat.ShotsOnTarget;
      row.querySelector('.Assists').innerHTML = stat.Assists;
      row.querySelector('.Goals').innerHTML = stat.Goals;
      row.querySelector('.OwnGoals').innerHTML = stat.OwnGoals;
      row.querySelector('.MissedPen').innerHTML = stat.MissedPen;
      row.querySelector('.RedCard').innerHTML = stat.RedCard;
      row.querySelector('.YellowCard').innerHTML = stat.YellowCard;

      frag.appendChild(row);
    }
    body.appendChild(frag);
  }
}

export default Stats;