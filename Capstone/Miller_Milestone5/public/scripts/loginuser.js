// Create Login Box for Player
var LoginBox = React.createClass({
  getInitialState: function () {
    return {
      data: [],
    };
  },
  // Send information to server to check if player exists
  handleLogin: function (logininfo) {
    $.ajax({
      url: "/loginPlayer/",
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
        <h1>Login</h1>

        <LoginForm onLoginSubmit={this.handleLogin} />
        <br />
      </div>
    );
  },
});

// Create Login Form so Player can input their information
var LoginForm = React.createClass({
  // Set Variables
  getInitialState: function () {
    return {
      playerEmailAddressTM: "",
      playerPasswordTM: "",
    };
  },
  //  Function to get information from text boxes and pass it to LoginSubmit to be sent to database
  handleSubmit: function (e) {
    e.preventDefault();

    var playerEmailAddressTM = this.state.playerEmailAddressTM.trim();
    var playerPasswordTM = this.state.playerPasswordTM.trim();

    // Check to see if player entered value in email text box
    if (!this.validateEmail(playerEmailAddressTM)) {
      window.alert("Enter Email Address!");
      return;
    }

    // Check to see if player entered a value in password text box
    if (!playerPasswordTM) {
      window.alert("Enter Password!");
      return;
    }

    // Pass these values to onLoginSubmit
    this.props.onLoginSubmit({
      playerEmailAddressTM: playerEmailAddressTM,
      playerPasswordTM: playerPasswordTM,
    });
  },

  //Regex to Validate Email Address
  validateEmail: function (value) {
    var re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
  },

  // Function to change the value of the variables when player interacts with text box
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
            <table>
              <tbody>
                {/* Create Player a label for Player email and Input Field */}
                <tr>
                  <th>Email Address</th>
                  <td>
                    <input
                      name="playerEmailAddressTM"
                      id="playerEmailAddressTM"
                      value={this.state.playerEmailAddressTM}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                {/* Create Player a label for Player password and Input Field */}
                <tr>
                  <th>Password</th>
                  <td>
                    <input
                      type="password"
                      name="playerPasswordTM"
                      id="playerPasswordTM"
                      value={this.state.playerPasswordTM}
                      onChange={this.handleChange}
                    />
                  </td>
                </tr>
                {/* Create Link to Sign Up if Player does not have a account */}
                <tr>
                  <th>No Account?</th>
                  <td><a href="../index.html">Sign Up!</a></td>
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
