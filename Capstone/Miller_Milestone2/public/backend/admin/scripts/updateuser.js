// Create EmployeeUser box for TCTG EmployeeUser
var EmployeeUserBox = React.createClass({
  getInitialState: function () {
    return { data: [] };
  },
  loadEmployeeUsersFromServer: function () {
    // Connect to database
    $.ajax({
      url: "/getEmployeeUser",
      data: {
        employeeFirstNameTM: employeeFirstNameTM.value,
        employeeLastNameTM: employeeLastNameTM.value,
        employeeEmailAddressTM: employeeEmailAddressTM.value,
        employeeUsernameTM: employeeUsernameTM.value,
        roleNameTM: roleTypeTM.value,
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
  updateSingleEmployeeUserFromServer: function (employeeuser) {
    $.ajax({
      url: "/updateSingleEmployeeUser",
      dataType: "json",
      data: employeeuser,
      type: "POST",
      cache: false,
      success: function (upSingleEmployeeUserDataTM) {
        this.setState({
          upSingleEmployeeUserDataTM: upSingleEmployeeUserDataTM,
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
    window.location.reload(true);
  },
  // Check to see if the Employees is loaded
  componentDidMount: function () {
    this.loadEmployeeUsersFromServer();
    // setInterval(this.loadEmployeeUsersFromServer, this.props.pollInterval);
  },

  // Render the EmployeeBox to appear on HTML
  render: function () {
    return (
      <div>
        <h1>Update Employees</h1>
        <EmployeeUserSelectForm
          onEmployeeSubmit={this.loadEmployeesFromServer}
        />
        <br />
        <div id="theresults">
          <div id="theleft">
            {/* Set Table to show TCTG Employees */}
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email Address</th>
                  <th>Username</th>
                  <th></th>
                </tr>
              </thead>
              <EmployeeUserList data={this.state.data} />
            </table>
          </div>
          <div id="theright">
            <EmployeeUserListUpdateForm
              onUpdateSubmit={this.updateSingleEmpFromServer}
            />
          </div>
        </div>
      </div>
    );
  },
});

// Create Form for page
var EmployeeUserSelectForm = React.createClass({
  // Create Variables and their Initial State
  getInitialState: function () {
    return {
      employeeDataTM: [],
      roleDataTM: [],
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
    e.preventDefault();

    // Get the values from the input fields
    var employeeFNameTM = employeeFNameTypeTM.value;
    var employeeLNameTM = employeeLNameTypeTM.value;
    var employeeEAddressTM = this.state.employeeEAddressTM.trim();
    var employeeUsernameTM = this.state.employeeUsernameTM.trim();
    var roleNameTM = roleTypeTM.value;

    // Use Values in Text boxes to submit to database
    this.props.onEmployeeSubmit({
      employeeFNameTM: employeeFNameTM,
      employeeLNameTM: employeeLNameTM,
      employeeEAddressTM: employeeEAddressTM,
      employeeUsernameTM: employeeUsernameTM,
      roleNameTM: roleNameTM,
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
            <h2>View Employee Users</h2>
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
                  {/* Create Employee Username Input */}
                  <th>Employee Username</th>
                  <td>
                    <input
                      name="employeePNumberTM"
                      id="employeePNumberTM"
                      value={this.state.empEAddressTM}
                      onChange={this.handleChange}
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
              </tbody>
            </table>
            <input type="submit" value="Search Employee User" />
          </form>
        </div>
      </div>
    );
  },
});

var EmployeeUserListUpdateForm = React.createClass({
  getInitialState: function () {
    return {
      upEmployeeUNameTM: "",
    };
  },
  handleUpSubmit: function (e) {
    e.preventDefault();

    var upEmployeekeyTM = upempkeyTM.value;
    var upEmployeeUNameTM = upempUNameTM.value;

    this.props.onUpdateSubmit({
      upEmployeekeyTM: upEmployeekeyTM,
      upEmployeeUNameTM: upEmployeeUNameTM,
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
                  <th>Employee Username</th>
                  <td>
                    <input
                      type="text"
                      name="upempUNameTM"
                      id="upempUNameTM"
                      value={this.state.upempUNameTM}
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
            <input type="submit" value="Update Employee User" />
          </form>
        </div>
      </div>
    );
  },
});

// Place Items from Database to table
var EmployeeUserList = React.createClass({
  render: function () {
    var employeeUserNodes = this.props.data.map(function (employeeUserTM) {
      //map the data to individual donations
      return (
        <EmployeeUser
          key={employeeUserTM.dbemployeeid}
          empUNameTM={employeeUserTM.dbemployeeusername}
        ></EmployeeUser>
      );
    });

    //print all the nodes in the list
    return <tbody>{employeeUserNodes}</tbody>;
  },
});

var EmployeeUser = React.createClass({
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
      url: "/getSingleEmployeeUser",
      data: {
        upEmpkeyTM: theUpEmpkeyTM,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singledata: data });
        console.log(this.state.singledata);
        var populateEmp = this.state.singledata.map(function (employeeUser) {
          upempkeyTM.value = theupempkey;
          upempUNameTM.value = employeeUser.dbemployeeusername;
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

ReactDOM.render(<EmployeeUserBox />, document.getElementById("content"));
