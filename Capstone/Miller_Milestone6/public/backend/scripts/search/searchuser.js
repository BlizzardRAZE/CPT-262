// Create User box for User
var UserBox = React.createClass({
  getInitialState: function () {
    return { data: [], loginData: [], viewThePageTM: 0 };
  },
  loadUsersFromServer: function () {
    var userAccessIdentifierTM = 2;
    if (userActivateYes.checked) {
      userAccessIdentifierTM = 1;
    }
    if (userActivateNo.checked) {
      userAccessIdentifierTM = 0;
    }

    // Connect to database
    $.ajax({
      url: "/selectUsers",
      data: {
        userFNameTM: userFNameTM.value,
        userLNameTM: userLNameTM.value,
        userEAddressTM: userEAddressTM.value,
        userPNumberTM: userPNumberTM.value,
        userHireDateTM: userHireDateTM.value,
        userAccessTM: userAccessIdentifierTM,
        userRoleTM: roleTypeTM.value,
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
  // Get the Role Id to see if user can interact with the page
  loadAllowLogin: function () {
    $.ajax({
      url: "/getUserLoggedIn",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ loginData: datalog });
        this.setState({ viewThePageTM: this.state.loginData[0].dbroleid });
        this.loadUsersFromServer();
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  // Check to see if items are loaded from server

  componentDidMount: function () {
    this.loadAllowLogin();
  },

  // Render the box to HTML
  render: function () {
    // If User Doesn't have a token, or if there was a token error. Hide links and allow user to sign in again
    if (
      this.state.viewThePageTM == 0 ||
      (this.state.viewThePageTM != 1 && this.state.viewThePageTM != 2)
    ) {
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
          <h1>View Users</h1>
          {/* Show the form */}
          <UserForm onUserSubmit={this.loadUsersFromServer} />
          <br />
          {/* Create Table and put data from database into here (Use the List) */}
          <table id="resultData">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email Address</th>
                <th>Phone Number</th>
                <th>Hire Date</th>
                <th>Access</th>
                <th>Role</th>
              </tr>
            </thead>
            <UserList data={this.state.data} />
          </table>
        </div>
      );
    }
  },
});

// Create Form for page
var UserForm = React.createClass({
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
    e.preventDefault();

    // Get the values from the input fields
    var userFNameTM = this.state.userFNameTM.trim();
    var userLNameTM = this.state.userLNameTM.trim();
    var userEAddressTM = this.state.userEAddressTM.trim();
    var userPNumberTM = this.state.userPNumberTM.trim();
    var userHireDateTM = this.state.userHireDateTM.trim();
    var userAccessTM = this.state.selectedOption;
    var userRoleTM = roleTypeTM.value;

    // Use Values in Text boxes to submit to database
    this.props.onUserSubmit({
      userFNameTM: userFNameTM,
      userLNameTM: userLNameTM,
      userEAddressTM: userEAddressTM,
      userPNumberTM: userPNumberTM,
      userHireDateTM: userHireDateTM,
      userAccessTM: userAccessTM,
      userRoleTM: userRoleTM,
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
        <h2>Search a User</h2>
        {/* Create Table to hold form */}
        <table>
          <tbody>
            {/* Display User's First Name for Input */}
            <tr>
              <th>User's First Name</th>
              <td>
                <input
                  type="text"
                  name="userFNameTM"
                  id="userFNameTM"
                  value={this.state.userFNameTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display User's Last Name for Input */}
            <tr>
              <th>User's Last Name</th>
              <td>
                <input
                  type="text"
                  name="userLNameTM"
                  id="userLNameTM"
                  value={this.state.userLNameTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display User's Email Address for Input */}
            <tr>
              <th>User's Email Address</th>
              <td>
                <input
                  name="userEAddressTM"
                  id="userEAddressTM"
                  value={this.state.userEAddressTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display User's Phone Number for Input */}
            <tr>
              <th>User's Phone Number</th>
              <td>
                <input
                  name="userPNumberTM"
                  id="userPNumberTM"
                  value={this.state.userPNumberTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Display User's Hire Date for Input */}
            <tr>
              <th>User's Hire Date</th>
              <td>
                <input
                  type="date"
                  name="userHireDateTM"
                  id="userHireDateTM"
                  value={this.state.userHireDateTM}
                  onChange={this.handleChange}
                />
              </td>
            </tr>
            {/* Create Radio button */}
            <tr>
              <th>Access to Backend Portal</th>
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
                Yes
                <input
                  type="radio"
                  name="userActivate"
                  id="userActivateNo"
                  value="0"
                  checked={this.state.selectedOption === "0"}
                  onChange={this.handleOptionChange}
                  className="form-check-input"
                />
                No
              </td>
            </tr>
            <tr>
              {/* Create Role Select List */}
              <th>Role for User</th>
              <td>
                <SelectListRoleNames
                  data={this.state.userRoleDataTM}
                  validate={this.validateSelectList}
                />
              </td>
            </tr>
          </tbody>
        </table>
        {/* Submit button to Search User */}
        <input type="submit" value="Search User" id="buttonSubmit" />
      </form>
    );
  },
});

// Display User Information
var UserList = React.createClass({
  // Render in data for database
  render: function () {
    var userNodes = this.props.data.map(function (userTM) {
      //map the data
      return (
        <User
          key={userTM.dbuserid}
          userFNameTM={userTM.dbuserfirstname}
          userLNameTM={userTM.dbuserlastname}
          userEAddressTM={userTM.dbuseremailaddress}
          userPNumberTM={userTM.dbuserphonenumber}
          userHDateTM={userTM.dbuserhiredate}
          userAccessTM={userTM.dbuseraccess}
          userRoleTM={userTM.dbrolename}
        ></User>
      );
    });

    //Print all the nodes in the list
    return <tbody>{userNodes}</tbody>;
  },
});

var User = React.createClass({
  render: function () {
    // Spit the Date
    var dateSplitTM = this.props.userHDateTM.split("-");
    // Create Variables
    var dateTM = "";

    // Format Date
    dateTM = +dateSplitTM[1] + "/" + dateSplitTM[2] + "/" + dateSplitTM[0];

    // Show yes or no based on number
    if (this.props.userAccessTM == 1) {
      var theUserAccessTM = "Yes";
    } else {
      var theUserAccessTM = "No";
    }
    //Display info
    return (
      <tr>
        <td>{this.props.userFNameTM}</td>
        <td>{this.props.userLNameTM}</td>
        <td>{this.props.userEAddressTM}</td>
        <td>{this.props.userPNumberTM}</td>
        <td>{dateTM}</td>
        <td>{theUserAccessTM}</td>
        <td>{this.props.userRoleTM}</td>
      </tr>
    );
  },
});

// Select List for Roles
var SelectListRoleNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (roleTypesTM) {
      return (
        <option key={roleTypesTM.dbroleid} value={roleTypesTM.dbrolename}>
          {roleTypesTM.dbrolename}
        </option>
      );
    });
    return (
      <select name="roleTypeTM" id="roleTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Place items into element Id named content
ReactDOM.render(<UserBox />, document.getElementById("content"));
