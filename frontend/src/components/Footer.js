import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Facebook, Instagram, Youtube, Twitter, Linkedin, ChevronDown } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

const Footer = () => {
	const [products, setProducts] = useState([]);
	const [openSection, setOpenSection] = useState("best-sellers");

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const { data } = await axios.get(`${BACKEND_URL}/api/products`);
				setProducts(Array.isArray(data) ? data : []);
			} catch {
				setProducts([]);
			}
		};

		fetchProducts();
	}, []);

	const toggleSection = (section) => {
		setOpenSection((current) => (current === section ? "" : section));
	};

	const bestSellersLinks = [
		{ to: "/?category=Ghee", label: "A2 Desi Ghee" },
		{ to: "/?category=Flours", label: "Attas & Millet Flours" },
		{ to: "/?category=Oils", label: "Wood Pressed Oils" },
		{ to: "/?category=Coffee", label: "Coffee Powder" },
		{ to: "/?category=Turmeric", label: "Turmeric Powder" },
	];

	const shopLinks = [
		{ to: "/?category=Jaggery", label: "Jaggery" },
		{ to: "/?category=Skin Care", label: "Skin Care" },
		{ to: "/?category=Peanut Butter", label: "Peanut Butter" },
		{ to: "/?category=Gift Hampers", label: "Gift Hampers" },
	];

	const resourceLinks = [
		{ href: "#refund-policy", label: "Refund Policy" },
		{ href: "#privacy-policy", label: "Privacy Policy" },
		{ href: "#terms-of-service", label: "Terms of Service" },
		{ href: "#about-us", label: "About Us" },
		{ href: "#contact-us", label: "Contact Us" },
	];

	const productLinks = useMemo(
		() =>
			products
				.map((product) => {
					const productId = product.id || product._id;
					return productId
						? { to: `/product/${productId}`, label: product.name || "Product" }
						: null;
				})
				.filter(Boolean),
		[products]
	);

	const mobileBestSellerLinks = productLinks.length > 0 ? productLinks.slice(0, 5) : bestSellersLinks;
	const mobileShopLinks = productLinks.length > 5 ? productLinks.slice(5, 10) : productLinks.slice(0, 4);
	const desktopFeaturedLinks = productLinks.length > 0 ? productLinks.slice(0, 5) : bestSellersLinks;
	const desktopBestSellerLinks = productLinks.length > 0 ? productLinks.slice(0, 5) : bestSellersLinks;
	const desktopShopLinks = productLinks.length > 5 ? productLinks.slice(5, 10) : productLinks.length > 0 ? productLinks.slice(0, 5) : shopLinks;

	return (
		<footer className="bg-[#F5F1EA] border-t border-[#E0D8C8] mt-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
				{/* Mobile Footer */}
				<div className="md:hidden space-y-8">
					<div className="text-center">
						<div className="mx-auto w-32 h-32 mb-5">
							<img src="/logo.png" alt="NEI Native" className="w-full h-full object-contain" />
						</div>
						<p className="text-sm text-[#5D4037] leading-relaxed max-w-xs mx-auto">
							Authentic, handcrafted essentials for a healthier, sustainable life!
						</p>
						<div className="flex justify-center gap-3 mt-6">
							<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="Facebook">
								<Facebook className="w-5 h-5" />
							</a>
							<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="Instagram">
								<Instagram className="w-5 h-5" />
							</a>
							<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="YouTube">
								<Youtube className="w-5 h-5" />
							</a>
							<a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="Twitter">
								<Twitter className="w-5 h-5" />
							</a>
							<a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="Pinterest">
								<Linkedin className="w-5 h-5" />
							</a>
						</div>
					</div>

					<div className="space-y-4">
						{[
							{ id: "best-sellers", title: "BEST SELLERS", items: mobileBestSellerLinks, type: "link" },
							{ id: "shop", title: "SHOP", items: mobileShopLinks.length > 0 ? mobileShopLinks : shopLinks, type: "link" },
							{ id: "resources", title: "RESOURCES", items: resourceLinks, type: "href" },
						].map((section) => (
							<div key={section.id} className="border-t border-[#E0D8C8] pt-4">
								<button
									type="button"
									onClick={() => toggleSection(section.id)}
									className="w-full flex items-center justify-between text-left"
								>
									<span className="font-bold text-[#3E2723] text-base">{section.title}</span>
									<ChevronDown className={`w-5 h-5 text-[#3E2723] transition-transform ${openSection === section.id ? "rotate-180" : ""}`} />
								</button>
								{openSection === section.id && (
									<ul className="mt-4 space-y-3 pb-1">
										{section.items.map((item) => (
											<li key={item.label}>
												{section.type === "link" ? (
													<Link to={item.to} className="text-sm text-[#5D4037] hover:text-[#D97736] transition-colors">
														{item.label}
													</Link>
												) : (
													<a href={item.href} className="text-sm text-[#5D4037] hover:text-[#D97736] transition-colors">
														{item.label}
													</a>
												)}
											</li>
										))}
									</ul>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Desktop Footer */}
				<div className="hidden md:grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-8 mb-12 items-start">
					{/* Brand Section */}
					<div className="col-span-1 md:col-span-2 max-w-md">
						<div className="mb-5">
							<div className="w-36 h-36 lg:w-40 lg:h-40">
								<img src="/logo.png" alt="NEI Native" className="w-full h-full object-contain" />
							</div>
						</div>
						<p className="text-sm text-[#5D4037] leading-relaxed mb-4 max-w-sm">
							Authentic, handcrafted essentials for a healthier, sustainable life!
						</p>
						<p className="text-sm text-[#5D4037] leading-relaxed mb-6 max-w-sm">
							Explore our curated products, shop your favorites, and stay connected with new launches.
						</p>

						{/* Social Media Icons */}
						<div className="flex gap-3">
							<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="Facebook">
								<Facebook className="w-5 h-5" />
							</a>
							<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="Instagram">
								<Instagram className="w-5 h-5" />
							</a>
							<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="YouTube">
								<Youtube className="w-5 h-5" />
							</a>
							<a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="Twitter">
								<Twitter className="w-5 h-5" />
							</a>
							<a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-[#D97736] text-[#D97736] flex items-center justify-center hover:bg-[#D97736] hover:text-white transition-colors" aria-label="Pinterest">
								<Linkedin className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Best Sellers */}
					<div>
						<h4 className="font-bold text-[#3E2723] text-sm mb-4">PRODUCTS</h4>
						<ul className="space-y-3">
							{desktopBestSellerLinks.map((item) => (
								<li key={item.label}>
									<Link to={item.to} className="text-sm text-[#5D4037] hover:text-[#D97736] transition-colors">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Shop */}
					<div>
						<h4 className="font-bold text-[#3E2723] text-sm mb-4">MORE PRODUCTS</h4>
						<ul className="space-y-3">
							{desktopShopLinks.map((item) => (
								<li key={item.label}>
									<Link to={item.to} className="text-sm text-[#5D4037] hover:text-[#D97736] transition-colors">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Featured Products */}
					<div>
						<h4 className="font-bold text-[#3E2723] text-sm mb-4">FEATURED PRODUCTS</h4>
						<ul className="space-y-3">
							{desktopFeaturedLinks.map((item) => (
								<li key={item.label}>
									<Link to={item.to} className="text-sm text-[#5D4037] hover:text-[#D97736] transition-colors">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Resources */}
					<div>
						<h4 className="font-bold text-[#3E2723] text-sm mb-4">RESOURCES</h4>
						<ul className="space-y-3">
							{resourceLinks.map((item) => (
								<li key={item.label}>
									<a href={item.href} className="text-sm text-[#5D4037] hover:text-[#D97736] transition-colors">
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom Border and Copyright */}
				<div className="border-t border-[#E0D8C8] pt-6">
					<p className="text-center text-xs text-[#5D4037]">
						&copy; 2024 NEI NATIVE. All rights reserved. | Made with ❤️ for a sustainable future
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
