// Create User box for New User
var UserBox = React.createClass({
  handleUserSubmit: function (user) {
    // Connect to database
    $.ajax({
      url: "/newEmployeeUser",
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
        <h1>Insert Employee User</h1>
        {/* Get EmployeeInsertForm to put in Box */}
        <UserInsertForm onNewUserSubmit={this.handleUserSubmit} />
      </div>
    );
  },
});

// Create Form for page
var UserInsertForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      employeeDataTM: [],
      roleDataTM: [],
      employeeUsernameTM: "",
      employeePasswordTM: "",
      employeePassword2TM: "",
    };
  },

  // Get Employee Data
  loadEmployeeNames: function () {
    $.ajax({
      url: "/getEmployeeNames",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ employeeDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Get Role Data
  loadRoleNames: function () {
    $.ajax({
      url: "/getRoleNames",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ roleDataTM: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadEmployeeNames();
    this.loadRoleNames();
  },

  handleSubmit: function (e) {
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // Get the values from the input fields
    var employeeNameTM = employeeTypeTM.value;
    var roleNameTM = roleTypeTM.value;
    var employeeUsernameTM = this.state.employeeUsernameTM.trim();
    var employeePasswordTM = this.state.employeePasswordTM.trim();
    var employeePassword2TM = this.state.employeePassword2TM.trim();

    // Validate if the user selected an item from employee
    if (!this.validateSelectList(employeeNameTM)) {
      window.alert("Select a Employee.");
      return;
    }

    // Validate if the user selected an item from Role
    if (!this.validateSelectList(roleNameTM)) {
      window.alert("Select a Role.");
      return;
    }

    // Validate if the user entered a username
    if (employeeUsernameTM === null || employeeUsernameTM === "") {
      alert("Enter a Username.");
      return;
    }

    // Validate if the user entered a password
    if (employeePasswordTM === null || employeePasswordTM === "") {
      alert("Enter a Password.");
      return;
    }

    if (employeePassword2TM === null || employeePassword2TM === "") {
      alert("Retype Password in the First Password Text Box.");
      return;
    }

    if (employeePasswordTM != employeePassword2TM) {
      alert("Passwords do not Match!");
      return;
    }

    if (
      !employeeNameTM ||
      !roleNameTM ||
      !employeeUsernameTM ||
      !employeePasswordTM ||
      !employeePassword2TM
    ) {
      // console.log("Field Missing");
      return;
    }

    // Use Values in Text boxes to submit to database
    this.props.onNewUserSubmit({
      employeeNameTM: employeeNameTM,
      roleNameTM: roleNameTM,
      employeeUsernameTM: employeeUsernameTM,
      employeePasswordTM: employeePasswordTM,
    });

    // Show Message to User when Employee User is Inserted
    window.alert("Employee User Added!");
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
        <h2>Insert a New Employee User</h2>
        {/* Create Table to Hold New Employee User Information */}
        <table>
          <tbody>
            <tr>
              {/* Create Employee Name Select List */}
              <th>Select Employee Name</th>
              <td>
                <SelectListEmployeesNames
                  data={this.state.employeeDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            <tr>
              {/* Create Role Name Select List */}
              <th>Select Role</th>
              <td>
                <SelectListRoleNames
                  data={this.state.roleDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
            {/* Create Username Input */}
            <tr>
              <th>Employee Username</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.employeeUsernameTM}
                  uniqueName="employeeUsernameTM"
                  textArea={false}
                  required={true}
                  minCharacters={5}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "employeeUsernameTM")}
                  errorMessage="Username is Invalid!"
                  emptyMessage="Username is Required!"
                />
              </td>
            </tr>
            {/* Create Employee Password Input */}
            <tr>
              <th>Employee Password</th>
              <td>
                <TextInput
                  inputType="password"
                  value={this.state.employeePasswordTM}
                  uniqueName="employeePasswordTM"
                  textArea={false}
                  required={true}
                  minCharacters={6}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "employeePasswordTM")}
                  errorMessage="Password is Invalid!"
                  emptyMessage="Password is Required!"
                />
              </td>
            </tr>
            {/* Create Employee Password Confirm Input */}
            <tr>
              <th>Employee Password</th>
              <td>
                <TextInput
                  inputType="password"
                  value={this.state.employeePassword2TM}
                  uniqueName="employeePassword2TM"
                  textArea={false}
                  required={true}
                  minCharacters={6}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "employeePassword2TM")}
                  errorMessage="Password is Invalid!"
                  emptyMessage="Password is Required!"
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button to Submit the form */}
        <input type="submit" value="Insert Employee User" />
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

// Select List for Employees
var SelectListEmployeesNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (employeeTypesTM) {
      return (
        <option
          key={employeeTypesTM.dbemployeeid}
          value={employeeTypesTM.dbemployeeid}
        >
          {employeeTypesTM.dbemployeefirstname +
            " " +
            employeeTypesTM.dbemployeelastname}
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
