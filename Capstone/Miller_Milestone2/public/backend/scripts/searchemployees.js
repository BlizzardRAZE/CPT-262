// Create Employee box for TCTG Employee
var EmployeeBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadEmployeesFromServer: function () {
    // Connect to database
    $.ajax({
      url: "/getTCTGEmployee",
      data: {
        employeeFirstNameTM: employeeFirstNameTM.value,
        employeeLastNameTM: employeeLastNameTM.value,
        employeeEmailAddressTM: employeeEmailAddressTM.value,
        employeePhoneNumberTM: employeePhoneNumberTM.value,
        employeeHireDateTM: employeeHireDateTM.value,
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
  // Check to see if the Employees is loaded
  componentDidMount: function () {
    this.loadEmployeesFromServer();
  },

  // Render the EmployeeBox to appear on HTML
  render: function () {
    return (
      // Set Class name to main Content box
      <div className="mainContentBox">
        <h1>View Employees</h1>
        {/* Get EmployeeSelectForm to put in Box */}
        <EmployeeSelectForm onEmployeeSubmit={this.loadEmployeesFromServer} />
        <br />
        {/* Set Table to show TCTG Employees */}
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Hire Date</th>
            </tr>
          </thead>
          {/* Show list of Employees */}
          <EmployeeList data={this.state.data} />
        </table>
      </div>
    );
  },
});

// Create Form for page
var EmployeeSelectForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      employeeDataTM: [],
      employeeEAddressTM: "",
      employeePNumberTM: "",
      employeeHDateTM: "",
    };
  },
  handleOptionChange: function (e) {
    this.setState({
      selectedOption: e.target.value,
    });
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

  // Check to see if components are mounted
  componentDidMount: function () {
    this.loadEmployeeNames();
  },

  handleSubmit: function (e) {
    //We don't want the form to submit, so we prevent the default behavior
    e.preventDefault();

    // Get the values from the input fields
    var employeeFNameTM = employeeFNameTypeTM.value;
    var employeeLNameTM = employeeLNameTypeTM.value;
    var employeeEAddressTM = this.state.employeeEAddressTM.trim();
    var employeePNumberTM = this.state.employeePNumberTM.trim();
    var employeeHDateTM = this.state.employeeHDateTM.trim();

    // Use Values in Text boxes to submit to database
    this.props.onEmployeeSubmit({
      employeeFNameTM: employeeFNameTM,
      employeeLNameTM: employeeLNameTM,
      employeeEAddressTM: employeeEAddressTM,
      employeePNumberTM: employeePNumberTM,
      employeeHDateTM: employeeHDateTM,
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
        <h2>View Employees</h2>
        <table>
          <tbody>
            <tr>
              {/* Create Employee Name Select List [Both First and Last] */}
              <th>Select Employee First Name</th>
              <td>
                <SelectListEmployeesFirstNames
                  data={this.state.employeeDataTM}
                />
              </td>
            </tr>
            <tr>
              {/* Create Employee Name Select List [Both First and Last] */}
              <th>Select Employee Last Name</th>
              <td>
                <SelectListEmployeesLastNames
                  data={this.state.employeeDataTM}
                />
              </td>
            </tr>
            <tr>
              {/* Create Employee E-Mail Input */}
              <th>Employee E-Mail</th>
              <td>
                <input
                  name="employeeEAddressTM"
                  id="employeeEAddressTM"
                  value={this.state.employeeEAddressTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            <tr>
              {/* Create Employee Phone Number Input */}
              <th>Employee Phone Number</th>
              <td>
                <input
                  name="employeePNumberTM"
                  id="employeePNumberTM"
                  value={this.state.employeePNumberTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Do not change to a date picker */}
            {/* Leave as textbox to allow functionality to search year by itself */}
            <tr>
              <th>Employee Hire Date</th>
              <td>
                <input
                  name="employeeHDateTM"
                  id="employeeHDateTM"
                  value={this.state.employeeHDateTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Search Employee" />
      </form>
    );
  },
});

// Place Items from Database to table
var EmployeeList = React.createClass({
  render: function () {
    var employeeNodes = this.props.data.map(function (employeeTM) {
      //map the data to individual donations
      return (
        <TCTGEmployee
          key={employeeTM.dbemployeeid}
          empFNameTM={employeeTM.dbemployeefirstname}
          empLNameTM={employeeTM.dbemployeelastname}
          empEAddressTM={employeeTM.dbemployeeemailaddress}
          empPNumberTM={employeeTM.dbemployeephonenumber}
          empHDateTM={employeeTM.dbemployeehiredate}
        ></TCTGEmployee>
      );
    });

    //print all the nodes in the list
    return <tbody>{employeeNodes}</tbody>;
  },
});

var TCTGEmployee = React.createClass({
  // Render Each item in database
  render: function () {
    return (
      <tr>
        <td>{this.props.empFNameTM}</td>
        <td>{this.props.empLNameTM}</td>
        <td>{this.props.empEAddressTM}</td>
        <td>{this.props.empPNumberTM}</td>
        <td>{this.props.empHDateTM}</td>
      </tr>
    );
  },
});

// Select List for Employees
var SelectListEmployeesFirstNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (employeeTypesTM) {
      return (
        <option
          key={employeeTypesTM.dbemployeeid}
          value={employeeTypesTM.dbemployeeid}
        >
          {employeeTypesTM.dbemployeefirstname}
        </option>
      );
    });
    return (
      <select name="employeeFNameTypeTM" id="employeeFNameTypeTM">
        <option value="0"></option>
        {optionNodes}
      </select>
    );
  },
});

// Select List for Employees
var SelectListEmployeesLastNames = React.createClass({
    render: function () {
      var optionNodes = this.props.data.map(function (employeeTypesTM) {
        return (
          <option
            key={employeeTypesTM.dbemployeeid}
            value={employeeTypesTM.dbemployeeid}
          >
            {employeeTypesTM.dbemployeelastname}
          </option>
        );
      });
      return (
        <select name="employeeLNameTypeTM" id="employeeLNameTypeTM">
          <option value="0"></option>
          {optionNodes}
        </select>
      );
    },
  });

ReactDOM.render(<EmployeeBox />, document.getElementById("content"));
