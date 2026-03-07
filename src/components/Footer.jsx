import Icons from './Icons';

function Footer({ onContact }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-subscribe">
          <h3>Stay updated</h3>
          <div className="subscribe-form">
            <input className="subscribe-input" type="email" name="email" placeholder="Enter your email" aria-label="Email address" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
          <div className="footer-links-grid" style={{ marginTop: 24 }}>
            <div>
              <h4>Pages</h4>
              <a href="/">Home</a>
              <a href="#services">Services</a>
              <a href="#process">Process</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-contact">
          <div className="footer-contact-grid">
            <div>
              <h4>Contact</h4>
              <button className="footer-contact-link" onClick={onContact}>Send us a message</button>
            </div>
            <div>
              <h4>Location</h4>
              <p>Available worldwide<br />Remote-first</p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo">
          <Icons.Logo />
          Uroboros Systems
        </div>
      </div>
    </footer>
  );
}

export default Footer;
