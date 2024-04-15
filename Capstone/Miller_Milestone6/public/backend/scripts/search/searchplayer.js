// Create Player box for Player
var PlayerBox = React.createClass({
  getInitialState: function () {
    return { data: [], loginData: [], viewThePageTM: 0 };
  },
  loadPlayersFromServer: function () {
    // Connect to database
    $.ajax({
      url: "/selectPlayers",
      data: {
        playerFNameTM: playerFNameTM.value,
        playerLNameTM: playerLNameTM.value,
        playerEAddressTM: playerEAddressTM.value,
        playerPNumberTM: playerPNumberTM.value,
        playerRewardTM: rewardTypeTM.value,
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

  // Get the Role Id to see if user can interact with the page
  loadAllowLogin: function () {
    $.ajax({
      url: "/getUserLoggedIn",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ loginData: datalog });
        this.setState({ viewThePageTM: this.state.loginData[0].dbroleid });
        this.loadPlayersFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if items are loaded from server
  componentDidMount: function () {
    this.loadAllowLogin();
  },

  // Render the box to HTML
  render: function () {
    // If User Doesn't have a token, or if there was a token error. Hide links and allow user to sign in again
    if (
      this.state.viewThePageTM == 0 ||
      (this.state.viewThePageTM != 1 && this.state.viewThePageTM != 2)
    ) {
      return (
        <div className="permissionErrorContainer">
          <span>
            Sorry! You don't have permission to interact with this page!
          </span>
        </div>
      );
    } else {
      return (
        <div>
          <h1>View Players</h1>
          {/* Show the form */}
          <PlayerForm onPlayerSubmit={this.loadPlayersFromServer} />
          <br />
          {/* Create Table and put data from database into here (Use the List) */}
          <table id="resultData">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Reward Status</th>
              </tr>
            </thead>
            <PlayerList data={this.state.data} />
          </table>
        </div>
      );
    }
  },
});

// Create Form for page
var PlayerForm = React.createClass({
  // Get Reward Data
  loadRewards: function () {
    $.ajax({
      url: "/getRewards",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ playerRewardDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadRewards();
  },

  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      playerFNameTM: "",
      playerLNameTM: "",
      playerEAddressTM: "",
      playerPNumberTM: "",
      playerRewardDataTM: [],
    };
  },

  // Handle the change when the user interacts with Radio button
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    // Get the values from the input fields
    var playerFNameTM = this.state.playerFNameTM.trim();
    var playerLNameTM = this.state.playerLNameTM.trim();
    var playerEAddressTM = this.state.playerEAddressTM.trim();
    var playerPNumberTM = this.state.playerPNumberTM.trim();
    var playerRewardTM = rewardTypeTM.value;

    // Use Values in Text boxes to submit to database
    this.props.onPlayerSubmit({
      playerFNameTM: playerFNameTM,
      playerLNameTM: playerLNameTM,
      playerEAddressTM: playerEAddressTM,
      playerPNumberTM: playerPNumberTM,
      playerRewardTM: playerRewardTM,
    });
  },
  // Update the value for variable when user interacts with input
  handleChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  // Render the form
  render: function () {
    return (
      // Create HTML Form
      <form onSubmit={this.handleSubmit} className="formContainer">
        {/* Create Header */}
        <h2>Search a Player</h2>
        {/* Create Table to hold form */}
        <table>
          <tbody>
            {/* Display Player's First Name for Input */}
            <tr>
              <th>Player's First Name</th>
              <td>
                <input
                  type="text"
                  name="playerFNameTM"
                  id="playerFNameTM"
                  value={this.state.playerFNameTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Player's Last Name for Input */}
            <tr>
              <th>Player's Last Name</th>
              <td>
                <input
                  type="text"
                  name="playerLNameTM"
                  id="playerLNameTM"
                  value={this.state.playerLNameTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Player's Email Address for Input */}
            <tr>
              <th>Player's Email Address</th>
              <td>
                <input
                  name="playerEAddressTM"
                  id="playerEAddressTM"
                  value={this.state.playerEAddressTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Player's Phone Number for Input */}
            <tr>
              <th>Player's Phone Number</th>
              <td>
                <input
                  name="playerPNumberTM"
                  id="playerPNumberTM"
                  value={this.state.playerPNumberTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display Select Box for Reward Types */}
            <tr>
              <th>Player's Reward Type</th>
              <td>
                <SelectListRewardStatus data={this.state.playerRewardDataTM} />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Submit button to Search Player */}
        <input type="submit" value="Search Player" id="buttonSubmit" />
      </form>
    );
  },
});

// Display Player Information
var PlayerList = React.createClass({
  // Render in data for database
  render: function () {
    var playerNodes = this.props.data.map(function (playerTM) {
      //map the data
      return (
        <Player
          key={playerTM.dbplayerid}
          rewardKey={playerTM.dbrewardid}
          playFNameTM={playerTM.dbplayerfirstname}
          playLNameTM={playerTM.dbplayerlastname}
          playEAddressTM={playerTM.dbplayeremailaddress}
          playPNumberTM={playerTM.dbplayerphonenumber}
          playRewardTM={playerTM.dbrewardname}
        ></Player>
      );
    });

    //Print all the nodes in the list
    return <tbody>{playerNodes}</tbody>;
  },
});

var Player = React.createClass({
  render: function () {
    //Display info
    return (
      <tr>
        <td>{this.props.playFNameTM}</td>
        <td>{this.props.playLNameTM}</td>
        <td>{this.props.playEAddressTM}</td>
        <td>{this.props.playPNumberTM}</td>
        <td>{this.props.playRewardTM}</td>
      </tr>
    );
  },
});

// Select List for Rewards
var SelectListRewardStatus = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (rewardTypesTM) {
      return (
        <option
          key={rewardTypesTM.dbrewardid}
          value={rewardTypesTM.dbrewardname}
        >
          {rewardTypesTM.dbrewardname}
        </option>
      );
    });
    return (
      <select name="rewardTypeTM" id="rewardTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Place items into element Id named content
ReactDOM.render(<PlayerBox />, document.getElementById("content"));
