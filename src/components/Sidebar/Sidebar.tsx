import { useNavigate, Outlet, Link } from "react-router-dom";
import { sidebar } from "./utilsSidebar";
import "./sidebar.css";
import Routes from "@/app/routes/Routes";

export default function Sidebar() {
	const navigate = useNavigate();

	const handleClick = (path: string) => {
		navigate(path);
	};

	return (
		<div className="app-container">
			<div className="sidebar">
				{sidebar.map((menuItem) => (
					<div
						key={menuItem.path}
						className="sidebar-item"
						onClick={() => handleClick(menuItem.path)}>
						{menuItem.name}
					</div>
				))}
			</div>
			<div className="main-content">
				<nav className="navbar">
					<Link to={Routes.HOME}>Go to homepage</Link>
					<Link to={Routes.SCREEN_SETTINGS}>Go to settings</Link>
					<p>I am Outlet Component, use my when you need to have nested routes and a common layout when the route changes</p>
				</nav>
				<Outlet />
			</div>
		</div>
	);
}
