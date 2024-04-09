// Create User box for User
var UserBox = React.createClass({
  handleUserSubmit: function (user) {
    // Connect to database
    $.ajax({
      url: "/newUser",
      dataType: "json",
      type: "POST",
      data: user,
      success: function (data) {
        //We set the state again after submission, to update with the submitted data
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Render the UserBox to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>Insert User</h1>
        {/* Get UserInsertForm to put in Box */}
        <UserInsertForm onNewUserSubmit={this.handleUserSubmit} />
      </div>
    );
  },
});

// Create Form for page
var UserInsertForm = React.createClass({
  // Get Reward Data
  loadRoles: function () {
    $.ajax({
      url: "/getRoles",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ userRoleDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadRoles();
  },

  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      userFNameTM: "",
      userLNameTM: "",
      userEAddressTM: "",
      userPNumberTM: "",
      userHireDateTM: "",
      userPasswordTM: "",
      userPassword2TM: "",
      userAccessTM: "",
      userRoleDataTM: [],
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

    // Get the values from the input fields
    var userFNameTM = this.state.userFNameTM.trim();
    var userLNameTM = this.state.userLNameTM.trim();
    var userEAddressTM = this.state.userEAddressTM.trim();
    var userPNumberTM = this.state.userPNumberTM.trim();
    var userHireDateTM = this.state.userHireDateTM.trim();
    var userPasswordTM = this.state.userPasswordTM.trim();
    var userPassword2TM = this.state.userPassword2TM.trim();
    var userAccessTM = this.state.selectedOption;
    var userRoleTM = roleTypeTM.value;

    // Validate the Users First and Last Names
    if (userFNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter a First Name that is Larger than three Characters."
      );
      return;
    }

    if (userLNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter a Last Name that is Larger than three Characters."
      );
      return;
    }

    // Validate the users Email Address
    if (!this.validateEmail(userEAddressTM)) {
      // console.log("Bad Email Address => " + this.validateEmail(userEAddressTM));
      // Show Error to User
      window.alert(
        "Please Enter a Valid Email address.\nExample:  John@email.com"
      );
      return;
    }

    // Validate Phone Number
    if (!this.phoneNumberValidate(userPNumberTM)) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Phone Number in the given Format.\nExample (843)-555-5555"
      );
      return;
    }

    // Validate the User Hire Date
    if (!userHireDateTM) {
      // Show Error to User
      window.alert("Please Enter a Hire Date.");
      return;
    }

    // Validate User's password
    if (!this.passwordValidate(userPasswordTM)) {
      //Show Error to User
      window.alert(
        "Please Enter a Password that is between 12-14 characters and it contains:\nOne Uppercase Letter\nOne Lowercase Letter\nOne Number\nOne Symbol (# ? ! @ $ % ^ & * - _ )"
      );
      return;
    }

    if (userPasswordTM != userPassword2TM) {
      //Show Error to User
      alert("Passwords do not match!");
      return;
    }


    // Validate the User Access
    if (!userAccessTM) {
      // Show Error to User
      window.alert("Select an Option to Activate the user.");
      return;
    }

    // Validate if the user selected an item from Role
    if (!this.validateSelectList(userRoleTM)) {
      window.alert("Select a Role.");
      return;
    }

    if (
      !userFNameTM ||
      !userLNameTM ||
      !userEAddressTM ||
      !userPNumberTM ||
      !userHireDateTM ||
      !userPasswordTM ||
      !userPassword2TM ||
      !userAccessTM ||
      !userRoleTM
    ) {
      // console.log("Field Missing");
      return;
    }

    // Use Values in Text boxes to submit to database
    this.props.onNewUserSubmit({
      userFNameTM: userFNameTM,
      userLNameTM: userLNameTM,
      userEAddressTM: userEAddressTM,
      userPNumberTM: userPNumberTM,
      userHireDateTM: userHireDateTM,
      userPasswordTM: userPasswordTM,
      userAccessTM: userAccessTM,
      userRoleTM: userRoleTM,
    });

    // Show Message to User when User is Inserted
    window.alert("User Added!");
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
        <h2>Insert a New User</h2>
        {/* Create Table to Hold New User Information */}
        <table>
          <tbody>
            <tr>
              {/* Create User First Name Input */}
              <th>User's First Name</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.userFNameTM}
                  uniqueName="userFNameTM"
                  placeholder="John"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "userFNameTM")}
                  errorMessage="User's First Name is Invalid!"
                  emptyMessage="User's First Name is Required!"
                />
              </td>
            </tr>
            {/* Create User Last Name Input */}
            <tr>
              <th>User's Last Name</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.userLNameTM}
                  placeholder="Doe"
                  uniqueName="userLNameTM"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "userLNameTM")}
                  errorMessage="User's Last Name is Invalid!"
                  emptyMessage="User's Last Name is Required!"
                />
              </td>
            </tr>
            {/* Create User Email Input */}
            <tr>
              <th>User's E-Mail</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.userEAddressTM}
                  uniqueName="userEAddressTM"
                  textArea={false}
                  required={true}
                  validate={this.validateEmail}
                  onChange={this.setValue.bind(this, "userEAddressTM")}
                  errorMessage="Email Address is Invalid!"
                  emptyMessage="Email Address is Required!"
                />
              </td>
            </tr>
            {/* Create User Phone Number */}
            <tr>
              <th>User's Phone Number</th>
              <td>
                <TextInput
                  value={this.state.userPNumberTM}
                  uniqueName="userPNumberTM"
                  textArea={false}
                  required={true}
                  minCharacters={14}
                  maxCharacters={14}
                  validate={this.phoneNumberValidate}
                  onChange={this.setValue.bind(this, "userPNumberTM")}
                  errorMessage="Phone Number is Invalid!"
                  emptyMessage="Phone Number is Required!"
                />
              </td>
            </tr>
            {/* Create User Hire Date */}
            <tr>
              <th>User Hire Date</th>
              <td>
                <DateInput
                  inputType="date"
                  value={this.state.userHireDateTM}
                  uniqueName="userHireDateTM"
                  required={true}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "userHireDateTM")}
                  errorMessage="Hire Date is Invalid!"
                  emptyMessage="Hire Date is Required!"
                />
              </td>
            </tr>
            {/* Create User Password Input */}
            <tr>
              <th>Enter User Password</th>
              <td>
                <TextInput
                  inputType="password"
                  value={this.state.userPasswordTM}
                  uniqueName="userPasswordTM"
                  textArea={false}
                  required={true}
                  minCharacters={12}
                  maxCharacters={14}
                  validate={this.passwordValidate}
                  onChange={this.setValue.bind(this, "userPasswordTM")}
                  errorMessage="Password is Invalid!"
                  emptyMessage="Password is Required!"
                />
              </td>
            </tr>
            {/* Create User Password Confirm Input */}
            <tr>
              <th>User Password Confirm</th>
              <td>
                <TextInput
                  inputType="password"
                  value={this.state.userPassword2TM}
                  uniqueName="userPassword2TM"
                  textArea={false}
                  required={true}
                  minCharacters={12}
                  maxCharacters={14}
                  validate={this.passwordValidate}
                  onChange={this.setValue.bind(this, "userPassword2TM")}
                  errorMessage="Password is Invalid!"
                  emptyMessage="Password is Required!"
                />
              </td>
            </tr>
            {/* Create Radio button to either activate/deactivate  user */}
            <tr>
              <th>Activate User for Sign in?</th>
              <td>
                <input
                  type="radio"
                  name="useractivate"
                  id="userActivateYes"
                  value="1"
                  checked={this.state.selectedOption === "1"}
                  onChange={this.handleOptionChange}
                  className="form-check-input"
                />
                Activate
                <input
                  type="radio"
                  name="userActivate"
                  id="userActivateNo"
                  value="0"
                  checked={this.state.selectedOption === "0"}
                  onChange={this.handleOptionChange}
                  className="form-check-input"
                />
                Deactivate
              </td>
            </tr>
            <tr>
              {/* Create Role Select List */}
              <th>Select Role for User</th>
              <td>
                <SelectListRoleNames
                  data={this.state.userRoleDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button to Submit the form */}
        <input type="submit" value="Insert User" id="buttonSubmit"/>
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


// Select List for Roles
var SelectListRoleNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (roleTypesTM) {
      return (
        <option key={roleTypesTM.dbroleid} value={roleTypesTM.dbroleid}>
          {roleTypesTM.dbrolename}
        </option>
      );
    });
    return (
      <select name="roleTypeTM" id="roleTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Place items into element Id named content
ReactDOM.render(<UserBox />, document.getElementById("content"));
