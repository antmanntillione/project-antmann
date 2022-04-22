import "./Header.css"
import { Link } from "react-router-dom";

interface Props {
    text: string
}

const Header = (props: Props) => {
    return <header className="header">
        <Link to="/">{props.text}</Link>
    </header>
}
export default Header;