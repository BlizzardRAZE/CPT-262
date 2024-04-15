// Create Player box for Player
var PlayerBox = React.createClass({
  getInitialState: function () {
    return { loginData: [], viewThePageTM: 0 };
  },
  handlePlayerSubmit: function (player) {
    // Connect to database
    $.ajax({
      url: "/newPlayer",
      dataType: "json",
      type: "POST",
      data: player,
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
  componentDidMount: function(){
    this.loadAllowLogin();
  },

  // Render the PlayerBox to appear on HTML
  render: function () {
    // If User Doesn't have a token, or if there was a token error. Hide links and allow user to sign in again
    if (this.state.viewThePageTM == 0 || (this.state.viewThePageTM != 1 && this.state.viewThePageTM != 2)) {
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
          <h1>Insert Player</h1>
          {/* Get PlayerInsertForm to put in Box */}
          <PlayerInsertForm onNewPlayerSubmit={this.handlePlayerSubmit} />
        </div>
      );
    }
  },
});

// Create Form for page
var PlayerInsertForm = React.createClass({
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
      playerPasswordTM: "",
      playerPassword2TM: "",
      playerRewardDataTM: [],
    };
  },

  handleSubmit: function (e) {
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // Get the values from the input fields
    var playerFNameTM = this.state.playerFNameTM.trim();
    var playerLNameTM = this.state.playerLNameTM.trim();
    var playerEAddressTM = this.state.playerEAddressTM.trim();
    var playerPNumberTM = this.state.playerPNumberTM.trim();
    var playerPasswordTM = this.state.playerPasswordTM.trim();
    var playerPassword2TM = this.state.playerPassword2TM.trim();
    var playerRewardTM = rewardTypeTM.value;

    // Validate the Players First and Last Names
    if (playerFNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter a First Name that is Larger than three Characters."
      );
      return;
    }

    if (playerLNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter a Last Name that is Larger than three Characters."
      );
      return;
    }

    // Validate the players Email Address
    if (!this.validateEmail(playerEAddressTM)) {
      // console.log("Bad Email Address => " + this.validateEmail(playerEAddressTM));
      // Show Error to User
      window.alert(
        "Please Enter a Valid Email address.\nExample:  John@email.com"
      );
      return;
    }

    // Validate Phone Number
    if (!this.phoneNumberValidate(playerPNumberTM)) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Phone Number in the given Format.\nExample (843)-555-5555"
      );
      return;
    }

    // Validate Player's password
    if (!this.passwordValidate(playerPasswordTM)) {
      //Show Error to User
      window.alert(
        "Please Enter a Password that is between 12-14 characters and it contains:\nOne Uppercase Letter\nOne Lowercase Letter\nOne Number\nOne Symbol (# ? ! @ $ % ^ & * - _ )"
      );
      return;
    }

    if (playerPasswordTM != playerPassword2TM) {
      alert("Passwords do not match!");
      return;
    }

    // Validate if the user selected an item from Role
    if (!this.validateSelectList(playerRewardTM)) {
      window.alert("Select a Reward.");
      return;
    }

    if (
      !playerFNameTM ||
      !playerLNameTM ||
      !playerEAddressTM ||
      !playerPNumberTM ||
      !playerPasswordTM ||
      !playerPassword2TM ||
      !playerRewardTM
    ) {
      // console.log("Field Missing");
      return;
    }

    // Use Values in Text boxes to submit to database
    this.props.onNewPlayerSubmit({
      playerFNameTM: playerFNameTM,
      playerLNameTM: playerLNameTM,
      playerEAddressTM: playerEAddressTM,
      playerPNumberTM: playerPNumberTM,
      playerPasswordTM: playerPasswordTM,
      playerRewardTM: playerRewardTM,
    });

    // Show Message to User when Player is Inserted
    window.alert("Player Added!");
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

  // Regex to Validate Password
  passwordValidate: function (value) {
    // 1 Uppercase Letter, 1 Lowercase Letter, 1 Number, and 1 Symbol => Must be between 12-14 characters for security measures
    var passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{12,14}$/;
    return passwordRegex.test(value);
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
      <form onSubmit={this.handleSubmit} className="formContainer">
        {/* Create Header */}
        <h2>Insert a New Player</h2>
        {/* Create Table to Hold New Player Information */}
        <table>
          <tbody>
            <tr>
              {/* Create Player First Name Input */}
              <th>Player's First Name</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.playerFNameTM}
                  uniqueName="playerFNameTM"
                  placeholder="John"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "playerFNameTM")}
                  errorMessage="Player's First Name is Invalid!"
                  emptyMessage="Player's First Name is Required!"
                />
              </td>
            </tr>
            {/* Create Player Last Name Input */}
            <tr>
              <th>Player's Last Name</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.playerLNameTM}
                  placeholder="Doe"
                  uniqueName="playerLNameTM"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "playerLNameTM")}
                  errorMessage="Player's Last Name is Invalid!"
                  emptyMessage="Player's Last Name is Required!"
                />
              </td>
            </tr>
            {/* Create Player Email Input */}
            <tr>
              <th>Player's E-Mail</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.playerEAddressTM}
                  uniqueName="playerEAddressTM"
                  textArea={false}
                  required={true}
                  validate={this.validateEmail}
                  onChange={this.setValue.bind(this, "playerEAddressTM")}
                  errorMessage="Email Address is Invalid!"
                  emptyMessage="Email Address is Required!"
                />
              </td>
            </tr>
            {/* Create Player Phone Number */}
            <tr>
              <th>Player's Phone Number</th>
              <td>
                <TextInput
                  value={this.state.playerPNumberTM}
                  uniqueName="playerPNumberTM"
                  textArea={false}
                  required={true}
                  minCharacters={14}
                  maxCharacters={14}
                  validate={this.phoneNumberValidate}
                  onChange={this.setValue.bind(this, "playerPNumberTM")}
                  errorMessage="Phone Number is Invalid! Use this format (XXX)-XXX-XXXX."
                  emptyMessage="Phone Number is Required!"
                />
              </td>
            </tr>
            {/* Create Player Password Input */}
            <tr>
              <th>Enter Player Password</th>
              <td>
                <TextInput
                  inputType="password"
                  value={this.state.playerPasswordTM}
                  uniqueName="playerPasswordTM"
                  textArea={false}
                  required={true}
                  minCharacters={12}
                  maxCharacters={14}
                  validate={this.passwordValidate}
                  onChange={this.setValue.bind(this, "playerPasswordTM")}
                  errorMessage="Password is Invalid! Needs to be 12-14 Characters, 1 Uppercase, 1 Number, and 1 Symbol."
                  emptyMessage="Password is Required!"
                />
              </td>
            </tr>
            {/* Create Player Password Confirm Input */}
            <tr>
              <th>Player Password Confirm</th>
              <td>
                <TextInput
                  inputType="password"
                  value={this.state.playerPassword2TM}
                  uniqueName="playerPassword2TM"
                  textArea={false}
                  required={true}
                  minCharacters={12}
                  maxCharacters={14}
                  validate={this.passwordValidate}
                  onChange={this.setValue.bind(this, "playerPassword2TM")}
                  errorMessage="Password is Invalid!"
                  emptyMessage="Password is Required!"
                />
              </td>
            </tr>
            <tr>
              {/* Create Reward Select List */}
              <th>Select Reward Status</th>
              <td>
                <SelectListRewardStatus
                  data={this.state.playerRewardDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button to Submit the form */}
        <input type="submit" value="Insert Player" id="buttonSubmit" />
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

    return <td id="errorField"> {this.props.errorMessage} </td>;
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

// Select List for Rewards
var SelectListRewardStatus = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (rewardTypesTM) {
      return (
        <option key={rewardTypesTM.dbrewardid} value={rewardTypesTM.dbrewardid}>
          {rewardTypesTM.dbrewardname}
        </option>
      );
    });
    return (
      <select name="rewardTypeTM" id="rewardTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Place items into element Id named content
ReactDOM.render(<PlayerBox />, document.getElementById("content"));
