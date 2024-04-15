// Show Navigation in FrontEnd
var ShowNavTM = React.createClass({
  getInitialState: function () {
    return {
      loginData: [],
      viewThePageTM: 0,
    };
  },

  // Get the Player ID to see if player can interact with the page
  loadAllowLogin: function () {
    $.ajax({
      url: "/getPlayerLoggedIn",
      dataType: "json",
      cache: false,
      success: function (datalog) {
        this.setState({ loginData: datalog });
        this.setState({ viewThePageTM: this.state.loginData[0].dbplayerId });
      }.bind(this),
      error: function (xhr, status, err) {
        // console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },

  componentDidMount: function () {
    this.loadAllowLogin();
  },

  render: function () {

    // Show Navigation if the player is not logged in
    if( this.state.viewThePageTM == 0){
      return (
        <div className="navBarJS">
          <a href="index.html">Home</a>
          <a href="searchproducts.html">View Our Products</a>
          <a href="insertreservation.html">Schedule a Reservation</a>
          <a href="searchreservation.html">Search a Reservation</a>
          <a href="login.html">Login</a>
        </div>
      );
    }

    // Show Navigation if player is logged in 
    if(this.state.viewThePageTM != 0){
      return (
        <div className="navBarJS">
          <a href="index.html">Home</a>
          <a href="searchproducts.html">View Our Products</a>
          <a href="insertreservation.html">Schedule a Reservation</a>
          <a href="searchreservation.html">Search a Reservation</a>
          <a href="profile.html">Profile</a>
          <a href="logout.html">Log Out</a>
        </div>
      );
    }
    
  },
});

ReactDOM.render(<ShowNavTM />, document.getElementById("navBar"));
