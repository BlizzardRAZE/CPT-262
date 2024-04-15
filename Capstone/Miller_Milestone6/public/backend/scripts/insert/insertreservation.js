// Create Reservation box for a Reservation
var ReservationBox = React.createClass({
  getInitialState: function () {
    return { loginData: [], viewThePageTM: 0 };
  },
  handleReservationSubmit: function (reservation) {
    // Connect to database
    $.ajax({
      url: "/newReservation",
      dataType: "json",
      type: "POST",
      data: reservation,
      success: function (data) {
        //We set the state again after submission, to update with the submitted data
        this.setState({ data: data });
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
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  componentDidMount: function () {
    this.loadAllowLogin();
  },

  // Render the Reservation to appear on HTML
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
        // Set Class name to main Content box
        <div className="mainContentBox">
          <h1>Insert Reservation</h1>
          {/* Get ReservationInsertForm to put in Box */}
          <ReservationInsertForm
            onNewReservationSubmit={this.handleReservationSubmit}
          />
        </div>
      );
    }
  },
});

// Create Form for page
var ReservationInsertForm = React.createClass({
  // Get Player Data
  loadPlayerNames: function () {
    $.ajax({
      url: "/getPlayers",
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

  // Get the UserId 
  loadAllowLogin: function () {
  $.ajax({
    url: "/getUserLoggedIn",
    dataType: "json",
    cache: false,
    success: function (datalog) {
      this.setState({ userDataTM: datalog });
      this.setState({ userIdTM: this.state.userDataTM[0].dbuserid});
      this.setState({ userNameTM: this.state.userDataTM[0].dbuserfirstname + " " + this.state.userDataTM[0].dbuserlastname});
    }.bind(this),
    error: function (xhr, status, err) {
      // console.error(this.props.url, status, err.toString());
    }.bind(this),
  });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadPlayerNames();
    this.loadAllowLogin();
  },

  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      playerDataTM: [],
      userDataTM: [],
      userIdTM: 0,
      userNameTM: "",
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
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    console.log(this.state.userIdTM)
    // Get the values from the input fields
    var playerNameTM = playerTypeTM.value;
    var userNameTM = this.state.userIdTM;
    var numberPlayersTM = numberPlayerTypeTM.value;
    var reservationDateTM = this.state.reservationDateTM.trim();
    var reservationTimeTM = reservationTimeTypeTM.value;
    var reservationConfirmTM = this.state.selectedOption;

    // Validate if the user selected an item from player
    if (!this.validateSelectList(playerNameTM)) {
      window.alert("Select a Player.");
      return;
    }

    // Validate if the user selected a number for their group
    if (!this.validateSelectList(numberPlayersTM)) {
      window.alert("Select a Number of players.");
      return;
    }

    // Validate the Reservation Date
    if (!reservationDateTM) {
      // Show Error to User
      window.alert("Please Enter a Reservation Date.");
      return;
    }

    // Validate if the user selected a time from Reservation Time
    if (!this.validateSelectList(reservationTimeTM)) {
      // Show Error to User
      window.alert(
        "Please Select a Reservation Time that is between 8 AM and 4 PM."
      );
      return;
    }

    // Validate the User Access
    if (!reservationConfirmTM) {
      // Show Error to User
      window.alert("Select an Option to Confirm Reservation.");
      return;
    }

    if (
      !playerNameTM ||
      !userNameTM ||
      !numberPlayersTM ||
      !reservationDateTM ||
      !reservationTimeTM ||
      !reservationConfirmTM
    ) {
      //   console.log("Field Missing");
      return;
    }

    // Use Values in Text boxes to submit to database
    this.props.onNewReservationSubmit({
      playerNameTM: playerNameTM,
      userNameTM: userNameTM,
      numberPlayersTM: numberPlayersTM,
      reservationDateTM: reservationDateTM,
      reservationTimeTM: reservationTimeTM,
      reservationConfirmTM: reservationConfirmTM,
    });

    // Show Message to User when Reservation is Inserted
    window.alert("Reservation Added!");
  },

  // Regex to check if user selected an item
  validateSelectList: function (userSelectedOption) {
    // console.log(userSelectedOption);
    if (userSelectedOption === "0") {
      return false;
    } else {
      return true;
    }
  },

  // Set Common Validate for other Validations
  commonValidate: function () {
    return true;
  },
  // Set the value for variables
  setValue: function (field, event) {
    var object = {};
    object[field] = event.target.value;
    this.setState(object);
  },
  // Render the form
  render: function () {
    return (
      // Create HTML Form
      <form onSubmit={this.handleSubmit} className="formContainer">
        {/* Create Header */}
        <h2>Insert a New Reservation</h2>
        {/* Create Table to Hold New Reservation Information */}
        <table>
          <tbody>
            <tr>
              {/* Create Player Select List */}
              <th>Select Player</th>
              <td>
                <SelectListPlayers
                  data={this.state.playerDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            <tr>
              {/* Show User's Name*/}
              <th>User's Name</th>
              <td>
                <TextInput
                  value={this.state.userNameTM}
                  disable = {true}
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
            {/* Create Reservation Date */}
            <tr>
              <th>Reservation Date </th>
              <td>
                <DateInput
                  inputType="date"
                  value={this.state.reservationDateTM}
                  uniqueName="reservationDateTM"
                  required={true}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "reservationDateTM")}
                  errorMessage="Reservation Date is Invalid!"
                  emptyMessage="Reservation Date is Required!"
                />
              </td>
            </tr>
            {/* Reservation Time List */}
            <tr>
              <th>Reservation Time</th>
              <td>
                <SelectListReservationTimes
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
        {/* Show Submit Button to Submit the form */}
        <input type="submit" value="Insert Reservation" id="buttonSubmit" />
      </form>
    );
  },
});

// Handle Input Error and Configure the styling for Error to Show
var InputError = React.createClass({
  getInitialState: function () {
    return {
      message: "Input is invalid",
    };
  },
  // Render the Error
  render: function () {
    var errorClass = classNames(this.props.className, {
      error_container: true,
      visible: this.props.visible,
      invisible: !this.props.visible,
    });

    return <td> {this.props.errorMessage} </td>;
  },
});

// Create TextInput for inputs that require a Text Box
var TextInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    // Check to see if text box is valid
    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length < this.props.minCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (value.length > this.props.maxCharacters) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    }

    // Set value of Text Box to one of the variables
    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  // Render the Textbox
  render: function () {
    if (this.props.textArea) {
      return (
        <div className={this.props.uniqueName}>
          <textarea
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    } else {
      return (
        <div className={this.props.uniqueName}>
          <input
            type={this.props.inputType}
            name={this.props.uniqueName}
            id={this.props.uniqueName}
            placeholder={this.props.text}
            className={"input input-" + this.props.uniqueName}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={this.props.value}
            disabled={this.props.disable}
          />

          <InputError
            visible={this.state.errorVisible}
            errorMessage={this.state.errorMessage}
          />
        </div>
      );
    }
  },
});

// Create DateInput for inputs that require a Date Box
var DateInput = React.createClass({
  getInitialState: function () {
    return {
      isEmpty: true,
      value: null,
      valid: false,
      errorMessage: "",
      errorVisible: false,
    };
  },

  handleChange: function (event) {
    this.validation(event.target.value);

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  },

  validation: function (value, valid) {
    if (typeof valid === "undefined") {
      valid = true;
    }

    var message = "";
    var errorVisible = false;

    if (!valid) {
      message = this.props.errorMessage;
      valid = false;
      errorVisible = true;
    } else if (this.props.required && jQuery.isEmptyObject(value)) {
      message = this.props.emptyMessage;
      valid = false;
      errorVisible = true;
    }

    this.setState({
      value: value,
      isEmpty: jQuery.isEmptyObject(value),
      valid: valid,
      errorMessage: message,
      errorVisible: errorVisible,
    });
  },

  handleBlur: function (event) {
    var valid = this.props.validate(event.target.value);
    this.validation(event.target.value, valid);
  },
  // Render Date Box
  render: function () {
    return (
      <div className={this.props.uniqueName}>
        <input
          type={this.props.inputType}
          name={this.props.uniqueName}
          id={this.props.uniqueName}
          placeholder={this.props.text}
          className={"input input-" + this.props.uniqueName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
        />

        <InputError
          visible={this.state.errorVisible}
          errorMessage={this.state.errorMessage}
        />
      </div>
    );
  },
});

// Select List for Players
var SelectListPlayers = React.createClass({
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
      <select name="playerTypeTM" id="playerTypeTM">
        <option value="0"></option>
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
var SelectListReservationTimes = React.createClass({
  render: function () {
    return (
      <select name="reservationTimeTypeTM" id="reservationTimeTypeTM">
        <option value="0"></option>
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
