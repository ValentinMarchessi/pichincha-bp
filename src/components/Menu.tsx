import "./Menu.css";

interface Props {
  head: React.ReactNode;
  children: React.ReactNode;
}

export default function Menu({ children, head }: Props) {
  return (
    <div className="dropdown-container">
      <div className="head">{head}</div>
      <div className="dropdown-content">{children}</div>
    </div>
  );
}
