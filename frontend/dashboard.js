const API = "http://localhost:3000/api";
let cart = [];
/* ==============================
   AUTH HELPERS
============================== */

function getToken() {
    return localStorage.getItem("token");
}
function getRole() {
    return localStorage.getItem("role");
}

function protectRoute(requiredRole) {
    const token = getToken();
    const role = getRole();

    if (!token || role !== requiredRole) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

/* ==============================
   LOGIN
============================== */

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if (data.role === "ADMIN")
            window.location.href = "admin.html";
        else
            window.location.href = "customer.html";
    } else {
        alert(data.message);
    }
}
async function register() {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Registration successful. Please login.");
        window.location.href = "login.html";
    } else {
        alert(data.message || "Registration failed");
    }
}
/* ==============================
   PRODUCTS (Both Roles)
============================== */
async function deleteProduct(id) {

    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) return;

    const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    });

    const data = await res.json();

    if (res.ok) {
        alert("Product deleted successfully");
        loadProducts(); // refresh
    } else {
        alert(data.message);
    }
}
async function submitOrder() {

    const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            items: cart
        })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Order placed successfully!");
        cart = [];
        loadMyOrders();
    } else {
        alert(data.message);
    }
}
async function loadProducts() {

const res = await fetch(`${API}/products`,{
headers:{Authorization:`Bearer ${getToken()}`}
});

const products = await res.json();

let html = `
<div class="section">

<h2>Products</h2>

<table class="data-table">

<thead>
<tr>
<th>Name</th>
<th>Price</th>
<th>Stock</th>
${getRole()==="ADMIN" ? "<th>Action</th>" : "<th>Add</th>"}
</tr>
</thead>

<tbody>
`;

products.forEach(p=>{

html+=`
<tr>

<td>${p.name}</td>

<td>₹${p.price}</td>

<td>${p.stock_quantity}</td>

${
getRole()==="ADMIN"
?`
<td>
<button class="delete-btn" onclick="deleteProduct(${p.id})">
Delete
</button>
</td>
`
:`
<td>
<button class="primary-btn add-cart-btn"
onclick="addToCart('${p.name}', ${p.price})">
Add to Cart
</button>
</td>
`
}

</tr>
`

});

html+=`
</tbody>
</table>
</div>
`;

document.getElementById("contentArea").innerHTML=html;

}
function addToCart(name, price) {

    if (getRole() !== "CUSTOMER") return;

    const existing = cart.find(item => item.product_name === name);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            product_name: name,
            price: price,
            quantity: 1
        });
    }

    alert(name + " added to cart");
}
function viewCart() {

    if (cart.length === 0) {
        document.getElementById("contentArea").innerHTML =
            "<div class='section'><h2>Your Cart is Empty 🛒</h2><p>Add products to start shopping.</p></div>";
        return;
    }

    let total = 0;

    let html = `
<div class="cart-container">

<h2>Your Cart 🛒</h2>

<ul class="cart-list">
`;

cart.forEach((item, index) => {

total += item.price * item.quantity;

html += `
<li class="cart-item">

<div class="cart-info">
<strong>${item.product_name}</strong>
<p>₹${item.price} × ${item.quantity}</p>
</div>

<div class="cart-actions">

<button class="qty-btn minus" onclick="decreaseQty(${index})">−</button>

<span class="qty">${item.quantity}</span>

<button class="qty-btn plus" onclick="increaseQty(${index})">+</button>

<button class="remove-btn" onclick="removeFromCart(${index})">✖</button>

</div>

</li>
`;
});

html += `</ul>

<div class="cart-footer">

<h3>Total: ₹${total}</h3>

<button class="order-btn" onclick="submitOrder()">Place Order</button>

</div>

</div>`;

    document.getElementById("contentArea").innerHTML = html;
}
function increaseQty(index) {
    cart[index].quantity += 1;
    viewCart();
}

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    viewCart();
}
function removeFromCart(index) {
    cart.splice(index, 1);
    viewCart();
}

/* ==============================
   CUSTOMER FEATURES
============================== */

async function loadMyOrders() {
    const res = await fetch(`${API}/orders/my`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();

    let html = "<div class='card'><h2>My Orders</h2><ul>";

    data.forEach(o => {
        html += `
            <li>
                Order #${o.id} - ₹${o.total_amount} - ${o.status}
                ${o.status === "PLACED"
                    ? `<button class="cancel-btn" onclick="cancelOrder(${o.id})">
Cancel Order
</button>`
                    : ""}
            </li>
        `;
    });

    html += "</ul></div>";
    document.getElementById("contentArea").innerHTML = html;
}


async function cancelOrder(orderId) {
    const res = await fetch(`${API}/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();

    if (res.ok) {
        alert("Order cancelled!");
        loadMyOrders();
    } else {
        alert(data.message);
    }
}

/* ==============================
   ADMIN FEATURES
============================== */
async function loadOrders(){

const res = await fetch(`${API}/orders`,{
headers:{Authorization:`Bearer ${getToken()}`}
});

const orders = await res.json();

let html=`
<div class="section">

<h2>Orders</h2>

<table class="data-table">

<thead>
<tr>
<th>Order ID</th>
<th>Total</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>
`;

orders.forEach(o=>{

let badgeClass="";

if(o.status==="DELIVERED") badgeClass="badge-delivered";
if(o.status==="PLACED") badgeClass="badge-placed";
if(o.status==="CANCELLED") badgeClass="badge-cancelled";

html+=`
<tr>

<td>#${o.id}</td>

<td>₹${o.total_amount}</td>

<td>
<span class="badge ${badgeClass}">
${o.status}
</span>
</td>

<td>

${o.status==="PLACED"
?`<button class="deliver-btn" onclick="markDelivered(${o.id})">
✔ Mark Delivered
</button>`
:""}

</td>

</tr>
`;

});

html+=`
</tbody>
</table>
</div>
`;

document.getElementById("contentArea").innerHTML=html;

}
async function markDelivered(orderId) {
    const res = await fetch(`${API}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: "DELIVERED" })
    });

    if (res.ok) {
        alert("Order marked as Delivered");
        loadOrders();
    }
}
async function loadCustomerDashboard() {

    const productsRes = await fetch(`${API}/products`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    const ordersRes = await fetch(`${API}/orders/my`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    const products = await productsRes.json();
    const orders = await ordersRes.json();


    const html = `
    
    <div class="welcome-box">
        <h1>Hello, Customer 👋</h1>
        <p>Welcome back to DailyCart. Explore products, manage your cart and track your orders easily.</p>
    </div>

    <div class="customer-stats">

        <div class="stat-card">
            <h2>${products.length}</h2>
            <p>Products Available</p>
        </div>

        <div class="stat-card">
            <h2>${orders.length}</h2>
            <p>Your Orders</p>
        </div>

    </div>
    `;

    document.getElementById("contentArea").innerHTML = html;
}
async function loadAdminDashboard() {

    const productsRes = await fetch(`${API}/products`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    const ordersRes = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    const products = await productsRes.json();
    const orders = await ordersRes.json();

    const revenue = orders
        .filter(o => o.status === "DELIVERED")
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

    const lowStock = products.filter(p => p.stock_quantity < 20);

    const html = `

    <div class="header">
        <div>
            <h1>Welcome Admin 👨‍💼</h1>
            <p>Manage your store operations efficiently.</p>
        </div>
    </div>

    <div class="stats">

        <div class="stat-card">
            <h2>${products.length}</h2>
            <p>Total Products</p>
        </div>

        <div class="stat-card">
            <h2>${orders.length}</h2>
            <p>Total Orders</p>
        </div>

        <div class="stat-card">
            <h2>₹${revenue.toFixed(2)}</h2>
            <p>Total Revenue</p>
        </div>

    </div>

    <div class="section">
        <h3>⚠ Low Stock Products</h3>
        <ul>
        ${
            lowStock.length === 0
            ? "<li>No low stock products</li>"
            : lowStock.map(p =>
                `<li>${p.name} - Stock: ${p.stock_quantity}</li>`
            ).join("")
        }
        </ul>
    </div>

    <div class="section">
        <h3>Recent Orders</h3>
        <ul>
        ${
            orders.slice(0,5).map(o => {

                let badgeClass = "";

                if(o.status === "DELIVERED") badgeClass = "badge-delivered";
                if(o.status === "PLACED") badgeClass = "badge-placed";
                if(o.status === "CANCELLED") badgeClass = "badge-cancelled";

                return `
                <li>
                Order #${o.id} - ₹${o.total_amount}
                <span class="badge ${badgeClass}">
                ${o.status}
                </span>
                </li>
                `
            }).join("")
        }
        </ul>
    </div>
    `;

    document.getElementById("contentArea").innerHTML = html;
}
function showAddProductForm() {
    const html = `
        <div class="form-container">
            <h2>Add Product</h2>

            <div class="form-group">
                <label>Product Name</label>
                <input type="text" id="pname" placeholder="Enter product name">
            </div>

            <div class="form-group">
                <label>Price</label>
                <input type="number" id="pprice" placeholder="Enter price">
            </div>

            <div class="form-group">
                <label>Stock</label>
                <input type="number" id="pstock" placeholder="Enter stock quantity">
            </div>

            <button class="primary-btn" onclick="addProduct()">Add Product</button>
        </div>
    `;

    document.getElementById("contentArea").innerHTML = html;
}

async function addProduct() {
    const name = document.getElementById("pname").value;
    const price = document.getElementById("pprice").value;
    const stock_quantity = document.getElementById("pstock").value;

    const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, price, stock_quantity })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Product added!");
        loadProducts();
    } else {
        alert(data.message);
    }
}
function showUpdateProductForm() {
    const html = `
        <div class="form-container">
            <h2>Update Product</h2>

            <div class="form-group">
                <label>Product ID</label>
                <input type="number" id="upid" placeholder="Enter product ID">
            </div>

            <div class="form-group">
                <label>New Name</label>
                <input type="text" id="upname" placeholder="Enter new name">
            </div>

            <div class="form-group">
                <label>New Price</label>
                <input type="number" id="upprice" placeholder="Enter new price">
            </div>

            <div class="form-group">
                <label>New Stock</label>
                <input type="number" id="upstock" placeholder="Enter new stock">
            </div>

            <button class="primary-btn" onclick="updateProduct()">Update Product</button>
        </div>
    `;

    document.getElementById("contentArea").innerHTML = html;
}
async function updateProduct() {
    const id = document.getElementById("upid").value;
    const name = document.getElementById("upname").value;
    const price = document.getElementById("upprice").value;
    const stock_quantity = document.getElementById("upstock").value;

    const res = await fetch(`${API}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ name, price, stock_quantity })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Product updated!");
        loadProducts();
    } else {
        alert(data.message);
    }
}