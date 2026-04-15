import React from "react";

const FlyingToWishlist = ({ isActive, startPosition, endPosition }) => {
	if (!isActive || !startPosition || !endPosition) {
		return null;
	}

	const dx = endPosition.x - startPosition.x;
	const dy = endPosition.y - startPosition.y;

	return (
		<div className="pointer-events-none fixed inset-0 z-[80]" aria-hidden="true">
			<div
				className="wishlist-magic-heart"
				style={{
					left: `${startPosition.x}px`,
					top: `${startPosition.y}px`,
					"--wishlist-dx": `${dx}px`,
					"--wishlist-dy": `${dy}px`,
				}}
			>
				♥
			</div>
		</div>
	);
};

export default FlyingToWishlist;
