import { useResolvedPath, useMatch, Link } from "react-router-dom";
import styles from "./styles.module.css";

export default function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li className={`${isActive ? styles.active : ""} ${styles.listItem}`}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
