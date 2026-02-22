const API = "http://localhost:3000/api";

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
async function loadProducts() {
    const res = await fetch(`${API}/products`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    const products = await res.json();

    let html = "<div class='card'><h2>Products</h2><ul>";

    products.forEach(p => {

        html += `
            <li>
                ${p.name} - ₹${p.price} - Stock: ${p.stock_quantity}
                ${
                    getRole() === "ADMIN"
                        ? `<button class="delete-btn"
                                   onclick="deleteProduct(${p.id})">
                                   🗑 Delete
                           </button>`
                        : ""
                }
            </li>
        `;
    });

    html += "</ul></div>";

    document.getElementById("contentArea").innerHTML = html;
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
                    ? `<button onclick="cancelOrder(${o.id})">Cancel</button>`
                    : ""}
            </li>
        `;
    });

    html += "</ul></div>";
    document.getElementById("contentArea").innerHTML = html;
}

function showOrderForm() {
    const html = `
        <div class="card">
            <h2>Place Order</h2>
            <input type="text" id="productName" placeholder="Product Name"><br><br>
            <input type="number" id="quantity" placeholder="Quantity"><br><br>
            <button onclick="placeOrder()">Submit</button>
        </div>
    `;

    document.getElementById("contentArea").innerHTML = html;
}

async function placeOrder() {
    const product_name = document.getElementById("productName").value;
    const quantity = document.getElementById("quantity").value;

    const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            items: [{ product_name, quantity }]
        })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Order placed successfully!");
        loadMyOrders();
    } else {
        alert(data.message);
    }
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

async function loadOrders() {
    const res = await fetch(`${API}/orders`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });

    const data = await res.json();

    let html = "<div class='card'><h2>All Orders</h2><ul>";

    data.forEach(o => {
        html += `
            <li>
                Order #${o.id} - ₹${o.total_amount} - ${o.status}
                ${o.status === "PLACED"
                    ? `<button onclick="markDelivered(${o.id})">Mark Delivered</button>`
                    : ""}
            </li>
        `;
    });

    html += "</ul></div>";
    document.getElementById("contentArea").innerHTML = html;
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
        <div style="display:flex; gap:20px;">
    <div class="card" style="flex:1; text-align:center;">
        <h2>${products.length}</h2>
        <p>Products Available</p>
    </div>

    <div class="card" style="flex:1; text-align:center;">
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

    // Calculate revenue
    const revenue = orders
        .filter(o => o.status === "DELIVERED")
        .reduce((sum, o) => sum + parseFloat(o.total_amount), 0);

    // Low stock products
    const lowStock = products.filter(p => p.stock_quantity < 20);

    const html = `

        <div class="card">
            <h2>Welcome Admin 👨‍💼</h2>
            <p>Monitor products, manage orders and track performance.</p>
        </div>

        <div style="display:flex; gap:20px; flex-wrap:wrap;">
            <div class="card" style="flex:1; min-width:200px; text-align:center;">
                <h2>${products.length}</h2>
                <p>Total Products</p>
            </div>

            <div class="card" style="flex:1; min-width:200px; text-align:center;">
                <h2>${orders.length}</h2>
                <p>Total Orders</p>
            </div>

            <div class="card" style="flex:1; min-width:200px; text-align:center;">
                <h2>₹${revenue.toFixed(2)}</h2>
                <p>Total Revenue</p>
            </div>
        </div>

        <div class="card">
            <h3>⚠ Low Stock Products</h3>
            <ul>
                ${lowStock.length === 0 
                    ? "<li>No low stock items</li>"
                    : lowStock.map(p =>
                        `<li>${p.name} - Stock: ${p.stock_quantity}</li>`
                    ).join("")
                }
            </ul>
        </div>

        <div class="card">
            <h3>Recent Orders</h3>
            <ul>
                ${orders.slice(0,5).map(o =>
                    `<li>Order #${o.id} - ₹${o.total_amount} - ${o.status}</li>`
                ).join("")}
            </ul>
        </div>
    `;

    document.getElementById("contentArea").innerHTML = html;
}
function showAddProductForm() {
    const html = `
        <div class="card">
            <h2>Add Product</h2>
            <input type="text" id="pname" placeholder="Name"><br><br>
            <input type="number" id="pprice" placeholder="Price"><br><br>
            <input type="number" id="pstock" placeholder="Stock"><br><br>
            <button onclick="addProduct()">Add</button>
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
        <div class="card">
            <h2>Update Product</h2>
            <input type="number" id="upid" placeholder="Product ID"><br><br>
            <input type="text" id="upname" placeholder="New Name"><br><br>
            <input type="number" id="upprice" placeholder="New Price"><br><br>
            <input type="number" id="upstock" placeholder="New Stock"><br><br>
            <button onclick="updateProduct()">Update</button>
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