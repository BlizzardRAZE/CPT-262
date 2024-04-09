// Create Login Box for User
var LoginBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
    };
  },
  // Send information to server to check if user exists
  handleLogin: function (logininfo) {
    $.ajax({
      url: "/loginUser/",
      dataType: "json",
      type: "POST",
      data: logininfo,
      success: function (data) {
        this.setState({ data: data });
        if (typeof data.redirect == "string") {
          window.location = data.redirect;
        }
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  // Render the entire Login Page
  render: function () {
    return (
      <div>
        <h1>TCTG User Login</h1>

        <LoginForm onLoginSubmit={this.handleLogin} />
        <br />
      </div>
    );
  },
});

// Create Login Form so user can input their information
var LoginForm = React.createClass({
  // Set Variables
  getInitialState: function () {
    return {
      userEmailAddressTM: "",
      userPasswordTM: "",
    };
  },
  //  Function to get information from text boxes and pass it to LoginSubmit to be sent to database
  handleSubmit: function (e) {
    e.preventDefault();

    var userEmailAddressTM = this.state.userEmailAddressTM.trim();
    var userPasswordTM = this.state.userPasswordTM.trim();

    // Check to see if user entered value in email text box
    if (!this.validateEmail(userEmailAddressTM)) {
      window.alert("Enter Email Address!");
      return;
    }

    // Check to see if user entered a value in password text box
    if (!userPasswordTM) {
      window.alert("Enter Password!");
      return;
    }

    // Pass these values to onLoginSubmit
    this.props.onLoginSubmit({
      userEmailAddressTM: userEmailAddressTM,
      userPasswordTM: userPasswordTM,
    });
  },

  //Regex to Validate Email Address
  validateEmail: function (value) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },

  // Function to change the value of the variables when user interacts with text box
  handleChange: function (event) {
    // Set the value based on ID
    this.setState({
      [event.target.id]: event.target.value,
    });
  },

  // Render the form
  render: function () {
    return (
      <div className="loginContainer">
        {/* Create Div to hold form */}
        <div>
          {/* Create the form */}
          <form onSubmit={this.handleSubmit}>
            <h2>Please Enter in your Email Address and Password</h2>
            <table>
              <tbody>
                {/* Create User a label for User email and Input Field */}
                <tr>
                  <th>Email Address</th>
                  <td>
                    <input
                      name="userEmailAddressTM"
                      id="userEmailAddressTM"
                      value={this.state.userEmailAddressTM}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                {/* Create User a label for User password and Input Field */}
                <tr>
                  <th>Password</th>
                  <td>
                    <input
                      type="password"
                      name="userPasswordTM"
                      id="userPasswordTM"
                      value={this.state.userPasswordTM}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            {/* Submit the form */}
            <input type="submit" value="Enter Login" id="submitButton" />
          </form>
        </div>
        <div id="clearForm">
          <br />
          {/* Clear any information in input fields */}
          <form onSubmit={this.getInitialState}>
            <input type="submit" value="Clear Form" id="submitButton" />
          </form>
        </div>
      </div>
    );
  },
});

// Place items into element Id named content
ReactDOM.render(<LoginBox />, document.getElementById("content"));
