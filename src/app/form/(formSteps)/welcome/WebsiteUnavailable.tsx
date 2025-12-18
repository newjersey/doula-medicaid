const WebsiteUnavailable = () => {
  return (
    <div className="grid-container">
      <div className="grid-row">
        <p className="maxw-full">
          The NJ Doula Assistant is currently unavailable. Please visit NJMMIS to access the
          standard Doula fee-for-service application:{" "}
          <a href="https://www.njmmis.com/providerEnrollment.aspx" rel="noopener">
            https://www.njmmis.com/providerEnrollment.aspx
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default WebsiteUnavailable;
