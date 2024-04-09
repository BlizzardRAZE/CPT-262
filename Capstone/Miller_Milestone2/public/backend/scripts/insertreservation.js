// Create Reservation box for a Reservation
var ReservationBox = React.createClass({
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
  },

  // Render the Reservation to appear on HTML
  render: function () {
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
  },
});

// Create Form for page
var ReservationInsertForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      playerDataTM: [],
      reservationDateTimeTM: "",
    };
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
    var playerNameTM = playerTypeTM.value;
    var reservationDateTimeTM = this.state.reservationDateTimeTM.trim();

    // Validate if the user selected an item from player
    if (!this.validateSelectList(playerNameTM)) {
      window.alert("Select a Player.");
      return;
    }

    // Validate the Reservation Date Time
    if (!reservationDateTimeTM) {
      // console.log('Date: ' + reservationDateTimeTM);
      // Show Error to User
      window.alert("Please Enter a Reservation Date and Time.");
      return;
    }

    if (!playerNameTM || !reservationDateTimeTM) {
      //   console.log("Field Missing");
      return;
    }

    // Use Values in Text boxes to submit to database
    this.props.onNewReservationSubmit({
      playerNameTM: playerNameTM,
      reservationDateTimeTM: reservationDateTimeTM,
    });

    // Show Message to User when Reservation is Inserted
    window.alert("Reservation Added!");
  },

  // Regex to check if user selected an item
  validateSelectList: function (userSelectedOption) {
    console.log(userSelectedOption);
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
      <form onSubmit={this.handleSubmit}>
        {/* Create Header */}
        <h2>Insert a New Reservation</h2>
        {/* Create Table to Hold New Reservation Information */}
        <table>
          <tbody>
            <tr>
              {/* Create Player Name Select List */}
              <th>Select Player Name</th>
              <td>
                <SelectListPlayerNames
                  data={this.state.playerDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            {/* Create Reservation Hire Date */}
            <tr>
              <th>Reservation Date and Time</th>
              <td>
                <DateTimeInput
                  inputType="datetime-local"
                  value={this.state.reservationDateTimeTM}
                  uniqueName="reservationDateTimeTM"
                  required={true}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "reservationDateTimeTM")}
                  errorMessage="Reservation Date and Time is Invalid!"
                  emptyMessage="Reservation Date and Time is Required!"
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button to Submit the form */}
        <input type="submit" value="Insert Reservation" />
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


// Create DateTimeInput for inputs that require a Date Box
var DateTimeInput = React.createClass({
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
  // Render DateTime Box
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
var SelectListPlayerNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (playerTypesTM) {
      return (
        <option
          key={playerTypesTM.dbcustomerid}
          value={playerTypesTM.dbcustomerid}
        >
          {playerTypesTM.dbcustomerfirstname + " " + playerTypesTM.dbcustomerlastname}
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

// Select List for Employees
var SelectListEmployeesNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (employeeTypesTM) {
      return (
        <option
          key={employeeTypesTM.dbemployeeid}
          value={employeeTypesTM.dbemployeeid}
        >
          {employeeTypesTM.dbemployeefirstname + " " + employeeTypesTM.dbemployeelastname}
        </option>
      );
    });
    return (
      <select name="employeeTypeTM" id="employeeTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Place items into element Id named content
ReactDOM.render(<ReservationBox />, document.getElementById("content"));
