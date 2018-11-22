$(document).ready(() => {
    let league = $('#league').val();
    getTable(league);
    getMatches(league);
    compareTeams();


});


function getTable(league) {

    // get tables based on league
    $.ajax({
        headers: { 'X-Auth-Token': 'ac85114830314ff683770f93fc60ab92' },
        url: 'https://api.football-data.org/v2/competitions/' + league + '/standings',
        dataType: 'json',
        type: 'GET',
    }).done(function (response) {  
        console.log(response);

        // initialise table headings from data
        let table = response.standings[0].table;
        let output = `
            <tr class="col">
                <th>#</th>
                <th id="team">Team</th>
                <th>PL</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GD</th>
                <th>PTS</th>
            </tr>
        `;

        console.log(table);

        // iterate through teams and add them to the table
        $.each(table, (index, team) => {
            output += `
                <tr href="#" class="teams ${team.team.id}" onclick="getStats(${team.team.id})">
                    <td class="id">${team.team.id}</td>
                    <td class="right">${team.position}</td>
                    <td>${team.team.name}</td>
                    <td class="right">${team.playedGames}</td>
                    <td class="right">${team.won}</td>
                    <td class="right">${team.draw}</td>
                    <td class="right">${team.lost}</td>
                    <td class="right">${team.goalDifference}</td>
                    <td class="right">${team.points}</td>
                </tr> 
                <tr class="stats">
                    
                </tr>  
                
            `;
        });

        // get table class from html pages and add the table output
        $('.table').html(output);
    });

}



function getMatches(league) {
    // get todays date
    let date = new Date();
    let dd = date.getDate();
    let tm = date.getDate();
    let mm = date.getMonth() + 1; //January is 0!
    let yyyy = date.getFullYear();
    let today = yyyy + '-' + mm + '-' + dd;
    let tomorrow = yyyy + '-' + mm + '-' + tm;

    let months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    let thisMonth = months[date.getMonth()]; // getMonth method returns the month of the date (0-January :: 11-December)
    let days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let thisDay = days[date.getDay()];

    console.log(thisMonth);

    // get league matches by date
    console.log(today);
    $.ajax({
        headers: { 'X-Auth-Token': 'ac85114830314ff683770f93fc60ab92' },
        url: 'https://api.football-data.org/v2/matches?competitions=' + league + '&dateFrom=' + today + '&dateTo=' + today,
        dataType: 'json',
        type: 'GET',
    }).done(function (response) {
          
        console.log(response);

        let matches = response.matches;
        let output = `<h3>Todays Games - ${thisDay} ${dd} ${thisMonth}</h3>`;

        // output message if there are no games
        if (response.count == 0) {
            output += `<p>No Games Scheduled Today</p>`;
        } else {
            // iterate through matches on the day and add them to list
            $.each(matches, (index, match) => {
                output += `
                    <ul>
                        <a class="${match.homeTeam.id}" href="#" onmouseover="compareTeams(${match.homeTeam.id}, ${match.awayTeam.id})">
                            <li>
                                ${match.homeTeam.name}  vs  ${match.awayTeam.name}
                            </li>
                        </a>
                    </ul>
                    
                `;
            });
        }
        // output the matches to the html div
        $('.fixtures').html(output);
    });
}

function compareTeams(homeID, awayID) {
    // get the id of the teams per match and use the ids to find the teams in the table and highlight them
    let homeTeamID = '.' + homeID;
    let awayTeamID = '.' + awayID;

    let table = '.table ';
    let getHomeTeam = table + homeTeamID;
    let getAwayTeam = table + awayTeamID;


    $(getHomeTeam).addClass('highlight');
    $(getAwayTeam).addClass('highlight');

    $('.fixtures ul a').mouseout(() => {
        $('.table tr').removeClass('highlight');
    })

}


