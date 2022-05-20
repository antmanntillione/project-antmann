import "./Header.css"
import { Link } from "react-router-dom";


interface Header {
    text: string;
}


const Header = (props: Header) => {    
    return <header className="header">
        <Link to="/">{props.text}</Link>
    </header>
}

export default Header;