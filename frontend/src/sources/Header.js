import "./Header.css"
import { Link } from "react-router-dom";

const Header = props => {
    return <header className="header">
        <Link to="/">{props.text}</Link>
    </header>
}
export default Header;