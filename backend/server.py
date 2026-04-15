from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
from uuid import uuid4

from bcrypt import checkpw, hashpw, gensalt
from fastapi import APIRouter, Cookie, FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr


app = FastAPI(title="App Backend")
api = APIRouter(prefix="/api")

app.add_middleware(
	CORSMiddleware,
	allow_credentials=True,
	allow_origins=["http://localhost:3000", "http://localhost:3001"],
	allow_methods=["*"],
	allow_headers=["*"],
)


class UserRegister(BaseModel):
	name: str
	email: EmailStr
	phone: str
	password: str


class UserLogin(BaseModel):
	email: EmailStr
	password: str


class CartItemInput(BaseModel):
	product_id: str
	quantity: int
	variant: Optional[str] = None


class OrderItem(BaseModel):
	product_id: str
	product_name: str
	quantity: int
	price: float
	variant: Optional[str] = None


class ShippingAddress(BaseModel):
	name: str
	phone: str
	address: str
	city: str
	state: str
	pincode: str


class OrderCreate(BaseModel):
	items: List[OrderItem]
	shipping_address: ShippingAddress
	payment_method: str
	total: float


users: Dict[str, Dict] = {}
users_by_email: Dict[str, str] = {}
sessions: Dict[str, Dict] = {}  # token -> {user_id, created_at}
products: List[Dict] = [
	{
		"id": "prod-001",
		"name": "Kesar Radiance Serum",
		"description": "Saffron infused glow serum",
		"price": 1299,
		"images": ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600"],
		"category": "Serums",
	},
	{
		"id": "prod-002",
		"name": "Rose Face Cream",
		"description": "Hydrating daily moisturizer",
		"price": 899,
		"images": ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"],
		"category": "Moisturizers",
	},
	{
		"id": "prod-003",
		"name": "Turmeric Face Wash",
		"description": "Gentle cleanser",
		"price": 549,
		"images": ["https://images.unsplash.com/photo-1556228852-80a1e49f1ee4?w=600"],
		"category": "Cleansers",
	},
]
carts: Dict[str, List[Dict]] = {}
orders: Dict[str, Dict] = {}


def ensure_admin() -> None:
	email = "admin@kesarkosmetics.com"
	if email in users_by_email:
		return
	user_id = str(uuid4())
	hashed_pwd = hashpw(b"Admin@123", gensalt())
	users[user_id] = {
		"_id": user_id,
		"name": "Admin",
		"email": email,
		"phone": "+91 9999999999",
		"password": hashed_pwd,
		"role": "admin",
	}
	users_by_email[email] = user_id


def current_user(access_token: Optional[str]) -> Dict:
	if not access_token or access_token not in sessions:
		raise HTTPException(status_code=401, detail="Not authenticated")
	session_data = sessions[access_token]
	# Check token expiry (24 hours)
	if datetime.now(timezone.utc) - session_data["created_at"] > timedelta(hours=24):
		sessions.pop(access_token, None)
		raise HTTPException(status_code=401, detail="Token expired")
	user_id = session_data["user_id"]
	user = users.get(user_id)
	if not user:
		raise HTTPException(status_code=401, detail="User not found")
	return {k: v for k, v in user.items() if k != "password"}


def get_product(product_id: str) -> Dict:
	for p in products:
		if p["id"] == product_id:
			return p
	raise HTTPException(status_code=404, detail="Product not found")


@api.get("/")
async def health():
	return {"message": "Backend running"}


@api.post("/auth/register")
async def register(body: UserRegister, response: Response):
	email = body.email.lower()
	if email in users_by_email:
		raise HTTPException(status_code=400, detail="Email already registered")
	user_id = str(uuid4())
	hashed_pwd = hashpw(body.password.encode(), gensalt())
	users[user_id] = {
		"_id": user_id,
		"name": body.name,
		"email": email,
		"phone": body.phone,
		"password": hashed_pwd,
		"role": "customer",
	}
	users_by_email[email] = user_id
	token = secrets_token()
	sessions[token] = {"user_id": user_id, "created_at": datetime.now(timezone.utc)}
	response.set_cookie("access_token", token, httponly=True, samesite="lax", path="/")
	return {k: v for k, v in users[user_id].items() if k != "password"}


def secrets_token() -> str:
	return uuid4().hex + uuid4().hex


@api.post("/auth/login")
async def login(body: UserLogin, response: Response):
	email = body.email.lower()
	user_id = users_by_email.get(email)
	if not user_id:
		raise HTTPException(status_code=401, detail="Invalid credentials")
	user = users[user_id]
	if not checkpw(body.password.encode(), user["password"]):
		raise HTTPException(status_code=401, detail="Invalid credentials")
	token = secrets_token()
	sessions[token] = {"user_id": user_id, "created_at": datetime.now(timezone.utc)}
	response.set_cookie("access_token", token, httponly=True, samesite="lax", path="/")
	return {k: v for k, v in user.items() if k != "password"}


@api.get("/auth/me")
async def me(access_token: Optional[str] = Cookie(default=None)):
	return current_user(access_token)


@api.post("/auth/logout")
async def logout(response: Response, access_token: Optional[str] = Cookie(default=None)):
	if access_token and access_token in sessions:
		sessions.pop(access_token, None)
	response.delete_cookie("access_token", path="/")
	return {"message": "Logged out"}


@api.get("/products")
async def list_products(category: Optional[str] = None, search: Optional[str] = None):
	out = products
	if category:
		out = [p for p in out if p.get("category") == category]
	if search:
		q = search.lower()
		out = [p for p in out if q in p.get("name", "").lower()]
	return out


@api.get("/products/{product_id}")
async def product_detail(product_id: str):
	return get_product(product_id)


@api.get("/categories")
async def categories():
	return sorted(list({p.get("category") for p in products if p.get("category")}))


@api.get("/cart")
async def cart(access_token: Optional[str] = Cookie(default=None)):
	user = current_user(access_token)
	items = carts.get(user["_id"], [])
	expanded = []
	total = 0.0
	for item in items:
		product = get_product(item["product_id"])
		qty = item["quantity"]
		total += product["price"] * qty
		expanded.append({"product": product, "quantity": qty, "variant": item.get("variant")})
	return {"items": expanded, "total": round(total, 2)}


@api.post("/cart/add")
async def cart_add(body: CartItemInput, access_token: Optional[str] = Cookie(default=None)):
	user = current_user(access_token)
	get_product(body.product_id)
	user_cart = carts.setdefault(user["_id"], [])
	for it in user_cart:
		if it["product_id"] == body.product_id and it.get("variant") == body.variant:
			it["quantity"] += body.quantity
			return {"message": "Item added"}
	user_cart.append(body.model_dump())
	return {"message": "Item added"}


@api.post("/cart/update")
async def cart_update(body: CartItemInput, access_token: Optional[str] = Cookie(default=None)):
	user = current_user(access_token)
	user_cart = carts.setdefault(user["_id"], [])
	for i, it in enumerate(user_cart):
		if it["product_id"] == body.product_id:
			if body.quantity <= 0:
				user_cart.pop(i)
			else:
				it["quantity"] = body.quantity
			return {"message": "Cart updated"}
	raise HTTPException(status_code=404, detail="Item not found")


@api.delete("/cart/remove/{product_id}")
async def cart_remove(product_id: str, access_token: Optional[str] = Cookie(default=None)):
	user = current_user(access_token)
	user_cart = carts.setdefault(user["_id"], [])
	carts[user["_id"]] = [it for it in user_cart if it["product_id"] != product_id]
	return {"message": "Item removed"}


@api.delete("/cart/clear")
async def cart_clear(access_token: Optional[str] = Cookie(default=None)):
	user = current_user(access_token)
	carts[user["_id"]] = []
	return {"message": "Cart cleared"}


@api.post("/orders")
async def create_order(body: OrderCreate, access_token: Optional[str] = Cookie(default=None)):
	user = current_user(access_token)
	order_id = str(uuid4())
	doc = {
		"id": order_id,
		"user_id": user["_id"],
		"items": [i.model_dump() for i in body.items],
		"shipping_address": body.shipping_address.model_dump(),
		"payment_method": body.payment_method,
		"total": body.total,
		"status": "pending",
		"created_at": datetime.now(timezone.utc).isoformat(),
	}
	orders[order_id] = doc
	carts[user["_id"]] = []
	return doc


@api.get("/orders")
async def list_orders(access_token: Optional[str] = Cookie(default=None)):
	user = current_user(access_token)
	return [o for o in orders.values() if o["user_id"] == user["_id"]]


@api.get("/orders/{order_id}")
async def get_order(order_id: str, access_token: Optional[str] = Cookie(default=None)):
	user = current_user(access_token)
	order = orders.get(order_id)
	if not order or order["user_id"] != user["_id"]:
		raise HTTPException(status_code=404, detail="Order not found")
	return order


@app.on_event("startup")
async def startup_event():
	ensure_admin()


app.include_router(api)
