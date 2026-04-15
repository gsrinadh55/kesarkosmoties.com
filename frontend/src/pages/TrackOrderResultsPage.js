import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, PackageSearch } from "lucide-react";
import axios from "axios";
import { formatPrice } from "../utils/helpers";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

const TrackOrderResultsPage = () => {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const query = (params.get("query") || "").trim();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!query) {
			navigate("/track-order");
			return;
		}

		const fetchOrders = async () => {
			try {
				const { data } = await axios.get(`${BACKEND_URL}/api/orders/track/search`, {
					params: { query },
				});
				setOrders(Array.isArray(data) ? data : []);
			} catch {
				toast.error("Could not fetch orders for tracking");
				setOrders([]);
			} finally {
				setLoading(false);
			}
		};

		fetchOrders();
	}, [query, navigate]);

	if (loading) {
		return <div className="min-h-screen bg-[#F6F5F2] flex items-center justify-center text-[#5D4037]">Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-[#F6F5F2]">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
				<div className="mb-6">
					<p className="text-xs font-bold uppercase tracking-[0.24em] text-[#D97736]">Tracking Results</p>
					<h1 className="font-heading text-3xl sm:text-4xl text-[#3E2723]">Matching orders</h1>
					<p className="mt-2 text-[#6B5B52] text-sm sm:text-base">Showing results for: <span className="font-semibold text-[#3E2723]">{query}</span></p>
				</div>

				{orders.length === 0 ? (
					<div className="rounded-[2rem] border border-dashed border-[#E0D8C8] bg-white p-10 text-center">
						<PackageSearch className="mx-auto h-12 w-12 text-[#D97736]" />
						<p className="mt-4 text-[#5D4037]">No orders found for this input.</p>
						<Link to="/track-order" className="mt-4 inline-block text-[#D97736] font-semibold hover:underline">Try another search</Link>
					</div>
				) : (
					<div className="space-y-5">
						{orders.map((order) => (
							<div key={order.id} className="rounded-3xl border-2 border-[#E6DCCB] bg-white p-4 sm:p-6 shadow-sm">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
									<div>
										<p className="text-xs uppercase tracking-[0.18em] text-[#8A7768]">Order ID</p>
										<p className="font-semibold text-[#3E2723] break-all">{order.id}</p>
									</div>
									<p className="text-sm text-[#6B5B52]">{new Date(order.created_at).toLocaleString()}</p>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
									{(order.items || []).map((item, idx) => (
										(() => {
											const contact = order.contact_email || order.contact_phone || order.contact_registered_email || order.contact_registered_phone || query;
											const productId = item.product_id || item.product?._id || item.product?.id;
											const productLink = productId ? `/product/${productId}` : null;
											return (
												<div key={`${order.id}-${productId || idx}`} className="rounded-2xl border border-[#E9E0D2] bg-[#FCFAF7] p-3 hover:border-[#D97736] transition">
													{productLink ? (
														<Link to={productLink} className="group block text-left">
															<img src={item.image || "/logo.png"} alt={item.product_name} className="w-full h-36 object-cover rounded-xl" />
															<p className="mt-3 font-medium text-[#3E2723] line-clamp-2 group-hover:text-[#D97736]">{item.product_name}</p>
															<p className="mt-1 text-sm text-[#6B5B52]">Qty: {item.quantity}</p>
															<p className="mt-1 text-sm font-semibold text-[#3E2723]">{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}</p>
														</Link>
													) : (
														<div>
															<img src={item.image || "/logo.png"} alt={item.product_name} className="w-full h-36 object-cover rounded-xl" />
															<p className="mt-3 font-medium text-[#3E2723] line-clamp-2">{item.product_name}</p>
															<p className="mt-1 text-sm text-[#6B5B52]">Qty: {item.quantity}</p>
															<p className="mt-1 text-sm font-semibold text-[#3E2723]">{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}</p>
														</div>
													)}

													<button
														type="button"
														onClick={() => navigate(`/track-order/status/${order.id}?contact=${encodeURIComponent(contact)}&product=${encodeURIComponent(productId || "")}`)}
														className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#D97736] hover:underline"
													>
														View tracking
														<ChevronRight className="h-4 w-4" />
													</button>
												</div>
											);
										})()
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default TrackOrderResultsPage;
