import React from "react";

import { useConfig } from "gatsby-theme-advanced";

import "./styles.css";

const Footer = (): JSX.Element => {
  const config = useConfig();

  return (
    <footer className="footer-wrapper">
      <div className="info">
        <p>{config.website.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
