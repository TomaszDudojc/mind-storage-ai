import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>© {year} Mind Storage AI. Wszelkie prawa zastrzeżone.</p>

    </footer>
  );
}

export default Footer;
