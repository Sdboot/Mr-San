// Shopping Cart Array
let cart = [];

// Toggle Mobile Menu
function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    
    if (hamburger && navbar) {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    }
}

// Close menu when link is clicked
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-menu a, .dropdown-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const hamburger = document.getElementById('hamburger');
            const navbar = document.getElementById('navbar');
            if (hamburger && navbar) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
            }
        });
    });
});

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('mrSanCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('mrSanCart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1,
            id: Date.now()
        });
    }
    
    saveCart();
    updateCartDisplay();
    
    // Show visual feedback
    showNotification(`${productName} added to cart!`);
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartDisplay();
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) {
        alert('Cart is already empty!');
        return;
    }
    
    const confirmed = confirm('Are you sure you want to clear the cart?');
    if (confirmed) {
        cart = [];
        saveCart();
        updateCartDisplay();
        showNotification('Cart cleared');
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;
    
    // Clear previous items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = '₦0.00';
        return;
    }
    
    // Add cart items to display
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₦${item.price.toLocaleString('en-NG')} x ${item.quantity} = ₦${itemTotal.toLocaleString('en-NG')}</p>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="width: 30px; text-align: center;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Calculate and update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = '₦' + total.toLocaleString('en-NG');
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add some items!');
        return;
    }

    // Close cart sidebar
    toggleCart();
    
    // Scroll to contact form and populate order summary
    updateOrderSummary();
    scrollToSection('contact');
    showNotification('Please complete your delivery information to finalize your order');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #ffd700, #ffed4e);
        color: #1a1a1a;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 999;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close cart when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

// Update order summary in contact form
function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const orderTotal = document.getElementById('orderTotal');
    
    orderSummary.innerHTML = '';
    
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p class="empty-cart">No items in cart</p>';
        orderTotal.textContent = '₦0.00';
        return;
    }
    
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div>
                <span class="order-item-name">${item.name}</span>
                <span style="color: #666; font-size: 12px;"> x${item.quantity}</span>
            </div>
            <span class="order-item-price">₦${itemTotal.toLocaleString('en-NG')}</span>
        `;
        orderSummary.appendChild(orderItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    orderTotal.textContent = '₦' + parseFloat(total).toLocaleString('en-NG');
}

// Submit contact form
function submitContact(event) {
    event.preventDefault();
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        message: document.getElementById('message').value,
        cartItems: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('mrSanOrders') || '[]');
    orders.push({
        ...formData,
        orderId: 'MR-SAN-' + Date.now(),
        orderDate: new Date().toLocaleString()
    });
    localStorage.setItem('mrSanOrders', JSON.stringify(orders));
    
    // Show success message
    showNotification('Order placed successfully! Thank you for shopping with Mr SAN!');
    
    // Reset form and cart
    document.getElementById('contactForm').reset();
    cart = [];
    saveCart();
    updateCartDisplay();
    updateOrderSummary();
    
    // Show order confirmation
    const confirmationMessage = `
Order Confirmation
Order ID: ${orders[orders.length - 1].orderId}
Thank you for your purchase!

We will send you a confirmation email at: ${formData.email}
    `;
    
    setTimeout(() => {
        alert(confirmationMessage);
    }, 500);
}
