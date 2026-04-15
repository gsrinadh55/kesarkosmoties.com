import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = "nei-native-wishlist";

const getProductId = (product) => product?.id || product?._id;

export function WishlistProvider({ children }) {
	const [wishlistItems, setWishlistItems] = useState([]);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
			const parsed = raw ? JSON.parse(raw) : [];
			setWishlistItems(Array.isArray(parsed) ? parsed : []);
		} catch {
			setWishlistItems([]);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
	}, [wishlistItems]);

	const isWishlisted = (productId) => wishlistItems.some((item) => getProductId(item) === productId);

	const addToWishlist = (product) => {
		const productId = getProductId(product);
		if (!productId) return false;

		let added = false;
		setWishlistItems((prev) => {
			if (prev.some((item) => getProductId(item) === productId)) {
				return prev;
			}
			added = true;
			return [product, ...prev];
		});

		if (added) {
			window.dispatchEvent(new Event("wishlist:updated"));
		}
		return added;
	};

	const removeFromWishlist = (productId) => {
		let removed = false;
		setWishlistItems((prev) => {
			const next = prev.filter((item) => getProductId(item) !== productId);
			removed = next.length !== prev.length;
			return next;
		});

		if (removed) {
			window.dispatchEvent(new Event("wishlist:updated"));
		}
		return removed;
	};

	const toggleWishlist = (product) => {
		const productId = getProductId(product);
		if (!productId) return false;
		if (isWishlisted(productId)) {
			removeFromWishlist(productId);
			return false;
		}
		addToWishlist(product);
		return true;
	};

	const clearWishlist = () => {
		setWishlistItems([]);
		window.dispatchEvent(new Event("wishlist:updated"));
	};

	const value = useMemo(
		() => ({
			wishlistItems,
			wishlistCount: wishlistItems.length,
			isWishlisted,
			addToWishlist,
			removeFromWishlist,
			toggleWishlist,
			clearWishlist,
		}),
		[wishlistItems]
	);

	return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
	const context = useContext(WishlistContext);
	if (!context) throw new Error("useWishlist must be used within WishlistProvider");
	return context;
}
