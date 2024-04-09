// Create Player box for Player
var PlayerBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadPlayersFromServer: function () {
    // Connect to database
    $.ajax({
      url: "/getPlayers",
      data: {
        playerFirstNameTM: playerFirstNameTM.value,
        playerLastNameTM: playerLastNameTM.value,
        playerEmailAddressTM: playerEmailAddressTM.value,
        playerPhoneNumberTM: playerPhoneNumberTM.value,
      },

      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // Check to see if the Players is loaded
  componentDidMount: function () {
    this.loadPlayersFromServer();
  },

  // Render the PlayerBox to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>Players</h1>
        {/* Get PlayerSelectForm to put in Box */}
        <PlayerSelectForm onPlayerSubmit={this.loadPlayersFromServer} />
        <br />
        {/* Set Table to show Players */}
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          {/* Show list of Players */}
          <PlayerList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var PlayerSelectForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      playerDataTM: [],
      playerEAddressTM: "",
      playerPNumberTM: "",
      playerHDateTM: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },

  // Get Player Data
  loadPlayerNames: function () {
    $.ajax({
      url: "/getPlayerNames",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ playerDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadPlayerNames();
  },

  handleSubmit: function (e) {
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // Get the values from the input fields
    var playerFNameTM = playerFNameTypeTM.value;
    var playerLNameTM = playerLNameTypeTM.value;
    var playerEAddressTM = this.state.playerEAddressTM.trim();
    var playerPNumberTM = this.state.playerPNumberTM.trim();

    // Use Values in Text boxes to submit to database
    this.props.onPlayerSubmit({
      playerFNameTM: playerFNameTM,
      playerLNameTM: playerLNameTM,
      playerEAddressTM: playerEAddressTM,
      playerPNumberTM: playerPNumberTM,
    });
  },
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  // Render the form
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>View Players</h2>
        <table>
          <tbody>
            <tr>
              {/* Create Player Name Select List [Both First and Last] */}
              <th>Select Player First Name</th>
              <td>
                <SelectListPlayerFirstNames data={this.state.playerDataTM} />
              </td>
            </tr>
            <tr>
              {/* Create Player Name Select List [Both First and Last] */}
              <th>Select Player Last Name</th>
              <td>
                <SelectListPlayerLastNames data={this.state.playerDataTM} />
              </td>
            </tr>
            <tr>
              {/* Create Player E-Mail Input */}
              <th>Player E-Mail</th>
              <td>
                <input
                  name="playerEAddressTM"
                  id="playerEAddressTM"
                  value={this.state.playerEAddressTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              {/* Create Player Phone Number Input */}
              <th>Player Phone Number</th>
              <td>
                <input
                  name="playerPNumberTM"
                  id="playerPNumberTM"
                  value={this.state.playerPNumberTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Player" />
      </form>
    );
  },
});

// Place Items from Database to table
var PlayerList = React.createClass({
  render: function () {
    var playerNodes = this.props.data.map(function (playerTM) {
      //map the data to individual donations
      return (
        <Player
          key={playerTM.dbcustomerid}
          playFNameTM={playerTM.dbcustomerfirstname}
          playLNameTM={playerTM.dbcustomerlastname}
          playEAddressTM={playerTM.dbcustomeremailaddress}
          playPNumberTM={playerTM.dbcustomerphonenumber}
        ></Player>
      );
    });

    //print all the nodes in the list
    return <tbody>{playerNodes}</tbody>;
  },
});

var Player = React.createClass({
  // Render Each item in database
  render: function () {
    return (
      <tr>
        <td>{this.props.playFNameTM}</td>
        <td>{this.props.playLNameTM}</td>
        <td>{this.props.playEAddressTM}</td>
        <td>{this.props.playPNumberTM}</td>
      </tr>
    );
  },
});

// Select List for Players
var SelectListPlayerFirstNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (playerTypesTM) {
      return (
        <option
          key={playerTypesTM.dbcustomerid}
          value={playerTypesTM.dbcustomerid}
        >
          {playerTypesTM.dbcustomerfirstname}
        </option>
      );
    });
    return (
      <select name="playerFNameTypeTM" id="playerFNameTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Players
var SelectListPlayerLastNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (playerTypesTM) {
      return (
        <option
          key={playerTypesTM.dbcustomerid}
          value={playerTypesTM.dbcustomerid}
        >
          {playerTypesTM.dbcustomerlastname}
        </option>
      );
    });
    return (
      <select name="playerLNameTypeTM" id="playerLNameTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<PlayerBox />, document.getElementById("content"));
