import type { HeaderProps } from "../../lib/utils/types";

function Header({ title }: HeaderProps) {
  return (
    <div className="home-header">
      <h1>{title}</h1>
    </div>
  );
}

export default Header;
