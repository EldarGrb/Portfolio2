function ConsentBanner({ onAccept, onReject }) {
  return (
    <div className="consent-banner" role="dialog" aria-modal="false" aria-label="Analytics consent">
      <div className="consent-banner__copy">
        <p className="consent-banner__eyebrow">Privacy and analytics</p>
        <h2>Help us understand what is working on the site.</h2>
        <p>
          We use analytics to measure visits, page performance, lead-source attribution,
          and where people stop engaging. Accepting enables Google Analytics and Microsoft Clarity.
        </p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" className="btn-secondary" onClick={onReject}>
          Decline
        </button>
        <button type="button" className="btn-primary" onClick={onAccept}>
          Accept analytics
        </button>
      </div>
    </div>
  );
}

export default ConsentBanner;
