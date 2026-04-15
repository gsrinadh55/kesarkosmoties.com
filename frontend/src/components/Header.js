import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, Search, ShoppingCart, User, LogOut, Heart } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { Button } from "./ui/button";
import DesktopNav from "./DesktopNav";
import axios from "axios";

const GUEST_CART_STORAGE_KEY = "guestCartItems";

const getGuestCartCount = () => {
	try {
		const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
		const items = raw ? JSON.parse(raw) : [];
		return Array.isArray(items) ? items.reduce((sum, item) => sum + Number(item?.quantity || 0), 0) : 0;
	} catch {
		return 0;
	}
};

const Header = ({ onMenuClick, onSearchClick, onCartClick, shakeCart, triggerCartRefresh }) => {
	const { user, logout } = useAuth();
	const { wishlistCount } = useWishlist();
	const navigate = useNavigate();
	const location = useLocation();
	const [cartCount, setCartCount] = React.useState(0);
	const [guestCartPreviewCount, setGuestCartPreviewCount] = React.useState(() => getGuestCartCount());
	const [showUserMenu, setShowUserMenu] = React.useState(false);
	const [shakeWishlist, setShakeWishlist] = React.useState(false);
	const [dropCartBadge, setDropCartBadge] = React.useState(false);
	const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

	const fetchCartCount = React.useCallback(async () => {
		if (!user || !user._id) {
			setCartCount(0);
			setGuestCartPreviewCount(getGuestCartCount());
			return;
		}
		try {
			const { data } = await axios.get(`${BACKEND_URL}/api/cart`, { withCredentials: true });
			const count = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
			setCartCount(count);
		} catch {
			setCartCount(0);
		}
	}, [user, BACKEND_URL]);

	React.useEffect(() => {
		fetchCartCount();
	}, [user, BACKEND_URL, fetchCartCount, triggerCartRefresh, location.pathname]);

	React.useEffect(() => {
		if (user && user._id) {
			setGuestCartPreviewCount(0);
			localStorage.removeItem(GUEST_CART_STORAGE_KEY);
		}
	}, [user]);

	React.useEffect(() => {
		const onFocus = () => fetchCartCount();
		const onVisibility = () => {
			if (document.visibilityState === "visible") fetchCartCount();
		};
		const onCartUpdated = () => fetchCartCount();
		const onCartContinueShopping = (event) => {
			const increment = Math.max(1, Number(event?.detail?.increment || 1));

			if (user && user._id) {
				setCartCount((prev) => prev + increment);
			} else {
				setGuestCartPreviewCount(getGuestCartCount());
			}

			setDropCartBadge(true);
			setTimeout(() => setDropCartBadge(false), 520);

			if (user && user._id) {
				setTimeout(() => fetchCartCount(), 700);
			}
		};
		const onWishlistUpdated = () => {
			setShakeWishlist(true);
			setTimeout(() => setShakeWishlist(false), 550);
		};

		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisibility);
		window.addEventListener("cart:updated", onCartUpdated);
		window.addEventListener("cart:continue-shopping", onCartContinueShopping);
		window.addEventListener("wishlist:updated", onWishlistUpdated);

		const interval = setInterval(fetchCartCount, 4000);

		return () => {
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("cart:updated", onCartUpdated);
			window.removeEventListener("cart:continue-shopping", onCartContinueShopping);
			window.removeEventListener("wishlist:updated", onWishlistUpdated);
			clearInterval(interval);
		};
	}, [fetchCartCount, user]);

	const handleCartIconClick = () => {
		onCartClick();
	};

	const displayedCartCount = user && user._id ? cartCount : guestCartPreviewCount;

	const onLogout = async () => {
		await logout();
		navigate("/");
	};

	return (
		<>
			<header className="sticky top-0 z-50 border-b border-[#D6D2C5] md:border-b-0 md:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
				<div className="bg-[#D9D6C6]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="relative flex items-center justify-between h-[68px] sm:h-[74px] md:h-[84px]">
							<div className="flex items-center gap-2 md:gap-4 min-w-[40px] sm:min-w-[44px] md:min-w-[120px] z-10">
								<button onClick={onMenuClick} className="md:hidden p-1.5 sm:p-2 hover:bg-[#E8E4D7] rounded-full transition-colors" aria-label="Open menu">
									<Menu className="w-5 h-5 sm:w-6 sm:h-6 text-[#1F1E1B]" />
								</button>
								<Link to="/" className="hidden md:flex items-center" data-testid="header-logo">
									<img src="/logo.png" alt="NEI Native" className="h-20 w-auto object-contain" />
								</Link>
							</div>

							<Link to="/" className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center" data-testid="header-logo-mobile">
								<img src="/logo.png" alt="NEI Native" className="h-16 sm:h-[72px] w-auto max-w-[142px] sm:max-w-[170px] object-contain" />
							</Link>

							<DesktopNav />

							<div className="flex items-center justify-end gap-1 sm:gap-1.5 md:gap-2 min-w-[138px] sm:min-w-[154px] md:min-w-[120px] z-10">
								<button onClick={onSearchClick} className="p-1.5 sm:p-2.5 hover:bg-[#E8E4D7] rounded-full transition-colors" aria-label="Search">
									<Search className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#3A3935]" />
								</button>

								<button
									onClick={handleCartIconClick}
									className={`p-1.5 sm:p-2.5 hover:bg-[#E8E4D7] rounded-full transition-colors relative group ${shakeCart ? "cart-icon-shake" : ""}`}
									aria-label="Cart"
								>
									<ShoppingCart className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#3A3935]" />
									{displayedCartCount > 0 && (
										<span className={`absolute -top-1 -right-1 bg-[#D97736] text-white text-[9px] sm:text-[10px] w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold leading-none ${dropCartBadge ? "cart-badge-drop" : ""}`}>
											{displayedCartCount}
										</span>
									)}
								</button>

								<button
									id="wishlist-target-icon"
									onClick={() => navigate("/wishlist")}
									className={`p-1.5 sm:p-2.5 ml-0.5 hover:bg-[#E8E4D7] rounded-full transition-colors relative ${shakeWishlist ? "wishlist-icon-pop" : ""}`}
									aria-label="Wishlist"
								>
									<Heart className="w-[19px] h-[19px] sm:w-5 sm:h-5 text-[#3A3935]" />
									{wishlistCount > 0 && (
										<span className="absolute -top-1 -right-1 bg-[#8B2C6D] text-white text-[9px] sm:text-[10px] w-5 h-5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-bold leading-none">
											{wishlistCount}
										</span>
									)}
								</button>

								{user && user._id ? (
									<div className="relative">
										<button onClick={() => setShowUserMenu(!showUserMenu)} className="p-1.5 sm:p-2.5 ml-0.5 hover:bg-[#E8E4D7] rounded-full transition-colors" aria-label="Account">
											<User className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-[#3A3935]" />
										</button>
										{showUserMenu && (
											<div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-lg py-2 border border-[#E0D8C8]">
												<div className="px-4 py-2 border-b border-[#E0D8C8]">
													<p className="text-sm font-medium text-[#3E2723]">{user.name}</p>
													<p className="text-xs text-[#5D4037]">{user.email}</p>
												</div>
												<button onClick={onLogout} className="w-full px-4 py-2 text-left text-sm text-[#3E2723] hover:bg-[#EFE9DF] flex items-center gap-2">
													<LogOut className="w-4 h-4" />
													Logout
												</button>
											</div>
										)}
									</div>
								) : (
									<Link to="/login" className="hidden sm:block">
										<Button className="bg-[#D97736] hover:bg-[#C96626] text-white rounded-full px-5 h-10">Login</Button>
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</header>

			<style>{`
				@keyframes cartShake {
					0%, 100% { transform: rotate(0deg) scale(1); }
					25% { transform: rotate(-5deg) scale(1.1); }
					50% { transform: rotate(5deg) scale(1.1); }
					75% { transform: rotate(-5deg) scale(1.1); }
				}

				.cart-icon-shake {
					animation: cartShake 0.6s ease-in-out;
				}

				@keyframes cartBadgeDrop {
					0% { transform: translateY(-16px) scale(0.82); opacity: 0.25; }
					45% { transform: translateY(0) scale(1.08); opacity: 1; }
					72% { transform: translateY(-3px) scale(0.98); opacity: 1; }
					100% { transform: translateY(0) scale(1); opacity: 1; }
				}

				.cart-badge-drop {
					animation: cartBadgeDrop 0.52s cubic-bezier(0.22, 0.8, 0.3, 1);
				}

				@keyframes wishlistPop {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(1.2); }
				}

				.wishlist-icon-pop {
					animation: wishlistPop 0.55s ease-in-out;
				}

			`}</style>
		</>
	);
};

export default Header;
