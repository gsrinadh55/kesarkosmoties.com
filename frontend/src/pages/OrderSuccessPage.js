import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";

const OrderSuccessPage = () => {
	const [params] = useSearchParams();
	const orderId = params.get("orderId");

	return (
		<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-4">
			<div className="max-w-xl w-full bg-white p-10 rounded-3xl border border-[#E0D8C8] text-center">
				<h1 className="font-heading text-4xl font-semibold text-[#3E2723] mb-4">Order Placed Successfully!</h1>
				<p className="text-[#5D4037] mb-2">Thank you for your purchase.</p>
				<p className="text-[#5D4037] mb-8">Order ID: <strong>{orderId || "N/A"}</strong></p>
				<Link to="/">
					<Button className="bg-[#D97736] hover:bg-[#C96626] text-white rounded-full px-8 py-6">Continue Shopping</Button>
				</Link>
			</div>
		</div>
	);
};

export default OrderSuccessPage;
