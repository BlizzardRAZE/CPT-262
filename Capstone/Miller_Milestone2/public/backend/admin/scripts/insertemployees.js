// Create Employee box for TCTG Employee
var EmployeeBox = React.createClass({
  handleEmployeeSubmit: function (TCTGEmployee) {
    // Connect to database
    $.ajax({
      url: "/newTCTGEmployee",
      dataType: "json",
      type: "POST",
      data: TCTGEmployee,
      success: function (data) {
        //We set the state again after submission, to update with the submitted data
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Render the EmployeeBox to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>Insert Employee</h1>
        {/* Get EmployeeInsertForm to put in Box */}
        <EmployeeInsertForm onNewEmployeeSubmit={this.handleEmployeeSubmit} />
      </div>
    );
  },
});

// Create Form for page
var EmployeeInsertForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      employeeFNameTM: "",
      employeeLNameTM: "",
      employeeEAddressTM: "",
      employeePNumberTM: "",
      employeeHDateTM: "",
    };
  },

  handleSubmit: function (e) {
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // Get the values from the input fields
    var employeeFNameTM = this.state.employeeFNameTM.trim();
    var employeeLNameTM = this.state.employeeLNameTM.trim();
    var employeeEAddressTM = this.state.employeeEAddressTM.trim();
    var employeePNumberTM = this.state.employeePNumberTM.trim();
    var employeeHDateTM = this.state.employeeHDateTM.trim();

    // Validate the Employees First and Last Names
    if (employeeFNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter the Employee's First Name that is Larger than three Characters."
      );
      return;
    }

    if (employeeLNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter the Employee's Last Name that is Larger than three Characters."
      );
      return;
    }

    // Validate the Employees Email Address
    if (!this.validateEmail(employeeEAddressTM)) {
      // console.log("Bad Email Address => " + this.validateEmail(employeeEAddressTM));
      // Show Error to User
      window.alert(
        "Please Enter a Valid Email address.\nExample:  John@email.com"
      );
      return;
    }

    // Validate Phone Number
    if (!this.phoneNumberValidate(employeePNumberTM)) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Phone Number in the given Format.\nExample (843)-555-5555"
      );
      return;
    }

    // Validate the Employee Hire Date
    if (!employeeHDateTM) {
      // console.log('Date: ' + employeeHDateTM);
      // Show Error to User
      window.alert("Please Enter a Hire Date.");
      return;
    }

    if (
      !employeeFNameTM ||
      !employeeLNameTM ||
      !employeeEAddressTM ||
      !employeePNumberTM ||
      !employeeHDateTM
    ) {
      // console.log("Field Missing");
      return;
    }

    // Use Values in Text boxes to submit to database
    this.props.onNewEmployeeSubmit({
      employeeFNameTM: employeeFNameTM,
      employeeLNameTM: employeeLNameTM,
      employeeEAddressTM: employeeEAddressTM,
      employeePNumberTM: employeePNumberTM,
      employeeHDateTM: employeeHDateTM,
    });

    // Show Message to User when Employee is Inserted
    window.alert("Employee Added!");
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
        <h2>Insert a New Employee</h2>
        {/* Create Table to Hold New Employee Information */}
        <table>
          <tbody>
            <tr>
              {/* Create Employee First Name Input */}
              <th>Employee First Name</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.employeeFNameTM}
                  uniqueName="employeeFNameTM"
                  placeholder="John"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "employeeFNameTM")}
                  errorMessage="Employee First Name is Invalid!"
                  emptyMessage="Employee First Name is Required!"
                />
              </td>
            </tr>
            {/* Create Employee Last Name Input */}
            <tr>
              <th>Employee Last Name</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.employeeLNameTM}
                  placeholder="Doe"
                  uniqueName="employeeLNameTM"
                  textArea={false}
                  required={true}
                  minCharacters={3}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "employeeLNameTM")}
                  errorMessage="Employee Last Name is Invalid!"
                  emptyMessage="Employee Last Name is Required!"
                />
              </td>
            </tr>
            {/* Create Employee Email Input */}
            <tr>
              <th>Employee E-Mail</th>
              <td>
                <TextInput
                  inputType="text"
                  value={this.state.employeeEAddressTM}
                  uniqueName="employeeEAddressTM"
                  textArea={false}
                  required={true}
                  validate={this.validateEmail}
                  onChange={this.setValue.bind(this, "employeeEAddressTM")}
                  errorMessage="Email Address is Invalid!"
                  emptyMessage="Email Address is Required!"
                />
              </td>
            </tr>
            {/* Create Employee Phone Number */}
            <tr>
              <th>Employee Phone Number</th>
              <td>
                <TextInput
                  value={this.state.employeePNumberTM}
                  uniqueName="employeePNumberTM"
                  textArea={false}
                  required={true}
                  minCharacters={14}
                  maxCharacters={14}
                  validate={this.phoneNumberValidate}
                  onChange={this.setValue.bind(this, "employeePNumberTM")}
                  errorMessage="Phone Number is Invalid!"
                  emptyMessage="Phone Number is Required!"
                />
              </td>
            </tr>
            {/* Create Employee Hire Date */}
            <tr>
              <th>Employee Hire Date</th>
              <td>
                <DateInput
                  inputType="date"
                  value={this.state.employeeHDateTM}
                  uniqueName="employeeHDateTM"
                  required={true}
                  validate={this.commonValidate}
                  onChange={this.setValue.bind(this, "employeeHDateTM")}
                  errorMessage="Hire Date is Invalid!"
                  emptyMessage="Hire Date is Required!"
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Show Submit Button to Submit the form */}
        <input type="submit" value="Insert Employee" />
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

// Place items into element Id named content
ReactDOM.render(<EmployeeBox />, document.getElementById("content"));
