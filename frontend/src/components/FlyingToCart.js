import React, { useState, useEffect } from "react";

const FlyingToCart = ({ isActive, startPosition, onComplete }) => {
	const [particles, setParticles] = useState([]);

	useEffect(() => {
		if (!isActive || !startPosition) return;

		// Create multiple particle trails
		const newParticles = Array.from({ length: 8 }, (_, i) => ({
			id: i,
			delay: i * 20,
		}));
		setParticles(newParticles);

		// Complete animation after 800ms
		const timer = setTimeout(() => {
			onComplete?.();
		}, 800);

		return () => clearTimeout(timer);
	}, [isActive, startPosition, onComplete]);

	if (!isActive || !startPosition) return null;

	return (
		<>
			{/* Animated particles flying to cart */}
			{particles.map((particle) => (
				<div
					key={particle.id}
					className="fixed pointer-events-none"
					style={{
						left: startPosition.x,
						top: startPosition.y,
						width: "20px",
						height: "20px",
						animation: `flyToCart 0.8s ease-in forwards`,
						animationDelay: `${particle.delay}ms`,
						opacity: 0.8,
					}}
				>
					<div className="w-full h-full bg-gradient-to-r from-[#D97736] to-[#F5A962] rounded-full blur-sm" />
				</div>
			))}

			<style>{`
				@keyframes flyToCart {
					0% {
						transform: translate(0, 0) scale(1);
						opacity: 1;
					}
					50% {
						opacity: 0.8;
					}
					100% {
						transform: translate(calc(-100vw + 50px), calc(-100vh + 50px)) scale(0);
						opacity: 0;
					}
				}

				@keyframes cartShake {
					0%, 100% { transform: rotate(0deg) scale(1); }
					25% { transform: rotate(-5deg) scale(1.1); }
					50% { transform: rotate(5deg) scale(1.1); }
					75% { transform: rotate(-5deg) scale(1.1); }
				}

				.cart-icon-shake {
					animation: cartShake 0.6s ease-in-out;
				}
			`}</style>
		</>
	);
};

export default FlyingToCart;
