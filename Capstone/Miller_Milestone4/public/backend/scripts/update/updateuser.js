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
    // To get data from table
    $.ajax({
      url: "/selectUsersA",
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

  updateSingleUserFromServer: function (User) {
    // Connect to database
    // To push new updated data to table
    $.ajax({
      url: "/updateSingleUser",
      dataType: "json",
      data: User,
      type: "POST",
      cache: false,
      success: function (upSingleUserDataTM) {
        this.setState({ upSingleUserDataTM: upSingleUserDataTM });
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
        // console.log("Logged in: " + this.state.viewThePageTM);
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  componentDidMount: function () {
    this.loadAllowLogin();
    // console.log(viewThePageTM)
    if (this.state.viewThePageTM != 0) {
      this.loadUsersFromServer();
    } 

    // setInterval(this.loadUsersFromServer, this.props.pollInterval);
  },

  // Render the box to HTML
  render: function () {
    // console.log(this.state.viewThePageTM)
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
        <div>
          {/* Show the select form */}
          <h1>Update User</h1>
          <UserSelectForm onUserSubmit={this.loadUsersFromServer} />
          <br />
          <div id="theresults">
            <div id="theleft">
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
                    <th></th>
                  </tr>
                </thead>
                {/* Show data from database into list */}
                <UserList data={this.state.data} />
              </table>
            </div>
            <div id="theright">
              {/* Show the Update Form */}
              <UserUpdateForm
                onUpdateSubmit={this.updateSingleUserFromServer}
              />
            </div>
          </div>
        </div>
      );
    }
  },
});

// Create Form for page
var UserSelectForm = React.createClass({
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

// Display Update Form
var UserUpdateForm = React.createClass({
  // Get Reward Data
  loadRoles: function () {
    $.ajax({
      url: "/getRoles",
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ updateUserRoleDataTM: data });
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
      updateUseridTM: "",
      updateUserFNameTM: "",
      updateUserLNameTM: "",
      updateUserEAddressTM: "",
      updateUserPNumberTM: "",
      updateUserHireDateTM: "",
      upUserSelectedOptionTM: "",
      updateUserAccessTM: "",
      updateUserRoleDataTM: [],
    };
  },

  // Handle the change when the user interacts with Radio button
  handleUpOptionChange: function (e) {
    this.setState({
      upUserSelectedOptionTM: e.target.value,
    });
  },

  handleUpSubmit: function (e) {
    e.preventDefault();

    // Get the values from the input fields
    var updateUseridTM = upUseridTM.value;
    var updateUserFNameTM = upUserFNameTM.value;
    var updateUserLNameTM = upUserLNameTM.value;
    var updateUserEAddressTM = upUserEAddressTM.value;
    var updateUserPNumberTM = upUserPNumberTM.value;
    var updateUserHireDateTM = upUserHDateTM.value;
    var updateUserAccessTM = this.state.upUserSelectedOptionTM;
    console.log(this.state.upUserSelectedOptionTM)
    var updateUserRoleTM = upRoleTypeTM.value;

    // Validate the Users First and Last Names
    if (updateUserFNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter a First Name that is Larger than three Characters."
      );
      return;
    }

    if (updateUserLNameTM.length < 3) {
      // Show Error to User
      window.alert(
        "Please Enter a Last Name that is Larger than three Characters."
      );
      return;
    }

    // Validate the users Email Address
    if (!this.validateEmail(updateUserEAddressTM)) {
      // console.log("Bad Email Address => " + this.validateEmail(userEAddressTM));
      // Show Error to User
      window.alert(
        "Please Enter a Valid Email address.\nExample:  John@email.com"
      );
      return;
    }

    // Validate Phone Number
    if (!this.phoneNumberValidate(updateUserPNumberTM)) {
      // Show Error to User
      window.alert(
        "Please Enter a Valid Phone Number in the given Format.\nExample (843)-555-5555"
      );
      return;
    }

    // Validate the User Hire Date
    if (!updateUserHireDateTM) {
      // Show Error to User
      window.alert("Please Enter a Hire Date.");
      return;
    }

    // Validate the User Access
    if (!updateUserAccessTM) {
      // Show Error to User
      window.alert("Select an Option to Activate the user.");
      return;
    }


    // Validate if the user selected an item from Role
    if (!this.validateSelectList(updateUserRoleTM)) {
      window.alert("Select a Role.");
      return;
    }

    if (
      !updateUserFNameTM ||
      !updateUserLNameTM ||
      !updateUserEAddressTM ||
      !updateUserPNumberTM ||
      !updateUserHireDateTM ||
      !updateUserAccessTM ||
      !updateUserRoleTM
    ) {
      // console.log("Field Missing");
      return;
    }

    // Show confirm button if user wants to processed with the update
    if (confirm("Are you sure you want to update record?") == true) {
      // Use Values in Text boxes to submit to database
      this.props.onUpdateSubmit({
        updateUseridTM: updateUseridTM,
        updateUserFNameTM: updateUserFNameTM,
        updateUserLNameTM: updateUserLNameTM,
        updateUserEAddressTM: updateUserEAddressTM,
        updateUserPNumberTM: updateUserPNumberTM,
        updateUserHireDateTM: updateUserHireDateTM,
        updateUserAccessTM: updateUserAccessTM,
        updateUserRoleTM: updateUserRoleTM,
      });

      // Show Message to User when data is updated
      window.alert("User Updated!");
    } else {
      window.alert("Update Canceled!");
    }
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

  // Regex to check if user selected an item
  validateSelectList: function (userSelectedOption) {
    // console.log(userSelectedOption);
    if (!userSelectedOption) {
      return false;
    } else {
      return true;
    }
  },

  // Set Common Validate for other Validations
  commonValidate: function () {
    return true;
  },

  // Update the value for variable when user interacts with input
  handleUpChange: function (event) {
    this.setState({
      test: console.log(event.target.id),
      [event.target.id]: event.target.value,
    });
  },

  // Render the form
  render: function () {
    return (
      <div>
        <div id="updateForm">
          <form onSubmit={this.handleUpSubmit}>
            <h2>Update User Information</h2>
            <table>
              <tbody>
                {/* Display User's First Name for Input */}
                <tr>
                  <th>User's First Name</th>
                  <td>
                    <input
                      type="text"
                      name="upUserFNameTM"
                      id="upUserFNameTM"
                      value={this.state.upUserFNameTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display User's Last Name for Input */}
                <tr>
                  <th>User's Last Name</th>
                  <td>
                    <input
                      type="text"
                      name="upUserLNameTM"
                      id="upUserLNameTM"
                      value={this.state.upUserLNameTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display User's Email Address for Input */}
                <tr>
                  <th>User's Email Address</th>
                  <td>
                    <input
                      name="upUserEAddressTM"
                      id="upUserEAddressTM"
                      value={this.state.upUserEAddressTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display User's Phone Number for Input */}
                <tr>
                  <th>User's Phone Number</th>
                  <td>
                    <input
                      name="upUserPNumberTM"
                      id="upUserPNumberTM"
                      value={this.state.upUserPNumberTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Display User's Hire Date for Input */}
                <tr>
                  <th>User's Hire Date</th>
                  <td>
                    <input
                      type="date"
                      name="upUserHDateTM"
                      id="upUserHDateTM"
                      value={this.state.upUserHDateTM}
                      onChange={this.state.handleUpChange}
                    />
                  </td>
                </tr>
                {/* Create Radio button to either activate/deactivate  user */}
                <tr>
                  <th>Activate User for Sign in?</th>
                  <td>
                    <input
                      type="radio"
                      name="upUserActivate"
                      id="upUserActivateYes"
                      value="1"
                      checked={this.state.upUserSelectedOptionTM === "1"}
                      onChange={this.handleUpOptionChange}
                      className="form-check-input"
                    />
                    Yes
                    <input
                      type="radio"
                      name="upUserActivate"
                      id="upUserActivateNo"
                      value="0"
                      checked={this.state.upUserSelectedOptionTM === "0"}
                      onChange={this.handleUpOptionChange}
                      className="form-check-input"
                    />
                    No
                  </td>
                </tr>
                <tr>
                  {/* Create Role Select List */}
                  <th>Role for User</th>
                  <td>
                    <SelectUpdateListRoleNames
                      data={this.state.updateUserRoleDataTM}
                      validate={this.validateSelectList}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <input
              type="hidden"
              name="upUseridTM"
              id="upUseridTM"
              onChange={this.handleUpChange}
            />
            {/* Show Submit Button to Submit the form */}
            <input type="submit" value="Update User" id="buttonSubmit" />
          </form>
        </div>
      </div>
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
          userIdTM={userTM.dbuserid}
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
  getInitialState: function () {
    return {
      upUseridTM: "",
      singleUserDataTM: [],
    };
  },

  // Get id from text box and pass it to function to populate input fields for update form
  updateRecord: function (e) {
    e.preventDefault();
    var theUpUseridTM = this.props.userIdTM;

    this.loadSingleUser(theUpUseridTM);
  },

  loadSingleUser: function (theUpUseridTM) {
    $.ajax({
      url: "/selectSingleUser",
      data: {
        upUseridTM: theUpUseridTM,
      },
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ singleUserDataTM: data });
        // console.log(this.state.singleUserDataTM);

        // Get values from database and assign them to input fields to show
        var populateUser = this.state.singleUserDataTM.map(function (user) {
          upUseridTM.value = theUpUseridTM;
          upUserFNameTM.value = user.dbuserfirstname;
          upUserLNameTM.value = user.dbuserlastname;
          upUserEAddressTM.value = user.dbuseremailaddress;
          upUserPNumberTM.value = user.dbuserphonenumber;
          upUserHDateTM.value = user.dbuserhiredate;
          if (user.dbuseraccess == 1) {
            upUserActivateYes.checked = true;
            var upUserSelectedOptionTM = 1 
          } else {
            upUserActivateNo.checked = true;
            var upUserSelectedOptionTM = 0;
          }
          upRoleTypeTM.value = user.dbroleid;
        });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

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
        {/* <td>{this.props.playIdTM}</td> */}
        <td>{this.props.userFNameTM}</td>
        <td>{this.props.userLNameTM}</td>
        <td>{this.props.userEAddressTM}</td>
        <td>{this.props.userPNumberTM}</td>
        <td>{dateTM}</td>
        <td>{theUserAccessTM}</td>
        <td>{this.props.userRoleTM}</td>
        <td>
          <form onSubmit={this.updateRecord}>
            <input type="submit" value="Update Record" id="buttonSubmit" />
          </form>
        </td>
      </tr>
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
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

// Select Update List for Roles
var SelectUpdateListRoleNames = React.createClass({
  render: function () {
    var optionNodes = this.props.data.map(function (roleTypesTM) {
      return (
        <option key={roleTypesTM.dbroleid} value={roleTypesTM.dbroleid}>
          {roleTypesTM.dbrolename}
        </option>
      );
    });
    return (
      <select name="upRoleTypeTM" id="upRoleTypeTM">
        <option></option>
        {optionNodes}
      </select>
    );
  },
});

ReactDOM.render(<UserBox />, document.getElementById("content"));
