import "./Footer.css"

interface Footer {
    text: string
}

const Footer = (props: Footer) => {
    return <footer className="footer">
        {props.text}
    </footer>
}

export default Footer