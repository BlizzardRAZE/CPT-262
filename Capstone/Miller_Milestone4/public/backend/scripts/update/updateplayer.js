// Create Player box for Player
var PlayerBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadPlayersFromServer: function () {
    // Connect to database
    // To get data from table
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

  updateSinglePlayerFromServer: function (player) {
    // Connect to database
    // To push new updated data to table
    $.ajax({
      url: "/updateSinglePlayer",
      dataType: "json",
      data: player,
      type: "POST",
      cache: false,
      success: function (upSinglePlayerDataTM) {
        this.setState({ upSinglePlayerDataTM: upSinglePlayerDataTM });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },

  componentDidMount: function () {
    this.loadPlayersFromServer();
    // setInterval(this.loadPlayersFromServer, this.props.pollInterval);
  },

  // Render the box to HTML
  render: function () {
    return (
      <div>
        {/* Show the select form */}
        <h1>Update Player</h1>
        <PlayerSelectForm onPlayerSubmit={this.loadPlayersFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            {/* Create Table and put data from database into here (Use the List) */}
            <table id="resultData">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Reward Status</th>
                  <th></th>
                </tr>
              </thead>
              {/* Show data from database into list */}
              <PlayerList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            {/* Show the Update Form */}
            <PlayerUpdateForm
              onUpdateSubmit={this.updateSinglePlayerFromServer}
            />
          </div>
        </div>
      </div>
    );
  },
});

// Create Form for page
var PlayerSelectForm = React.createClass({
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
        <input type="submit" value="Search Player"  id="buttonSubmit"/>
      </form>
    );
  },
});

// Display Update Form
var PlayerUpdateForm = React.createClass({
  // Get Reward Data
  loadRewards: function () {
    $.ajax({
      url: "/getRewards",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ updatePlayerRewardDataTM: data });
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
      updatePlayeridTM: "",
      updatePlayerFNameTM: "",
      updatePlayerLNameTM: "",
      updatePlayerEAddressTM: "",
      updatePlayerPNumberTM: "",
      updatePlayerRewardDataTM: [],
    };
  },

  // Handle the change when the user interacts with Radio button
  handleUpOptionChange: function (e) {
    this.setState({
      upPlayerSelectedOptionTM: e.target.value,
    });
  },

  handleUpSubmit: function (e) {
    e.preventDefault();

    // Get the values from the input fields
    var updatePlayeridTM = upPlayeridTM.value;
    var updatePlayerFNameTM = upPlayerFNameTM.value;
    var updatePlayerLNameTM = upPlayerLNameTM.value;
    var updatePlayerEAddressTM = upPlayerEAddressTM.value;
    var updatePlayerPNumberTM = upPlayerPNumberTM.value;
    var updatePlayerRewardTM = upRewardTypeTM.value;

    // Validate the Players First and Last Names
    if (updatePlayerFNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter a First Name that is Larger than three Characters."
      );
      return;
    }

    if (updatePlayerLNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter a Last Name that is Larger than three Characters."
      );
      return;
    }

    // Validate the players Email Address
    if (!this.validateEmail(updatePlayerEAddressTM)) {
      // console.log("Bad Email Address => " + this.validateEmail(playerEAddressTM));
      // Show Error to User
      window.alert(
        "Please Enter a Valid Email address.\nExample:  John@email.com"
      );
      return;
    }

    // Validate Phone Number
    if (!this.phoneNumberValidate(updatePlayerPNumberTM)) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Phone Number in the given Format.\nExample (843)-555-5555"
      );
      return;
    }

    // Validate if the user selected an item from Role
    if (!this.validateSelectList(updatePlayerRewardTM)) {
      window.alert("Select a Reward.");
      return;
    }

    if (
      !updatePlayerFNameTM ||
      !updatePlayerLNameTM ||
      !updatePlayerEAddressTM ||
      !updatePlayerPNumberTM ||
      !updatePlayerRewardTM
    ) {
      // console.log("Field Missing");
      return;
    }

    // Show confirm button if user wants to processed with the update
    if (confirm("Are you sure you want to update record?") == true) {
      // Use Values in Text boxes to submit to database
      this.props.onUpdateSubmit({
        updatePlayeridTM: updatePlayeridTM,
        updatePlayerFNameTM: updatePlayerFNameTM,
        updatePlayerLNameTM: updatePlayerLNameTM,
        updatePlayerEAddressTM: updatePlayerEAddressTM,
        updatePlayerPNumberTM: updatePlayerPNumberTM,
        updatePlayerRewardTM: updatePlayerRewardTM,
      });

      // Show Message to User when data is updated
      window.alert("Player Updated!");
    } else {
      window.alert("Update Canceled!")
    }
  },

  //Regex to Validate Email Address
  validateEmail: function (value) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },

  // Regex to Validate Phone Number
  phoneNumberValidate: function (value) {
    var phoneRegex = /^[\(][0-9]{3}[\)][\-][0-9]{3}[\-][0-9]{4}$/im;
    return phoneRegex.test(value);
  },

  // Regex to check if user selected an item
  validateSelectList: function (userSelectedOption) {
    console.log(userSelectedOption);
    if (!userSelectedOption) {
      return false;
    } else {
      return true;
    }
  },

  // Set Common Validate for other Validations
  commonValidate: function () {
    return true;
  },

  // Update the value for variable when user interacts with input
  handleUpChange: function (event) {
    this.setState({
      test: console.log(event.target.id),
      [event.target.id]: event.target.value,
    });
  },

  // Render the form
  render: function () {
    return (
      <div>
        <div id="updateForm">
          <form onSubmit={this.handleUpSubmit}>
            <h2>Update Player Information</h2>
            <table>
              <tbody>
                {/* Display Player's First Name for Input */}
                <tr>
                  <th>Player's First Name</th>
                  <td>
                    <input
                      type="text"
                      name="upPlayerFNameTM"
                      id="upPlayerFNameTM"
                      value={this.state.upPlayerFNameTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display Player's Last Name for Input */}
                <tr>
                  <th>Player's Last Name</th>
                  <td>
                    <input
                      type="text"
                      name="upPlayerLNameTM"
                      id="upPlayerLNameTM"
                      value={this.state.upPlayerLNameTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display Player's Email Address for Input */}
                <tr>
                  <th>Player's Email Address</th>
                  <td>
                    <input
                      name="upPlayerEAddressTM"
                      id="upPlayerEAddressTM"
                      value={this.state.upPlayerEAddressTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display Player's Phone Number for Input */}
                <tr>
                  <th>Player's Phone Number</th>
                  <td>
                    <input
                      name="upPlayerPNumberTM"
                      id="upPlayerPNumberTM"
                      value={this.state.upPlayerPNumberTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display Select Box for Reward Types */}
                <tr>
                  <th>Player's Reward Type</th>
                  <td>
                    <SelectUpdateListRewardStatus
                      validate={this.validateSelectList}
                      data={this.state.updatePlayerRewardDataTM}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upPlayeridTM"
              id="upPlayeridTM"
              onChange={this.handleUpChange}
            />
            {/* Show Submit Button to Submit the form */}
            <input type="submit" value="Update Player" id="buttonSubmit"/>
          </form>
        </div>
      </div>
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
          playIdTM={playerTM.dbplayerid}
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
  getInitialState: function () {
    return {
      upPlayeridTM: "",
      singlePlayDataTM: [],
    };
  },

  // Get id from text box and pass it to function to populate input fields for update form
  updateRecord: function (e) {
    e.preventDefault();
    var theUpPlayidTM = this.props.playIdTM;

    this.loadSinglePlayer(theUpPlayidTM);
  },

  loadSinglePlayer: function (theUpPlayidTM) {
    $.ajax({
      url: "/selectSinglePlayer",
      data: {
        upPlayeridTM: theUpPlayidTM,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singlePlayDataTM: data });
        // console.log(this.state.singlePlayDataTM);

        // Get values from database and assign them to input fields to show
        var populatePlayer = this.state.singlePlayDataTM.map(function (player) {
          upPlayeridTM.value = theUpPlayidTM;
          upPlayerFNameTM.value = player.dbplayerfirstname;
          upPlayerLNameTM.value = player.dbplayerlastname;
          upPlayerEAddressTM.value = player.dbplayeremailaddress;
          upPlayerPNumberTM.value = player.dbplayerphonenumber;
          upRewardTypeTM.value = player.dbrewardid;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    //Display info
    return (
      <tr>
        {/* <td>{this.props.playIdTM}</td> */}
        <td>{this.props.playFNameTM}</td>
        <td>{this.props.playLNameTM}</td>
        <td>{this.props.playEAddressTM}</td>
        <td>{this.props.playPNumberTM}</td>
        <td>{this.props.playRewardTM}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" id="buttonSubmit"/>
          </form>
        </td>
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

// Select Update List for Rewards
var SelectUpdateListRewardStatus = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (updateRewardTypesTM) {
      return (
        <option
          key={updateRewardTypesTM.dbrewardid}
          value={updateRewardTypesTM.dbrewardid}
        >
          {updateRewardTypesTM.dbrewardname}
        </option>
      );
    });
    return (
      <select name="upRewardTypeTM" id="upRewardTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<PlayerBox />, document.getElementById("content"));
