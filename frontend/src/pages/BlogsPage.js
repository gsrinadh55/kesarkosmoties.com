import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";

const BlogsPage = () => {
	const blogPosts = [
		{
			id: 1,
			title: "The Power of A2 Ghee: Ancient Wisdom Meets Modern Health",
			excerpt: "Discover how A2 ghee from our desi cows provides superior nutrition and health benefits compared to regular ghee.",
			date: "March 15, 2024",
			author: "Sarah Kumar",
			image: "/blog1.jpg",
			category: "Health"
		},
		{
			id: 2,
			title: "Saffron in Skincare: Glow Naturally with Kesar",
			excerpt: "Learn about the remarkable benefits of saffron for skin brightening, anti-aging, and achieving that natural radiant glow.",
			date: "March 10, 2024",
			author: "Priya Sharma",
			image: "/blog2.jpg",
			category: "Beauty"
		},
		{
			id: 3,
			title: "Turmeric: Nature's Golden Healer",
			excerpt: "Explore the scientifically-backed benefits of turmeric and how our pure turmeric products can enhance your wellness routine.",
			date: "March 5, 2024",
			author: "Rajesh Patel",
			image: "/blog3.jpg",
			category: "Wellness"
		},
		{
			id: 4,
			title: "The Art of Handcrafted Natural Products",
			excerpt: "Behind every NEI Native product is a story of dedication and traditional craftsmanship that ensures uncompromising quality.",
			date: "February 28, 2024",
			author: "Maya Desai",
			image: "/blog4.jpg",
			category: "Craftsmanship"
		}
	];

	return (
		<div className="min-h-screen bg-[#FAF7F2]">
			{/* Hero Section */}
			<section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-[#3E2723] to-[#5D4037] text-white">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-6">NEI Native Blog</h1>
					<p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
						Insights, tips, and stories about natural beauty, wellness, and handcrafted excellence
					</p>
				</div>
			</section>

			{/* Blog Posts Grid */}
			<section className="py-16 sm:py-20 md:py-24">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
						{blogPosts.map((post) => (
							<div key={post.id} className="bg-white rounded-2xl overflow-hidden border border-[#E0D8C8] hover:shadow-lg transition-all hover:-translate-y-1">
								{/* Image Placeholder */}
								<div className="w-full h-48 sm:h-56 bg-gradient-to-br from-[#D97736] to-[#F5A962] flex items-center justify-center text-white text-6xl">
									📰
								</div>

								{/* Content */}
								<div className="p-6 sm:p-8">
									<div className="flex items-center justify-between mb-3">
										<span className="inline-block bg-[#D97736] text-white text-xs font-bold px-3 py-1 rounded-full">
											{post.category}
										</span>
										<span className="text-xs text-[#5D4037]">{post.date}</span>
									</div>

									<h3 className="font-heading text-lg sm:text-xl font-bold text-[#3E2723] mb-3 leading-snug">
										{post.title}
									</h3>

									<p className="text-[#5D4037] text-sm sm:text-base mb-4 line-clamp-2">
										{post.excerpt}
									</p>

									<div className="flex items-center justify-between pt-4 border-t border-[#E0D8C8]">
										<div className="flex items-center gap-2 text-xs text-[#5D4037]">
											<User className="w-4 h-4" />
											<span>{post.author}</span>
										</div>
										<button className="text-[#D97736] hover:text-[#C96626] font-semibold flex items-center gap-1 transition-colors">
											Read More
											<ArrowRight className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Newsletter Section */}
			<section className="py-16 sm:py-20 bg-white border-t border-[#E0D8C8]">
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#3E2723] mb-4">Stay Updated</h2>
					<p className="text-[#5D4037] mb-8 text-lg">Subscribe to our newsletter for wellness tips, product launches, and exclusive offers</p>
					<div className="flex flex-col sm:flex-row gap-3">
						<input 
							type="email" 
							placeholder="Enter your email" 
							className="flex-1 px-4 py-3 border border-[#E0D8C8] rounded-full focus:outline-none focus:ring-2 focus:ring-[#D97736]"
						/>
						<button className="bg-[#D97736] hover:bg-[#C96626] text-white font-bold px-8 py-3 rounded-full transition-colors">
							Subscribe
						</button>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default BlogsPage;
