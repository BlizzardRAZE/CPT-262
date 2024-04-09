// Show Navigation in Backend
var ShowNavTM = React.createClass({
  getInitialState: function () {
    return { data: [], userFNameTM: "", userLNameTM: "", viewThePageTM: 0 };
  },
  // Get the Role Id to see if user can interact with the page
  loadAllowLogin: function () {
    $.ajax({
      url: "/getUserLoggedIn",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ data: datalog });
        this.setState({ userFNameTM: this.state.data[0].dbuserfirstname });
        this.setState({ userLNameTM: this.state.data[0].dbuserlastname });
        this.setState({ viewThePageTM: this.state.data[0].dbroleid });
        // console.log("Logged in: " + this.state.viewThePageTM);
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
  render: function () {
    // If User Doesn't have a token, or if there was a token error. Hide links and allow user to sign in again
    if (this.state.viewThePageTM == 0) {
      return (
        <div className="tokenErrorContainer">
          <span>Sorry! An Error has Occurred. Please Sign-In!</span>
          <a href="../">Login</a>
        </div>
      );
    }

    // Show Links if user is Manager
    if (this.state.viewThePageTM == 1) {
      return (
        <div className="navBarJS">
          <div className="userNameContainer">
            {/* Show User's Name */}
            <span>
              Welcome,{" "}
              {" " + this.state.userFNameTM + " " + this.state.userLNameTM}!
            </span>
          </div>
          {/* Users */}
          <div className="dropdownContainer">
            <a>Users</a>
            <div className="dropdownItems">
              <a href="../insert/insertuser.html">Insert User</a>
              <a href="../search/searchuser.html">View Users</a>
              <a href="../update/updateuser.html">Update User</a>
            </div>
          </div>
          {/* Players */}
          <div className="dropdownContainer">
            <a>Players</a>
            <div className="dropdownItems">
              <a href="../insert/insertplayer.html">Insert Player</a>
              <a href="../search/searchplayer.html">View Players</a>
              <a href="../update/updateplayer.html">Update Player</a>
            </div>
          </div>
          {/* Reservations */}
          <div className="dropdownContainer">
            <a>Reservations</a>
            <div className="dropdownItems">
              <a href="../insert/insertreservation.html">Insert Reservation</a>
              <a href="../search/searchreservation.html">View Reservations</a>
              <a href="../update/updatereservation.html">Update Reservation</a>
            </div>
          </div>
          {/* Products */}
          <div className="dropdownContainer">
            <a>Products</a>
            <div className="dropdownItems">
              <a href="../insert/insertproduct.html">Insert Product</a>
              <a href="../search/searchproduct.html">View Products</a>
              <a href="../update/updateproduct.html">Update Product</a>
            </div>
          </div>
          {/* Purchases */}
          <div className="dropdownContainer">
            <a>Purchases</a>
            <div className="dropdownItems">
              <a href="../insert/insertpurchase.html">Insert Purchase</a>
              <a href="../search/searchpurchase.html">View Purchases</a>
              <a href="../update/updatepurchase.html">Update Purchase</a>
            </div>
          </div>
          <a href="../logout.html">Logout</a>
        </div>
      );
    }

    // Show Links if user is Assistant
    if (this.state.viewThePageTM == 2) {
      return (
        <div className="navBarJS">
          <div className="userNameContainer">
            {/* Show User's Name */}
            <span>
              Welcome,{" "}
              {" " + this.state.userFNameTM + " " + this.state.userLNameTM}!
            </span>
          </div>
          {/* Users */}
          <div className="dropdownContainer">
            <a>Users</a>
            <div className="dropdownItems">
              <a href="../insert/insertuser.html">Insert User</a>
              <a href="../search/searchuser.html">View Users</a>
            </div>
          </div>
          {/* Players */}
          <div className="dropdownContainer">
            <a>Players</a>
            <div className="dropdownItems">
              <a href="../insert/insertplayer.html">Insert Player</a>
              <a href="../search/searchplayer.html">View Players</a>
            </div>
          </div>
          {/* Reservations */}
          <div className="dropdownContainer">
            <a>Reservations</a>
            <div className="dropdownItems">
              <a href="../insert/insertreservation.html">Insert Reservation</a>
              <a href="../search/searchreservation.html">View Reservations</a>
            </div>
          </div>
          {/* Products */}
          <div className="dropdownContainer">
            <a>Products</a>
            <div className="dropdownItems">
              <a href="../insert/insertproduct.html">Insert Product</a>
              <a href="../search/searchproduct.html">View Products</a>
            </div>
          </div>
          {/* Purchases */}
          <div className="dropdownContainer">
            <a>Purchases</a>
            <div className="dropdownItems">
              <a href="../insert/insertpurchase.html">Insert Purchase</a>
              <a href="../search/searchpurchase.html">View Purchases</a>
            </div>
          </div>
          <a href="../logout.html">Logout</a>
        </div>
      );
    }

    // Show Links if the user is a Front Desk Employee
    if (this.state.viewThePageTM == 3) {
      return (
        <div className="navBarJS">
          <div className="userNameContainer">
            {/* Show User's Name */}
            <span>
              Welcome,{" "}
              {" " + this.state.userFNameTM + " " + this.state.userLNameTM}!
            </span>
          </div>
          {/* Reservations */}
          <div className="dropdownContainer">
            <a>Reservations</a>
            <div className="dropdownItems">
              <a href="../insert/insertreservation.html">Insert Reservation</a>
              <a href="../search/searchreservation.html">View Reservations</a>
              <a href="../update/updatereservation.html">Update Reservation</a>
            </div>
          </div>
          <a href="../logout.html">Logout</a>
        </div>
      );
    }
  },
});

ReactDOM.render(<ShowNavTM />, document.getElementById("navBar"));
