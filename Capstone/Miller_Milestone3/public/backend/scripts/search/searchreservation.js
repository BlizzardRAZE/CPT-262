// Create Reservation box for Reservation
var ReservationBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadReservationsFromServer: function () {
    var reservationConfirmIdentifierTM = 2;
    if (reservationConfirmYes.checked) {
      reservationConfirmIdentifierTM = 1;
    }
    if (reservationConfirmNo.checked) {
      reservationConfirmIdentifierTM = 0;
    }
    // Connect to database
    $.ajax({
      url: "/selectReservations",
      data: {
        playerFNameTM: playerFNameTM.value,
        playerLNameTM: playerLNameTM.value,
        userNameTM: userTypeTM.value,
        reservationDateTM: reservationDateTM.value,
        reservationTimeTM: reservationTimeTypeTM.value,
        reservationConfirmTM: reservationConfirmIdentifierTM,
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
  // Check to see if items are loaded from server
  componentDidMount: function () {
    this.loadReservationsFromServer();
  },

  // Render the box to HTML
  render: function () {
    return (
      <div>
        <h1>View Reservations</h1>
        {/* Show the form */}
        <ReservationForm
          onReservationSubmit={this.loadReservationsFromServer}
        />
        <br />
        {/* Create Table and put data from database into here (Use the List) */}
        <table id="resultData">
          <thead>
            <tr>
              <th>User's First Name</th>
              <th>User's Last Name</th>
              <th>Player's First Name</th>
              <th>Player's Last Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Confirmed</th>
            </tr>
          </thead>
          <ReservationList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var ReservationForm = React.createClass({
  // Get User Data
  loadUsersNames: function () {
    $.ajax({
      url: "/getUsers",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ userDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadUsersNames();
  },

  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      userDataTM: [],
      playerFNameTM: "",
      playerLNameTM: "",
      reservationDateTM: "",
      reservationConfirmTM: "",
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
    var userNameTM = userTypeTM.value;
    var playerFNameTM = this.state.playerFNameTM.trim();
    var playerLNameTM = this.state.playerLNameTM.trim();
    var reservationDateTM = this.state.reservationDateTM.trim();
    var reservationTimeTM = reservationTimeTypeTM.value;
    var reservationConfirmTM = this.state.selectedOption;

    console.log(reservationTimeTM);

    // Use Values in Text boxes to submit to database
    this.props.onReservationSubmit({
      userNameTM: userNameTM,
      playerFNameTM: playerFNameTM,
      playerLNameTM: playerLNameTM,
      reservationDateTM: reservationDateTM,
      reservationTimeTM: reservationTimeTM,
      reservationConfirmTM: reservationConfirmTM,
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
        <h2>Search a Reservation</h2>
        {/* Create Table to hold form */}
        <table>
          <tbody>
            <tr>
              {/* Create User Select List */}
              <th>Select User</th>
              <td>
                <SelectListUsers
                  data={this.state.userDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
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
            <tr>
              {/* Display Reservation Date for Input */}
              <th>Reservation Date</th>
              <td>
                <input
                  type="date"
                  name="reservationDateTM"
                  id="reservationDateTM"
                  value={this.state.reservationDateTM}
                  onChange={this.handleChange}
                ></input>
              </td>
            </tr>
            <tr>
              {/* Show Reservation Time List */}
              <th>Reservation Time</th>
              <td>
                <SelectListReservationTimes
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            {/* Create Radio button to either select an active/  user */}
            <tr>
              <th>Reservation Confirmed</th>
              <td>
                <input
                  type="radio"
                  name="reservationConfirm"
                  id="reservationConfirmYes"
                  value="1"
                  checked={this.state.selectedOption === "1"}
                  onChange={this.handleOptionChange}
                  className="form-check-input"
                />
                Yes
                <input
                  type="radio"
                  name="reservationConfirm"
                  id="reservationConfirmNo"
                  value="0"
                  checked={this.state.selectedOption === "0"}
                  onChange={this.handleOptionChange}
                  className="form-check-input"
                />
                No
              </td>
            </tr>
          </tbody>
        </table>
        {/* Submit button to Search Reservation */}
        <input type="submit" value="Search Reservation" id="buttonSubmit"/>
      </form>
    );
  },
});

// Display Reservation Information
var ReservationList = React.createClass({
  // Render in data for database
  render: function () {
    var reservationNodes = this.props.data.map(function (reservationTM) {
      //map the data
      return (
        <Reservation
          key={reservationTM.dbreservationid}
          userKey={reservationTM.dbuserid}
          userFNameTM={reservationTM.dbuserfirstname}
          userLNameTM={reservationTM.dbuserlastname}
          playFNameTM={reservationTM.dbplayerfirstname}
          playLNameTM={reservationTM.dbplayerlastname}
          reservationDTTM={reservationTM.dbreservationdatetime}
          reservationConfirmTM={reservationTM.dbreservationconfimed}
        ></Reservation>
      );
    });

    //Print all the nodes in the list
    return <tbody>{reservationNodes}</tbody>;
  },
});

var Reservation = React.createClass({
  render: function () {
    // Check value of reservationConfirmTM to give a yes or no answer
    if (this.props.reservationConfirmTM == 1) {
      var reservationResponseTM = "Yes";
    } else {
      var reservationResponseTM = "No";
    }

    // Spit the DateTime
    var dateTimeSplitTM = this.props.reservationDTTM.split(" ");
    // Create Variables
    var pieceOfTimeTM = "";
    var pieceOfDateTM = "";
    var dateTM = "";

    // Format Date
    // Get date from SQL
    pieceOfDateTM = dateTimeSplitTM[0];

    // Slice the pieceOfDateTM
    pieceOfDateTM = pieceOfDateTM.split("-");
    dateTM =
      +pieceOfDateTM[1] + "/" + pieceOfDateTM[2] + "/" + pieceOfDateTM[0];

    // console.log(pieceOfDateTM);

    // Convert 24-hour to 12-hour
    // console.log(dateTimeSplitTM[1]);

    // Get Time from SQL and Check to see if its time
    var pieceOfTimeTM = dateTimeSplitTM[1]
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    // Slice the pieceOfTimeTM
    pieceOfTimeTM = pieceOfTimeTM.slice(1);

    // Check if hours is above 12 to give PM, otherwise give AM
    pieceOfTimeTM[5] = +pieceOfTimeTM[0] < 12 ? "AM" : "PM";

    // Fix the hours to be 12-Hour Format
    pieceOfTimeTM[0] = +pieceOfTimeTM[0] % 12 || 12;


    //Display info
    return (
      <tr>
        <td>{this.props.userFNameTM}</td>
        <td>{this.props.userLNameTM}</td>
        <td>{this.props.playFNameTM}</td>
        <td>{this.props.playLNameTM}</td>
        <td>{dateTM}</td>
        <td>{pieceOfTimeTM}</td>
        <td>{reservationResponseTM}</td>
      </tr>
    );
  },
});

// Select List for Users
var SelectListUsers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (userTypesTM) {
      return (
        <option key={userTypesTM.dbuserid} value={userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}>
          {userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}
        </option>
      );
    });
    return (
      <select name="userTypeTM" id="userTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Reservation Times
var SelectListReservationTimes = React.createClass({
  render: function () {
    return (
      <select name="reservationTimeTypeTM" id="reservationTimeTypeTM">
        <option></option>
        {/* 8:00 AM */}
        <option value="08:00">8:00 AM</option>
        <option value="08:08">8:08 AM</option>
        <option value="08:16">8:16 AM</option>
        <option value="08:24">8:24 AM</option>
        <option value="08:32">8:32 AM</option>
        <option value="08:40">8:40 AM</option>
        <option value="08:48">8:48 AM</option>
        <option value="08:56">8:56 AM</option>
        {/* 9:00 AM */}
        <option value="09:00">9:00 AM</option>
        <option value="09:08">9:08 AM</option>
        <option value="09:16">9:16 AM</option>
        <option value="09:24">9:24 AM</option>
        <option value="09:32">9:32 AM</option>
        <option value="09:40">9:40 AM</option>
        <option value="09:48">9:48 AM</option>
        <option value="09:56">9:56 AM</option>
        {/* 10:00 AM */}
        <option value="10:00">10:00 AM</option>
        <option value="10:08">10:08 AM</option>
        <option value="10:16">10:16 AM</option>
        <option value="10:24">10:24 AM</option>
        <option value="10:32">10:32 AM</option>
        <option value="10:40">10:40 AM</option>
        <option value="10:48">10:48 AM</option>
        <option value="10:56">10:56 AM</option>
        {/* 11:00 AM */}
        <option value="11:00">11:00 AM</option>
        <option value="11:08">11:08 AM</option>
        <option value="11:16">11:16 AM</option>
        <option value="11:24">11:24 AM</option>
        <option value="11:32">11:32 AM</option>
        <option value="11:40">11:40 AM</option>
        <option value="11:48">11:48 AM</option>
        <option value="11:56">11:56 AM</option>
        {/* 12:00 PM */}
        <option value="12:00">12:00 PM</option>
        <option value="12:08">12:08 PM</option>
        <option value="12:16">12:16 PM</option>
        <option value="12:24">12:24 PM</option>
        <option value="12:32">12:32 PM</option>
        <option value="12:40">12:40 PM</option>
        <option value="12:48">12:48 PM</option>
        <option value="12:56">12:56 PM</option>
        {/* 1:00 PM */}
        <option value="13:00">1:00 PM</option>
        <option value="13:08">1:08 PM</option>
        <option value="13:16">1:16 PM</option>
        <option value="13:24">1:24 PM</option>
        <option value="13:32">1:32 PM</option>
        <option value="13:40">1:40 PM</option>
        <option value="13:48">1:48 PM</option>
        <option value="13:56">1:56 PM</option>
        {/* 2:00 PM */}
        <option value="14:00">2:00 PM</option>
        <option value="14:08">2:08 PM</option>
        <option value="14:16">2:16 PM</option>
        <option value="14:24">2:24 PM</option>
        <option value="14:32">2:32 PM</option>
        <option value="14:40">2:40 PM</option>
        <option value="14:48">2:48 PM</option>
        <option value="14:56">2:56 PM</option>
        {/* 3:00 PM */}
        <option value="15:00">3:00 PM</option>
        <option value="15:08">3:08 PM</option>
        <option value="15:16">3:16 PM</option>
        <option value="15:24">3:24 PM</option>
        <option value="15:32">3:32 PM</option>
        <option value="15:40">3:40 PM</option>
        <option value="15:48">3:48 PM</option>
        <option value="15:56">3:56 PM</option>
      </select>
    );
  },
});

// Place items into element Id named content
ReactDOM.render(<ReservationBox />, document.getElementById("content"));
