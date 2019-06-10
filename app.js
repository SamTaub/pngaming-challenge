//Message that will display in the DOM that informs the user about the status of their search query
let loadingMessage;
//Clears the results of previous requests from the DOM to prevent information overflow
const clearRequestResults = () => {
  document.getElementById("requestResults").innerHTML = " ";
};
//Updates DOM to indicate that the response is loading and to wait for a response
const requestLoadingMessage = () => {
  loadingMessage = "Searching for arrests...";
  document.getElementById("requestStatusMessage").innerText = loadingMessage;
};
//Updates DOM to indicate that the data request has been completed
const requestCompletedMessage = () => {
  loadingMessage = "Search completed";
  document.getElementById("requestStatusMessage").innerText = loadingMessage;
};
//Fisher-Yates Shuffle Algorithm - rerranges the order of items displayed in the DOM (only works on list of teams)
//Credit: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = arr => {
  //If/Else conditional to validate that data exists to shuffle.  Prompts insturctional message if not
  if (arrestData.length) {
    const newArr = arr.slice();
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    currentData = newArr;
    clearRequestResults();
    currentData.map(teamData => {
      document.getElementById("requestResults").innerHTML += `
    <div class="card">
        <div class="card-header">
            ${teamData.Team_preffered_name}
        </div>
        <div class="card-body">
            <p>Conference: ${teamData.Team_Conference}</p>
            <p>Division: ${teamData.Team_Conference_Division}</p>
            <p>Number of Arrests: ${teamData.arrest_count}</p>
        <button type="button" class="btn btn-warning" id=${
          teamData.Team
        } onClick="getTeamArrests(this.id)">See arrests</button>
        </div>
    </div>
    `;
    });
  } else {
    document.getElementById("requestResults").innerHTML =
      "<h1 class='text-center'>No results to shuffle.  Press 'Get Arrests' to get started</h1>";
  }
};

//Empty array that holds the response returned from the API request
let arrestData = [];
//Holds the latest arrest data requested by the user
let currentData;
//Requests Arrest data and pushes the result into the arrestData array
const getArrestData = () => {
  //clears data to prevent duplicate information from displaying
  arrestData = [];
  fetch("http://nflarrest.com/api/v1/team/")
    //Clear previous results from DOM
    .then(clearRequestResults())
    //Update request status message with loading message
    .then(requestLoadingMessage())
    //Ensures the response is in JSON format
    .then(res => res.json())
    //Maps over the data to create readable card for team
    .then(res => {
      res.map(teamData => {
        document.getElementById("requestResults").innerHTML += `
              <div class="card">
                  <div class="card-header">
                      ${teamData.Team_preffered_name}
                  </div>
                  <div class="card-body">
                      <p>Conference: ${teamData.Team_Conference}</p>
                      <p>Division: ${teamData.Team_Conference_Division}</p>
                      <p>Number of Arrests: ${teamData.arrest_count}</p>
                  <button type="button" class="btn btn-warning" id=${
                    teamData.Team
                  } onClick="getTeamArrests(this.id)">See arrests</button>
                  </div>
              </div>
              `;
        //Push the data response into an array so that it can be used later
        arrestData.push(teamData);
      });
      //Update request status message indicating the search is completed
      requestCompletedMessage();
      //Sets the our current data to arrest data that was returned from the response
      currentData = arrestData;
    })
    .catch(err => console.log(err));
};
//Sorts arrest data by team conference (AFC or NFC).  There are 16 teams in each conference and 32 total teams in the NFL.
//Each teams respective conference is passed into this function on the button click.
const sortByConference = conf => {
  //If/Else condicational to validate that data exists.  Prompts the user instructional message if not.
  if (arrestData.length) {
    clearRequestResults();
    //Creates new array for our our filtered data to exist
    const arrestDataConference = arrestData.filter(
      team => team.Team_Conference === conf
    );
    //Sets our current data set to the filtered results
    currentData = arrestDataConference;
    //Maps over filtered arrest data to generate cards for the user to read
    arrestDataConference.map(teamData => {
      document.getElementById("requestResults").innerHTML += `
              <div class="card">
                  <div class="card-header">
                      ${teamData.Team_preffered_name}
                  </div>
                  <div class="card-body">
                      <p>Conference: ${teamData.Team_Conference}</p>
                      <p>Division: ${teamData.Team_Conference_Division}</p>
                      <p>Number of Arrests: ${teamData.arrest_count}</p>
                  <button type="button" class="btn btn-warning" id=${
                    teamData.Team
                  } onClick="getTeamArrests(this.id)">See arrests</button>
                  </div>
              </div>
              `;
    });
  } else {
    document.getElementById("requestResults").innerHTML =
      "<h1 class='text-center'>No results to sort.  Press 'Get Arrests' to get started</h1>";
  }
};
//Returns each player arrested and the number of times for the team the user clicks
const getTeamArrests = team => {
  //Sets the search query to the team passed in on the button click
  let query = team;
  fetch(`http://nflarrest.com/api/v1/team/topPlayers/${query}`)
    //Clears current results from DOM
    .then(clearRequestResults())
    //Displays loading message so user knows their request is loading and that they should wait
    .then(requestLoadingMessage())
    //Ensures response is in JSON format
    .then(res => res.json())
    //Map over the response and generate readable cards for the user.  Contains player name and # of arrests.
    .then(res => {
      res.map(teamData => {
        document.getElementById("requestResults").innerHTML += `
        <div class="card">
            <div class="card-header">
                ${teamData.Name}
            </div>
            <div class="card-body">
                <p>Number of Arrests: ${teamData.arrest_count}</p>
            </div>
        </div>
        `;
      });
      //Displays a message indicating that their search is completed.
      requestCompletedMessage();
    })
    .catch(err => console.log(err));
};
