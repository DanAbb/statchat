(function(){

   function getFixtures() {
      $.ajax({
         headers: { 'X-Auth-Token': 'e3c73e048d714bb28a8286a9d92552cc' },
         url: 'http://api.football-data.org/v1/soccerseasons/426/fixtures',
         dataType: 'json',
         type: 'GET',
      }).done(function(response) {
         var fixtures = response.fixtures;

         yetToPlay(fixtures);
      });
   }

   function yetToPlay(fix) {
      for (var i in fix) {
         //check if games are today and compare with todays date
         var now = new Date();
         var then = new Date(fix[i].date);
         then.setHours(0,0,0,0);
         now.setHours(0,0,0,0);

         if (now.getTime() === then.getTime()) {
            appendMatch(fix[i]);
         }
      }
   }

   function appendMatch(match) {
      var homeTeam = match.homeTeamName;
      var awayTeam = match.awayTeamName;
      var homeGoals = match.result.goalsHomeTeam || "0";
      var awayGoals = match.result.goalsAwayTeam || "0";

      $('.fixtures').append('<div class="fixture"><h1>'+ homeTeam +'</h1> <h3>'+ homeGoals + ' : ' + awayGoals +'</h3> <h1>'+ awayTeam +'</h1></div>');
   }

   getFixtures();



})();

