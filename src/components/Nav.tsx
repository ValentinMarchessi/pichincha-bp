import { Link } from "react-router-dom";
import "./Nav.css";

export default function Nav() {
  return (
    <nav>
      <Link to={"/"}>
        <img id="logo" src="logo.png" alt="logo-banco-pichincha" />
      </Link>
    </nav>
  );
}
