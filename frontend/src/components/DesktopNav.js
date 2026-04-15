import React from "react";
import { NavLink } from "react-router-dom";

const DesktopNav = () => {
	const navigationLinks = [
		{ label: "Home", path: "/" },
		{ label: "Products", path: "/#products" },
		{ label: "Track Order", path: "/track-order" },
		{ label: "About Us", path: "/about-us" },
		{ label: "Blogs", path: "/blogs" },
		{ label: "Contact", path: "/contact-us" },
	];

	return (
		<nav className="hidden md:flex items-center gap-6 lg:gap-8">
			{navigationLinks.map((link) => (
				<NavLink
					key={link.label}
					to={link.path}
					className={({ isActive }) =>
						`font-heading text-[15px] lg:text-[17px] font-semibold tracking-wide transition-colors duration-200 whitespace-nowrap ${
							isActive ? "text-[#111111]" : "text-[#1F1E1B] hover:text-[#D97736]"
						}`
					}
				>
					{link.label}
				</NavLink>
			))}
		</nav>
	);
};

export default DesktopNav;
