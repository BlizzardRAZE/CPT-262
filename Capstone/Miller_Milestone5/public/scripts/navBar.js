// Show Navigation in FrontEnd
var ShowNavTM = React.createClass({
  render: function () {
    return (
      <div className="navBarJS">
        <a href="index.html">Home</a>
        <a href="searchproducts.html">View Our Products</a>
        <a href="insertreservation.html">Schedule a Reservation</a>
        <a href="searchreservation.html">Search a Reservation</a>
        {/* <a href="playerlogin.html">Login</a> */}
      </div>
    );
  },
});

ReactDOM.render(<ShowNavTM />, document.getElementById("navBar"));
