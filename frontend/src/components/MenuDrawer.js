import React from "react";
import { X, Search, ShoppingCart, Heart, CircleUserRound, Facebook, Instagram, Youtube } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";

const MenuDrawer = ({ isOpen, onClose }) => {
	const { user } = useAuth();
	const { wishlistCount } = useWishlist();
	const navigate = useNavigate();
	const isLoggedIn = Boolean(user && user._id);

	const navigationLinks = [
		{ label: "Home", path: "/" },
		{ label: "Products", path: "/#products" },
		{ label: "Track Order", path: "/track-order" },
		{ label: "About Us", path: "/about-us" },
		{ label: "Blogs", path: "/blogs" },
		{ label: "Contact", path: "/contact-us" },
	];

	return (
		<>
			{isOpen && <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />}
			<div
				className={`fixed top-0 left-0 h-full w-[92vw] max-w-[420px] bg-[#ECEADE] shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="pb-4">
					<div className="px-4 py-4 border-b border-[#D1CDBF] bg-[#DFDCCB]">
						<div className="flex items-center justify-between">
							<button onClick={onClose} className="p-2 hover:bg-[#E7E3D5] rounded-full transition-colors" aria-label="Close menu">
								<X className="w-6 h-6 text-[#1F1E1B]" />
							</button>
							<Link to="/" onClick={onClose} className="flex items-center">
								<img src="/logo.png" alt="NEI Native" className="h-12 w-auto object-contain" />
							</Link>
							<div className="flex items-center gap-1">
								<button className="p-2 hover:bg-[#E7E3D5] rounded-full" aria-label="Search">
									<Search className="w-5 h-5 text-[#2A2925]" />
								</button>
								<button className="p-2 hover:bg-[#E7E3D5] rounded-full" aria-label="Cart">
									<ShoppingCart className="w-5 h-5 text-[#2A2925]" />
								</button>
								<button
									onClick={() => {
										navigate("/wishlist");
										onClose();
									}}
									className="p-2 hover:bg-[#E7E3D5] rounded-full relative"
									aria-label="Wishlist"
								>
									<Heart className="w-5 h-5 text-[#2A2925]" />
									{wishlistCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-[#8B2C6D] text-white text-[10px] h-[18px] min-w-[18px] rounded-full flex items-center justify-center font-bold leading-none px-1">
											{wishlistCount}
										</span>
									)}
								</button>
							</div>
						</div>
					</div>

					<div className="px-4 pt-4">
						<nav className="bg-[#F5F5F5] rounded-xl border border-[#E1DFD6] py-3">
							{navigationLinks.map((link) => (
								<Link
									key={link.label}
									to={link.path}
									onClick={onClose}
									className="block px-4 py-3 text-2xl text-[#2F2E2A] border-b border-[#E5E5E5] last:border-b-0"
								>
									{link.label}
								</Link>
							))}
							{!isLoggedIn && (
								<Link to="/login" onClick={onClose} className="block px-4 py-3 text-2xl text-[#2F2E2A] border-t border-[#E5E5E5]">
									Login
								</Link>
							)}
						</nav>

						<div className="mt-4 bg-[#F5F5F5] rounded-xl border border-[#E1DFD6] p-4">
							{isLoggedIn && (
								<Link
									to="/login"
									onClick={onClose}
									className="flex items-center gap-2 text-[#2F2E2A] text-lg border-b border-[#E5E5E5] pb-3"
								>
									<CircleUserRound className="w-5 h-5" />
									<span>Account</span>
								</Link>
							)}

							<div className={`flex items-center gap-6 text-[#111111] ${isLoggedIn ? "pt-4" : "pt-0"}`}>
								<a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="hover:text-[#8F2A6C] transition-colors font-semibold text-xl leading-none">
									X
								</a>
								<a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-[#8F2A6C] transition-colors">
									<Facebook className="w-5 h-5" />
								</a>
								<a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-[#8F2A6C] transition-colors">
									<Instagram className="w-5 h-5" />
								</a>
								<a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="hover:text-[#8F2A6C] transition-colors">
									<Youtube className="w-5 h-5" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MenuDrawer;
