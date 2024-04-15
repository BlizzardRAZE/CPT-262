// Create Reservation box for Reservation
var ReservationBox = React.createClass({
  getInitialState: function () {
    return { data: [], loginData: [], viewThePageTM: 0 };
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
    // To get data from table
    $.ajax({
      url: "/selectReservations",
      data: {
        playerFNameTM: playerFNameTM.value,
        playerLNameTM: playerLNameTM.value,
        userNameTM: userTypeTM.value,
        numberPlayersTM: numberPlayerTypeTM.value,
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

  updateSingleReservationFromServer: function (reservation) {
    // Connect to database
    // To push new updated data to table
    $.ajax({
      url: "/updateSingleReservation",
      dataType: "json",
      data: reservation,
      type: "POST",
      cache: false,
      success: function (upSingleReservationDataTM) {
        this.setState({ upSingleReservationDataTM: upSingleReservationDataTM });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
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
        this.loadReservationsFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  componentDidMount: function () {
    this.loadAllowLogin();
    // setInterval(this.loadReservationsFromServer, this.props.pollInterval);
  },

  // Render the box to HTML
  render: function () {
    // If User Doesn't have a token, or if there was a token error. Hide links and allow user to sign in again
    if (this.state.viewThePageTM == 0) {
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
          {/* Show the select form */}
          <h1>Update Reservation</h1>
          <ReservationSelectForm
            onReservationSubmit={this.loadReservationsFromServer}
          />
          <br />
          <div id="theresults">
            <div id="theleft">
              {/* Create Table and put data from database into here (Use the List) */}
              <table id="resultData">
                <thead>
                  <tr>
                    <th>User's First Name</th>
                    <th>User's Last Name</th>
                    <th>Player's First Name</th>
                    <th>Player's Last Name</th>
                    <th>Number of Players</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Confirmed</th>
                    <th></th>
                  </tr>
                </thead>
                {/* Show data from database into list */}
                <ReservationList data={this.state.data} />
              </table>
            </div>
            <div id="theright">
              {/* Show the Update Form */}
              <ReservationUpdateForm
                onUpdateSubmit={this.updateSingleReservationFromServer}
              />
            </div>
          </div>
        </div>
      );
    }
  },
});

// Create Form for page
var ReservationSelectForm = React.createClass({
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
    var numberPlayersTM = numberPlayerTypeTM.value;
    var reservationDateTM = this.state.reservationDateTM.trim();
    var reservationTimeTM = reservationTimeTypeTM.value;
    var reservationConfirmTM = this.state.selectedOption;

    // console.log(reservationTimeTM);

    // Use Values in Text boxes to submit to database
    this.props.onReservationSubmit({
      userNameTM: userNameTM,
      playerFNameTM: playerFNameTM,
      playerLNameTM: playerLNameTM,
      numberPlayersTM: numberPlayersTM,
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
            {/* Group Number List*/}
            <tr>
              <th>Number of Members</th>
              <td>
                <SelectListNumberOfMembers validate={this.validateSelectList} />
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
        <input type="submit" value="Search Reservation" id="buttonSubmit" />
      </form>
    );
  },
});

// Display Update Form
var ReservationUpdateForm = React.createClass({
  // Get Player Data
  loadPlayerNames: function () {
    $.ajax({
      url: "/getPlayers",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ updatePlayerDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Get User Data
  loadUsersNames: function () {
    $.ajax({
      url: "/getUsers",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ updateUserDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadPlayerNames();
    this.loadUsersNames();
  },

  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      updateReservationidTM: "",
      updatePlayerDataTM: [],
      updateUserDataTM: [],
      updateReservationDateTM: "",
      updateReservationSelectedOptionTM: "",
      updateReservationConfirmTM: "",
    };
  },

  // Handle the change when the user interacts with Radio button
  handleUpOptionChange: function (e) {
    this.setState({
      updateReservationSelectedOptionTM: e.target.value,
    });
  },

  handleUpSubmit: function (e) {
    e.preventDefault();

    // Check to see if the yes or no radios buttons are checked
    // If so, set their respected values
    if (upReservationConfirmYes.checked) {
      var updateReservationConfirmTM = 1;
    }

    if (upReservationConfirmNo.checked) {
      var updateReservationConfirmTM = 0;
    }

    // Check to see if both radio buttons are not checked
    if (!upReservationConfirmYes.checked && !upReservationConfirmNo.checked) {
      var updateReservationConfirmTM =
        this.state.updateReservationSelectedOptionTM;
    }

    // Get the values from the input fields
    var updateReservationidTM = upReservationidTM.value;
    var updatePlayerNameTM = upPlayerTypeTM.value;
    var updateUserNameTM = upUserTypeTM.value;
    var updateNumberPlayersTM = upNumberPlayerTypeTM.value;
    var updateReservationDateTM = upReservationDateTM.value;
    var updateReservationTimeTM = upReservationTimeTypeTM.value;

    // Validate if the user selected an item from player
    if (!this.validateSelectList(updatePlayerNameTM)) {
      window.alert("Select a Player.");
      return;
    }

    // Validate if the user selected an item from user
    if (!this.validateSelectList(updateUserNameTM)) {
      window.alert("Select a User.");
      return;
    }

    // Validate if the user selected a number for their group
    if (!this.validateSelectList(updateNumberPlayersTM)) {
      window.alert("Select a Number of players.");
      return;
    }

    // Validate the Reservation Date
    if (!updateReservationDateTM) {
      // Show Error to User
      window.alert("Please Enter a Reservation Date.");
      return;
    }

    // Validate if the user selected a time from Reservation Time
    if (!this.validateSelectList(updateReservationTimeTM)) {
      // Show Error to User
      window.alert(
        "Please Select a Reservation Time that is between 8 AM and 4 PM."
      );
      return;
    }

    // Validate the User Access
    if (updateReservationConfirmTM === "") {
      // Show Error to User
      window.alert("Select an Option to Confirm Reservation.");
      return;
    }

    if (
      !updatePlayerNameTM ||
      !updateUserNameTM ||
      !updateNumberPlayersTM ||
      !updateReservationDateTM ||
      !updateReservationTimeTM ||
      (updateReservationConfirmTM && !updateReservationConfirmTM)
    ) {
      //   console.log("Field Missing");
      return;
    }

    // Show confirm button if user wants to processed with the update
    if (confirm("Are you sure you want to update record?") == true) {
      // Use Values in Text boxes to submit to database
      this.props.onUpdateSubmit({
        updateReservationidTM: updateReservationidTM,
        updatePlayerNameTM: updatePlayerNameTM,
        updateUserNameTM: updateUserNameTM,
        updateNumberPlayersTM: updateNumberPlayersTM,
        updateReservationDateTM: updateReservationDateTM,
        updateReservationTimeTM: updateReservationTimeTM,
        updateReservationConfirmTM: updateReservationConfirmTM,
      });

      // Show Message to User when data is updated
      window.alert("Reservation Updated!");
    } else {
      window.alert("Update Canceled!");
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
    // console.log(userSelectedOption);
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
      // test: console.log(event.target.id),
      [event.target.id]: event.target.value,
    });
  },

  // Render the form
  render: function () {
    return (
      <div>
        <div id="updateForm">
          <form onSubmit={this.handleUpSubmit}>
            <h2>Update Reservation</h2>
            <table>
              <tbody>
                <tr>
                  {/* Create Player Select List */}
                  <th>Select Player</th>
                  <td>
                    <SelectUpdateListPlayers
                      validate={this.validateSelectList}
                      data={this.state.updatePlayerDataTM}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Create User Select List */}
                  <th>Select User</th>
                  <td>
                    <SelectUpdateListUsers
                      validate={this.validateSelectList}
                      data={this.state.updateUserDataTM}
                    />
                  </td>
                </tr>
                {/* Group Number List*/}
                <tr>
                  <th>Number of Members</th>
                  <td>
                    <SelectUpdateListNumberOfMembers
                      validate={this.validateSelectList}
                    />
                  </td>
                </tr>
                <tr>
                  {/* Display Reservation Date for Input */}
                  <th>Reservation Date</th>
                  <td>
                    <input
                      type="date"
                      name="upReservationDateTM"
                      id="upReservationDateTM"
                      value={this.state.upReservationDateTM}
                      onChange={this.handleChange}
                    ></input>
                  </td>
                </tr>
                <tr>
                  {/* Show Reservation Time List */}
                  <th>Reservation Time</th>
                  <td>
                    <SelectUpdateListReservationTimes
                      validate={this.validateSelectList}
                    />
                  </td>
                </tr>
                {/* Create Radio button to confirm Reservation */}
                <tr>
                  <th>Confirm Reservation?</th>
                  <td>
                    <input
                      type="radio"
                      name="upReservationConfirm"
                      id="upReservationConfirmYes"
                      value="1"
                      checked={
                        this.state.updateReservationSelectedOptionTM === "1"
                      }
                      onChange={this.handleUpOptionChange}
                      className="form-check-input"
                    />
                    Yes
                    <input
                      type="radio"
                      name="upReservationConfirm"
                      id="upReservationConfirmNo"
                      value="0"
                      checked={
                        this.state.updateReservationSelectedOptionTM === "0"
                      }
                      onChange={this.handleUpOptionChange}
                      className="form-check-input"
                    />
                    No
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upReservationidTM"
              id="upReservationidTM"
              onChange={this.handleUpChange}
            />
            {/* Show Submit Button to Submit the form */}
            <input type="submit" value="Update Reservation" id="buttonSubmit" />
          </form>
        </div>
      </div>
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
          reservationIdTM={reservationTM.dbreservationid}
          userKey={reservationTM.dbuserid}
          userFNameTM={reservationTM.dbuserfirstname}
          userLNameTM={reservationTM.dbuserlastname}
          playFNameTM={reservationTM.dbplayerfirstname}
          playLNameTM={reservationTM.dbplayerlastname}
          numPlayersTM={reservationTM.dbnumofplayers}
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
  getInitialState: function () {
    return {
      upReservationidTM: "",
      singleResDataTM: [],
    };
  },

  // Get id from text box and pass it to function to populate input fields for update form
  updateRecord: function (e) {
    e.preventDefault();
    var theUpResTM = this.props.reservationIdTM;

    this.loadSingleReservation(theUpResTM);
  },

  loadSingleReservation: function (theUpResTM) {
    $.ajax({
      url: "/selectSingleReservation",
      data: {
        upReservationidTM: theUpResTM,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singleResDataTM: data });
        // console.log(this.state.singleResDataTM);

        // Get values from database and assign them to input fields to show
        var populateReservation = this.state.singleResDataTM.map(function (
          reservation
        ) {
          upReservationidTM.value = theUpResTM;
          upUserTypeTM.value = reservation.dbuserid;
          upPlayerTypeTM.value = reservation.dbplayerid;
          upNumberPlayerTypeTM.value = reservation.dbnumofplayers;
          var upReservationDateTimeTM = reservation.dbreservationdatetime;
          if (reservation.dbreservationconfimed == 1) {
            upReservationConfirmYes.checked = true;
          } else {
            upReservationConfirmNo.checked = true;
          }

          // console.log(upReservationDateTimeTM);
          // Declare Variables
          var dateTimeSplitTM = "";
          var dateTM = "";
          var timeTM = "";

          // Split the upReservationDateTimeTM
          dateTimeSplitTM = upReservationDateTimeTM.toString().split(" ");

          // Assign parts of dateTimeTM to date and time
          dateTM = dateTimeSplitTM[0];
          timeTM = dateTimeSplitTM[1];

          // Pass values

          upReservationDateTM.value = dateTM;
          // console.log(timeTM)
          upReservationTimeTypeTM.value = timeTM;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

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
        <td>{this.props.numPlayersTM}</td>
        <td>{dateTM}</td>
        <td>{pieceOfTimeTM}</td>
        <td>{reservationResponseTM}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" id="buttonSubmit" />
          </form>
        </td>
      </tr>
    );
  },
});

// Select List for Users
var SelectListUsers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (userTypesTM) {
      return (
        <option
          key={userTypesTM.dbuserid}
          value={userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}
        >
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

// Select List for SelectListNumberOfMembers
var SelectListNumberOfMembers = React.createClass({
  render: function () {
    return (
      <select name="numberPlayerTypeTM" id="numberPlayerTypeTM">
        <option></option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
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

// Select Update List for Players
var SelectUpdateListPlayers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (playerTypesTM) {
      return (
        <option key={playerTypesTM.dbplayerid} value={playerTypesTM.dbplayerid}>
          {playerTypesTM.dbplayerfirstname +
            " " +
            playerTypesTM.dbplayerlastname}
        </option>
      );
    });
    return (
      <select name="upPlayerTypeTM" id="upPlayerTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select Update List for Users
var SelectUpdateListUsers = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (userTypesTM) {
      return (
        <option key={userTypesTM.dbuserid} value={userTypesTM.dbuserid}>
          {userTypesTM.dbuserfirstname + " " + userTypesTM.dbuserlastname}
        </option>
      );
    });
    return (
      <select name="upUserTypeTM" id="upUserTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for SelectListNumberOfMembers
var SelectUpdateListNumberOfMembers = React.createClass({
  render: function () {
    return (
      <select name="upNumberPlayerTypeTM" id="upNumberPlayerTypeTM">
        <option value="0"></option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
    );
  },
});

// Select List for Reservation Times
var SelectUpdateListReservationTimes = React.createClass({
  render: function () {
    return (
      <select name="upReservationTimeTypeTM" id="upReservationTimeTypeTM">
        <option value="0"></option>
        {/* 8:00 AM */}
        <option value="08:00:00">8:00 AM</option>
        <option value="08:08:00">8:08 AM</option>
        <option value="08:16:00">8:16 AM</option>
        <option value="08:24:00">8:24 AM</option>
        <option value="08:32:00">8:32 AM</option>
        <option value="08:40:00">8:40 AM</option>
        <option value="08:48:00">8:48 AM</option>
        <option value="08:56:00">8:56 AM</option>
        {/* 9:00 AM */}
        <option value="09:00:00">9:00 AM</option>
        <option value="09:08:00">9:08 AM</option>
        <option value="09:16:00">9:16 AM</option>
        <option value="09:24:00">9:24 AM</option>
        <option value="09:32:00">9:32 AM</option>
        <option value="09:40:00">9:40 AM</option>
        <option value="09:48:00">9:48 AM</option>
        <option value="09:56:00">9:56 AM</option>
        {/* 10:00 AM */}
        <option value="10:00:00">10:00 AM</option>
        <option value="10:08:00">10:08 AM</option>
        <option value="10:16:00">10:16 AM</option>
        <option value="10:24:00">10:24 AM</option>
        <option value="10:32:00">10:32 AM</option>
        <option value="10:40:00">10:40 AM</option>
        <option value="10:48:00">10:48 AM</option>
        <option value="10:56:00">10:56 AM</option>
        {/* 11:00 AM */}
        <option value="11:00:00">11:00 AM</option>
        <option value="11:08:00">11:08 AM</option>
        <option value="11:16:00">11:16 AM</option>
        <option value="11:24:00">11:24 AM</option>
        <option value="11:32:00">11:32 AM</option>
        <option value="11:40:00">11:40 AM</option>
        <option value="11:48:00">11:48 AM</option>
        <option value="11:56:00">11:56 AM</option>
        {/* 12:00 PM */}
        <option value="12:00:00">12:00 PM</option>
        <option value="12:08:00">12:08 PM</option>
        <option value="12:16:00">12:16 PM</option>
        <option value="12:24:00">12:24 PM</option>
        <option value="12:32:00">12:32 PM</option>
        <option value="12:40:00">12:40 PM</option>
        <option value="12:48:00">12:48 PM</option>
        <option value="12:56:00">12:56 PM</option>
        {/* 1:00 PM */}
        <option value="13:00:00">1:00 PM</option>
        <option value="13:08:00">1:08 PM</option>
        <option value="13:16:00">1:16 PM</option>
        <option value="13:24:00">1:24 PM</option>
        <option value="13:32:00">1:32 PM</option>
        <option value="13:40:00">1:40 PM</option>
        <option value="13:48:00">1:48 PM</option>
        <option value="13:56:00">1:56 PM</option>
        {/* 2:00 PM */}
        <option value="14:00:00">2:00 PM</option>
        <option value="14:08:00">2:08 PM</option>
        <option value="14:16:00">2:16 PM</option>
        <option value="14:24:00">2:24 PM</option>
        <option value="14:32:00">2:32 PM</option>
        <option value="14:40:00">2:40 PM</option>
        <option value="14:48:00">2:48 PM</option>
        <option value="14:56:00">2:56 PM</option>
        {/* 3:00 PM */}
        <option value="15:00:00">3:00 PM</option>
        <option value="15:08:00">3:08 PM</option>
        <option value="15:16:00">3:16 PM</option>
        <option value="15:24:00">3:24 PM</option>
        <option value="15:32:00">3:32 PM</option>
        <option value="15:40:00">3:40 PM</option>
        <option value="15:48:00">3:48 PM</option>
        <option value="15:56:00">3:56 PM</option>
      </select>
    );
  },
});

ReactDOM.render(<ReservationBox />, document.getElementById("content"));
