// main.js - Central logic for mocking database via LocalStorage

// Initialize dummy data if empty or override paintings to show new images
function initDb() {
    const defaultPaintings = [
        { id: 1, title: 'Starry Night Replica', description: 'A beautiful starry night scene showcasing swirling winds and dramatic contrasting colors representing emotion against a calm rural village scene.', price: 150.00, image_url: 'https://cdn.britannica.com/78/43678-050-F4DC8D93/Starry-Night-canvas-Vincent-van-Gogh-New-1889.jpg' },
        { id: 2, title: 'Abstract Waves', description: 'Blue and white abstract art. Evokes the chaotic calming power of the deep ocean waves crashing against each other in white seafoam texture.', price: 200.00, image_url: 'https://images.stockcake.com/public/d/e/4/de4056e1-0ebb-412c-a91c-14b796704968_large/oceanic-art-waves-stockcake.jpg' },
        { id: 3, title: 'Mountain View', description: 'Serene mountain landscape painting showcasing pine trees framing a grand vista in a beautiful golden evening hour glow.', price: 120.50, image_url: 'https://artnow.ru/img/1154000/1154567.jpg' },
        { id: 4, title: 'Vibrant Fields', description: 'An impressionist painting featuring vivid, colorful blooming flowers stretching across a sun-drenched pastoral landscape.', price: 180.00, image_url: 'https://media.craiyon.com/2025-08-11/IWSGziNRT2G_TNig-s6w-w.webp' },
        { id: 5, title: 'Urban Geometry', description: 'A sleek modern piece heavily focused on angular lines, structured grid patterns, and muted concrete colors representing the soul of the city.', price: 210.00, image_url: 'https://www.shutterstock.com/image-vector/vibrant-abstract-cityscape-golden-yellows-600nw-2585745305.jpg' },
        { id: 6, title: 'Golden Autumn', description: 'Deep red and gold foliage lines a quiet forest pathway, capturing the fleeting beautiful warmth of the autumn season.', price: 175.50, image_url: 'https://printawallpaper.com/wp-content/uploads/2020/07/Golden_autumn_d-1.jpg' },
        { id: 7, title: 'The Wanderer', description: 'A solitary figure standing against an imposing, misty backdrop of swirling clouds and dramatic cliff faces. A romantic, somber piece.', price: 290.00, image_url: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?auto=format&fit=crop&q=80&w=800' },
        { id: 8, title: 'Midnight Cityscape', description: 'Bright neon streaks contrast sharply against the dark ink canvas, illustrating the bustling night life of a metropolitan highway.', price: 130.00, image_url: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/midnight-city-ash-hussein.jpg' },
        { id: 9, title: 'Floral Symphony', description: 'A dense, tightly painted composition of various spring flowers overlapping each other in a celebration of botanical life.', price: 145.00, image_url: 'https://img.freepik.com/premium-photo/photo-beautiful-different-colored-oil-painting-flowers_763111-113691.jpg' },
        { id: 10, title: 'Silent Winter', description: 'A minimalist piece showing sparse, leafless black trees against a stark white background of falling snow. Beautiful in its simplicity.', price: 95.00, image_url: 'https://images.saatchiart.com/saatchi/1342371/art/9355351/8418459-HSC00923-7.jpg' },
        { id: 11, title: 'Desert Mirage', description: 'Warm terracotta, orange, and hazy yellow tones blend to form beautiful sweeping sand dunes beneath a harsh midday sun.', price: 165.00, image_url: 'https://afremov.com/media/catalog/product/1/1/11211_desert_mirage_on_mercury_j82h5krp0bjlnobc.jpg' },
        { id: 12, title: 'Surreal Cosmos', description: 'An experimental, highly imaginative piece blending the familiar lines of human profiles with the chaotic, starry depths of a nebula in space.', price: 340.00, image_url: 'https://cdn.kreezalid.com/kreezalid/556408/catalog/8092/72/1000x1000_abstractouterspace_zgjwu_263063294.jpg' }
    ];
    // Force set paintings so the newly generated list of 12 images appears
    localStorage.setItem('paintings', JSON.stringify(defaultPaintings));
    
    if (!localStorage.getItem('users')) {
        const defaultUsers = [
            { id: 1, name: 'Admin User', email: 'admin@aesthera.com', password: 'password', role: 'admin' }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify([]));
    }
}

// Get Data
function getPaintings() {
    return JSON.parse(localStorage.getItem('paintings')) || [];
}

function getPaintingById(id) {
    const paintings = getPaintings();
    return paintings.find(p => p.id == id);
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function getOrders() {
    return JSON.parse(localStorage.getItem('orders')) || [];
}



function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

// Auth Actions
function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function registerUser(name, email, password) {
    const users = getUsers();
    if (users.find(u => u.email === email)) return false;

    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push({ id: newId, name, email, password, role: 'customer' });
    localStorage.setItem('users', JSON.stringify(users));
    return true;
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function placeOrder(paintingId) {
    const user = getCurrentUser();
    if (!user || user.role !== 'customer') return false;

    const orders = getOrders();
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    orders.push({
        id: newId,
        customer_id: user.id,
        painting_id: parseInt(paintingId),
        status: 'Pending',
        order_date: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    return true;
}



// UI Helpers
function renderNav() {
    const user = getCurrentUser();
    const authNav = document.getElementById('authNav');
    if (!authNav) return;

    if (!user) {
        authNav.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="register.html">Register</a></li>
        `;
    } else if (user.role === 'admin') {
        authNav.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="admin_dashboard.html">Admin Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="#" onclick="logoutUser()">Logout (${user.name})</a></li>
        `;
    } else {
        authNav.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="#" onclick="logoutUser()">Logout (${user.name})</a></li>
        `;
    }

    // Update footer year if placeholder exists
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// Auto-init on script load
initDb();
document.addEventListener('DOMContentLoaded', renderNav);
