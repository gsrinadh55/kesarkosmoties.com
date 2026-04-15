import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth();
	const location = useLocation();
	if (loading) {
		return (
			<div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
				<div className="text-[#5D4037]">Loading...</div>
			</div>
		);
	}
	if (!user || !user._id) {
		const redirectPath = `${location.pathname}${location.search || ""}`;
		return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
	}
	return children;
};

export default ProtectedRoute;
