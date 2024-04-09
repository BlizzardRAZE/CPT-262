// Create Reservation box for Reservation
var ReservationBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadReservationsFromServer: function () {
    // Connect to database
    $.ajax({
      url: "/getReservations",
      data: {
        playerFNameTM: playerFNameTM.value,
        playerLNameTM: playerLNameTM.value,
        reservationDateTimeTM: reservationDateTimeTM.value,
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
  // Check to see if the Reservations is loaded
  componentDidMount: function () {
    this.loadReservationsFromServer();
  },

  // Render the ReservationBox to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>Reservations</h1>
        {/* Get ReservationSelectForm to put in Box */}
        <ReservationSelectForm onReservationSubmit={this.loadReservationsFromServer} />
        <br />
        {/* Set Table to show Reservation */}
        <table>
          <thead>
            <tr>
              <th>Player First Name</th>
              <th>Player Last Name</th>
              <th>Date and Time</th>
            </tr>
          </thead>
          {/* Show list of Reservation */}
          <ReservationList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var ReservationSelectForm = React.createClass({
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
    var reservationDateTimeTM = this.state.reservationDateTimeTM.trim();

    // Use Values in Text boxes to submit to database
    this.props.onReservationsubmit({
      playerFNameTM: playerFNameTM,
      playerLNameTM: playerLNameTM,
      reservationDateTimeTM: reservationDateTimeTM,
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
        <h2>View Reservations</h2>
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
              {/* Create Reservation Date and Time Input */}
              <th>Reservation Date and Time</th>
              <td>
                <input
                  type="datetime-local"
                  name="reservationDateTimeTM"
                  id="reservationDateTimeTM"
                  value={this.state.reservationDateTimeTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Reservation" />
      </form>
    );
  },
});

// Place Items from Database to table
var ReservationList = React.createClass({
  render: function () {
    var reservationNodes = this.props.data.map(function (reservationTM) {
      //map the data to individual donations
      return (
        <Player
          key={reservationTM.dbreservationid}
          playFNameTM={reservationTM.dbcustomerfirstname}
          playLNameTM={reservationTM.dbcustomerlastname}
          resDTTM={reservationTM.dbreservationdatetime}
        ></Player>
      );
    });

    //print all the nodes in the list
    return <tbody>{reservationNodes}</tbody>;
  },
});

var Player = React.createClass({
  // Render Each item in database
  render: function () {
    return (
      <tr>
        <td>{this.props.playFNameTM}</td>
        <td>{this.props.playLNameTM}</td>
        <td>{this.props.resDTTM}</td>
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

ReactDOM.render(<ReservationBox />, document.getElementById("content"));
