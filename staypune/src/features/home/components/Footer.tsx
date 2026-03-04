import type { FooterProps } from "../../../lib/types/reddit";

function Footer({ brand }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <div className="home-footer">
      <p>&copy; {year} {brand}. All rights reserved.</p>
    </div>
  );
}

export default Footer;
