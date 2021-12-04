import './footer.scss';

const Footer = () => {
    return (
        <footer className="main-footer bg-dark text-center text-white ">
            <div className="container pt-4 pb-1">
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
                <hr />
            </div>
            <section>
                <div className="container text-center text-md-start mt-1">
                    <div className="row">
                        <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                <i className="fas fa-star me-3"></i>Review
                            </h6>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                        <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Useful links
                            </h6>
                            <p>
                                <a href="#!" className="text-reset">Pricing</a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">Settings</a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">Orders</a>
                            </p>
                            <p>
                                <a href="#!" className="text-reset">Help</a>
                            </p>
                        </div>
                        <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                            <h6 className="text-uppercase fw-bold mb-4">
                                Contact
                            </h6>
                            <p><i className="fas fa-home me-3"></i> Lithuania, Kaunas</p>
                            <p><i className="fas fa-envelope me-3"></i> review@gmail.com</p>
                            <p><i className="fas fa-phone me-3"></i> +3706 1010101</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="p-4 copyright">
                © 2021 Copyright: <b><a className="text-white remove-underline" href="/">Edgaras Stasiukaitis</a></b>
            </div>
        </footer>
    )
}

export default Footer;