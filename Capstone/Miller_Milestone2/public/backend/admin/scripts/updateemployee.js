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
  updateSingleEmployeeFromServer: function (employee) {
    $.ajax({
      url: "/updatesingleemp",
      dataType: "json",
      data: employee,
      type: "POST",
      cache: false,
      success: function (upSingleEmployeeData) {
        this.setState({ upSingleEmployeeData: upSingleEmployeeData });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },
  // Check to see if the Employees is loaded
  componentDidMount: function () {
    this.loadEmployeesFromServer();
    // setInterval(this.loadEmployeesFromServer, this.props.pollInterval);
  },

  // Render the EmployeeBox to appear on HTML
  render: function () {
    return (
      <div>
        <h1>Update Employees</h1>
        <EmployeeSelectForm onEmployeeSubmit={this.loadEmployeesFromServer} />
        <br />
        <div id="theresults">
          <div id="theleft">
            {/* Set Table to show TCTG Employees */}[]
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>Hire Date</th>
                  <th></th>
                </tr>
              </thead>
              <EmployeeList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <EmployeeUpdateForm
              onUpdateSubmit={this.updateSingleEmpFromServer}
            />
          </div>
        </div>
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
  render: function () {
    return (
      <div>
        <div id="theform">
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
        </div>
      </div>
    );
  },
});

var EmployeeUpdateForm = React.createClass({
  getInitialState: function () {
    return {
      upEmployeeFNameTM: "",
      upEmployeeLNameTM: "",
      upEmployeeEAddressTM: "",
      upEmployeePNumberTM: "",
      upEmployeeHDateTM: "",
    };
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upEmployeekeyTM = upempkeyTM.value;
    var upEmployeeFNameTM = upempFNameTM.value;
    var upEmployeeLNameTM = upempLNameTM.value;
    var upEmployeeEAddressTM = upempEAddressTM.value;
    var upEmployeePNumberTM = upempPNumberTM.value;
    var upEmployeeHDateTM = upempHDateTM.value;

    this.props.onUpdateSubmit({
      upEmployeekeyTM: upEmployeekeyTM,
      upEmployeeFNameTM: upEmployeeFNameTM,
      upEmployeeLNameTM: upEmployeeLNameTM,
      upEmployeeEAddressTM: upEmployeeEAddressTM,
      upEmployeePNumberTM: upEmployeePNumberTM,
      upEmployeeHDateTM: upEmployeeHDateTM,
    });
  },
  // Issue with handle change...
  handleUpChange: function (event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
  },
  render: function () {
    return (
      <div>
        <div id="theform">
          <form onSubmit={this.handleUpSubmit}>
            <table>
              <tbody>
                <tr>
                  <th>Employee First Name</th>
                  <td>
                    <input
                      type="text"
                      name="upemployeeFNameTM"
                      id="upemployeeFNameTM"
                      value={this.state.upemployeeFNameTM}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Last Name</th>
                  <td>
                    <input
                      name="upemployeeLNameTM"
                      id="upemployeeLNameTM"
                      value={this.state.upemployeeLNameTM}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee E-Mail</th>
                  <td>
                    <input
                      name="upemployeeEAddressTM"
                      id="upemployeeEAddressTM"
                      value={this.state.upemployeeEAddressTM}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Phone Number</th>
                  <td>
                    <input
                      name="upemployeePNumberTM"
                      id="upemployeePNumberTM"
                      value={this.state.upemployeePNumberTM}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Employee Hire Date</th>
                  <td>
                    <input
                      type="date"
                      name="upEmployeeHDateTM"
                      id="upEmployeeHDateTM"
                      value={this.state.upEmployeeHDateTM}
                      onChange={this.handleUpChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upempkeyTM"
              id="upempkeyTM"
              onChange={this.handleUpChange}
            />
            <input type="submit" value="Update Employee" />
          </form>
        </div>
      </div>
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
  getInitialState: function () {
    return {
      upEmpkeyTM: "",
      singleDataTM: [],
    };
  },
  updateRecord: function (e) {
    e.preventDefault();
    var theUpEmpkeyTM = this.props.key;

    this.loadSingleEmp(theUpEmpkeyTM);
  },
  loadSingleEmp: function (theUpEmpkeyTM) {
    $.ajax({
      url: "/getSingleTCTGEmployee",
      data: {
        upEmpkeyTM: theUpEmpkeyTM,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateEmp = this.state.singledata.map(function (employee) {
            upempkeyTM.value = theupempkey;
            upempFNameTM.value = employee.dbemployeeemail;
            upempLNameTM.value = employee.dbemployeeid;
            upempEAddressTM.value = employee.dbemployeephone;
            upempPNumberTM.value = employee.dbemployeesalary;
            upempHDateTM.value = employee.dbemployeename;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  render: function () {
    return (
      <tr>
        <td>{this.props.empkey}</td>
        <td>{this.props.empid}</td>
        <td>{this.props.empname}</td>
        <td>{this.props.empemail}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" />
          </form>
        </td>
      </tr>
    );
  },
});

var SelectUpdateList = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (empTypes) {
      return (
        <option key={empTypes.dbemptypeid} value={empTypes.dbemptypeid}>
          {empTypes.dbemptypename}
        </option>
      );
    });
    return (
      <select name="upemptype" id="upemptype">
        <option value="0"></option>
        {optionNodes}
      </select>
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
