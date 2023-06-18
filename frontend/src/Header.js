import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <Link to="/" className="headerButton">
        Home
      </Link>
      <Link to="/login" className="headerButton">
        Login
      </Link>
      <Link to="/cart" className="headerButton">
        Cart
      </Link>
      <Link to="/editItem" className="headerButton">
        New Game
      </Link>
    </div>
    
  );
};

export default Header;
