import type { FooterProps } from "../types";

function Footer({ brand }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <div className="home-footer">
      <p>&copy; {year} {brand}. All rights reserved.</p>
    </div>
  );
}

export default Footer;
