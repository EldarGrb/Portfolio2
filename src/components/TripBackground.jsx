function TripBackground() {
  return (
    <div className="hero-bg">
      <img
        className="hero-bg-image"
        src="/images/hero-graphic.webp"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
      />
      <div className="hero-bg-gradient" />
    </div>
  );
}

export default TripBackground;
