import fetch from '../helpers/fetch';
import DataWidget from '../helpers/data';
import Moment from 'moment';

class Matches extends DataWidget {
  constructor(element) {
    super();
    this.element = element;

    if (this.element) {
      this.getData();
    }
  }

  getAuthToken() {
    return 'e3c73e048d714bb28a8286a9d92552cc';
  }

  getDataType() {
    return 'json';
  }

  getUrl() {
    const competition = this.getCompetition();
    return `http://api.football-data.org/v1/soccerseasons/${competition}/fixtures`;
  }

  getGameWeek() {
    const gameweek = this.element.querySelector('.gw').innerHTML;
    return `?matchday=${gameweek}`;
  }

  getCompetition() {
    const comp = this.element.querySelector('.comp').innerHTML;
    return comp;
  }

  getHeaders() {
    const matchHeaders = new Headers();
    matchHeaders.append('X-Auth-Token', this.getAuthToken());
    return matchHeaders;
  }

  getData() {
    this.fetch(`${this.getUrl()}${this.getGameWeek()}`)
      .then(response => {
        this.renderTodayFixtures(response.fixtures)
      }).catch(err => this.handleErrors(err));
  }

  handleErrors(err) {
    console.log(err);
  }

  getTemplate() {
    const match = this.element.querySelector('.fixture');
    match.parentNode.removeChild(match);

    return match;
  }

  renderTodayFixtures(fixtures) {
    const matchTemplate = this.getTemplate();
    const frag = document.createDocumentFragment();
    let count = 0;

    for (const fixture of fixtures) {
      const match = matchTemplate.cloneNode(true);
      const kickoff = new Moment(fixture.date);

      match.querySelector('.home').innerHTML = fixture.homeTeamName;
      match.querySelector('.away').innerHTML = fixture.awayTeamName;
      match.querySelector('.home-score').innerHTML = fixture.result.goalsHomeTeam || 0;
      match.querySelector('.away-score').innerHTML = fixture.result.goalsAwayTeam || 0;

      if (fixture.status === 'FINISHED') {
        match.querySelector('h3').classList.add('fulltime');
      } else if (fixture.status === 'TIMED') {
        match.querySelector('h3').innerHTML = `${kickoff.format('dddd')} at ${kickoff.format('LT')}`;
      }

      if (fixture.homeTeamName === "West Bromwich Albion FC") {
        match.querySelector('.home').classList.add('small-text');
      } else if (fixture.awayTeamName === "West Bromwich Albion FC") {
        match.querySelector('.away').classList.add('small-text');
      }

      frag.appendChild(match);
      count++;
    }

    this.element.querySelector('.js-stat-fixtures').style.width = `${count * 250}px`;
    this.element.querySelector('.js-stat-fixtures').appendChild(frag);
  }
}

export default Matches;