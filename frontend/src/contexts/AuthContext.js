import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8001";

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const checkAuth = async () => {
		try {
			const { data } = await axios.get(`${BACKEND_URL}/api/auth/me`, { withCredentials: true });
			setUser(data);
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		checkAuth();
	}, []);

	const login = async (email, password) => {
		const { data } = await axios.post(
			`${BACKEND_URL}/api/auth/login`,
			{ email, password },
			{ withCredentials: true }
		);
		setUser(data);
		return data;
	};

	const register = async (name, email, phone, password) => {
		const { data } = await axios.post(
			`${BACKEND_URL}/api/auth/register`,
			{ name, email, phone, password },
			{ withCredentials: true }
		);
		return data;
	};

	const verifyRegistration = async (email, code) => {
		const { data } = await axios.post(
			`${BACKEND_URL}/api/auth/register/verify-code`,
			{ email, code },
			{ withCredentials: true }
		);
		setUser(data);
		return data;
	};

	const resendRegistrationCode = async (email) => {
		const { data } = await axios.post(
			`${BACKEND_URL}/api/auth/register/resend-code`,
			{ email },
			{ withCredentials: true }
		);
		return data;
	};

	const logout = async () => {
		await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
		setUser(null);
	};

	const value = useMemo(
		() => ({ user, loading, login, register, verifyRegistration, resendRegistrationCode, logout, checkAuth }),
		[user, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
