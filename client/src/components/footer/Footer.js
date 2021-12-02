import './footer.scss';

const Footer = () => {
    return (
        <footer className="main-footer bg-dark text-center text-white ">
            <div className="container pt-4 pb-0">
                <section className="mb-1">
                    <a
                        className="btn btn-outline-light btn-circle m-1"
                        href="#!"
                        role="button"
                    >
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                        className="btn btn-outline-light btn-circle m-1"
                        href="#!"
                        role="button"
                    >
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a
                        className="btn btn-outline-light btn-circle m-1"
                        href="#!"
                        role="button"
                    >
                        <i className="fab fa-google"></i>
                    </a>
                    <a
                        className="btn btn-outline-light btn-circle m-1"
                        href="#!"
                        role="button"
                    >
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a
                        className="btn btn-outline-light btn-circle m-1"
                        href="#!"
                        role="button"
                    >
                        <i className="fab fa-linkedin"></i>
                    </a>
                    <a
                        className="btn btn-outline-light btn-circle m-1"
                        href="https://github.com/Edgaras-Stasiukaitis/ReviewSite"
                        role="button"
                    >
                        <i className="fab fa-github"></i>
                    </a>
                </section>
            </div>
            <div className="p-3">
                © 2021 Copyright: <a className="text-white" href="/">Edgaras Stasiukaitis</a>
            </div>
        </footer>
    )
}

export default Footer;