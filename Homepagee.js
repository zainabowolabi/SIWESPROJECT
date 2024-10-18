document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart and wishlist counts
    let cartCount = 0;
    let wishlistCount = 0;
    let cartData = JSON.parse(localStorage.getItem('cartData')) || []; // Load cart data from local storage
    let wishlistData = JSON.parse(localStorage.getItem('wishlistData')) || []; // Load wishlist data from local storage

    // Function to update cart count in the header
    function updateCartCount() {
        document.querySelector('.cart-count').textContent = cartCount;
    }

    // Function to update wishlist count in the header
    function updateWishlistCount() {
        document.querySelector('.wishlist-count').textContent = wishlistCount;
    }

    // Function to show alert message
    function showAlert(message) {
        alert(message);
    }

    // Function to save cart data to local storage
    function saveCartToLocalStorage() {
        localStorage.setItem('cartData', JSON.stringify(cartData));
    }

    // Function to save wishlist data to local storage
    function saveWishlistToLocalStorage() {
        localStorage.setItem('wishlistData', JSON.stringify(wishlistData));
    }

    // Function to add to cart
    function addToCart(product) {
        const existingProduct = cartData.find(item => item.name === product.name);

        if (existingProduct) {
            existingProduct.quantity++; // If product exists, increment the quantity
        } else {
            // If product doesn't exist, add it as a new item
            const newProduct = {
                name: product.name,
                price: parseFloat(product.price.replace(/[₦,]/g, '')), // Convert price string to a number
                quantity: 1
            };
            cartData.push(newProduct);
        }

        cartCount++; // Increment cart count
        updateCartCount(); // Update count display
        renderCartItems(); // Update cart display
        saveCartToLocalStorage(); // Save updated cart to local storage

        showAlert(`${product.name} has been added to your cart!`);
    }

    // Add to cart functionality for all products
    document.querySelectorAll('.add-to-cart').forEach(cartIcon => {
        cartIcon.addEventListener('click', (event) => {
            const productElement = event.currentTarget.closest('.product');
            const productName = productElement.querySelector('.product-name').innerText;

            // Try to find the price for the product
            let priceElement = productElement.querySelector('.price');
            let newPriceElement = productElement.querySelector('.newPrice');
            let productPrice;

            if (priceElement) {
                const discountedPriceText = priceElement.childNodes[priceElement.childNodes.length - 1].nodeValue.trim();
                productPrice = parseFloat(discountedPriceText.replace(/[₦,]/g, ''));
            } else if (newPriceElement) {
                const newPriceText = newPriceElement.innerText.trim();
                productPrice = parseFloat(newPriceText.replace(/[₦,]/g, ''));
            } else {
                showAlert('Price not found for the selected product.');
                return;
            }

            addToCart(productName, productPrice); // Use the addToCart function
        });
    });

    // Add to wishlist functionality for all products
    document.querySelectorAll('.add-to-wishlist').forEach(wishlistIcon => {
        wishlistIcon.addEventListener('click', (event) => {
            const productName = event.currentTarget.getAttribute('data-product');
            if (!wishlistData.includes(productName)) {
                wishlistData.push(productName); // Add to wishlist
                wishlistCount++;
                saveWishlistToLocalStorage(); // Save updated wishlist to local storage
            }
            updateWishlistCount();
            event.currentTarget.style.color = 'red';
            showAlert(`${productName} has been added to your wishlist`);
        });
    });

    // Initialize counts
    cartCount = cartData.length;
    wishlistCount = wishlistData.length;
    updateCartCount();
    updateWishlistCount();
    renderCartItems(); // Initial rendering of cart items

    // Initialize counts and render cart items
    cartCount = cartData.reduce((count, item) => count + item.quantity, 0);
    updateCartCount();
    renderCartItems(); // Initial rendering of cart items

    // Wishlist popup functionality
    document.getElementById('wishlist-icon').addEventListener('click', function() {
        toggleWishlistPopup();
    });

    // Function to toggle wishlist popup visibility and update its content
    function toggleWishlistPopup() {
        const wishlistPopup = document.getElementById('wishlist-popup');

        // Toggle wishlist popup visibility
        wishlistPopup.style.display = (wishlistPopup.style.display === 'none' || wishlistPopup.style.display === '') ? 'block' : 'none';

        // Update the wishlist display based on whether there are items in the wishlist
        if (wishlistData.length === 0) {
            document.getElementById('wishlist-empty').style.display = 'block'; // Show empty wishlist message
            document.getElementById('wishlist-items-container').style.display = 'none'; // Hide the items container
        } else {
            document.getElementById('wishlist-empty').style.display = 'none'; // Hide empty wishlist message
            document.getElementById('wishlist-items-container').style.display = 'block'; // Show items container

            // Render wishlist items
            renderWishlistItems();
        }
    }

    // Function to render wishlist items
    function renderWishlistItems() {
        const wishlistContainer = document.getElementById('wishlist-items-container');
        wishlistContainer.innerHTML = ''; // Clear existing items

        wishlistData.forEach((item, index) => {
            // Create the wishlist item HTML
            const wishlistItem = document.createElement('div');
            wishlistItem.classList.add('wishlist-item');

            wishlistItem.innerHTML = `
                <p>${item}</p>
                <span class="remove-item" data-index="${index}">&times;</span>
            `;

            // Append the wishlist item to the container
            wishlistContainer.appendChild(wishlistItem);

            // Add event listeners for removing items
            wishlistItem.querySelector('.remove-item').addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index')); // Get the index from the data attribute
                // Remove item from wishlistData and re-render
                wishlistData.splice(index, 1);
                wishlistCount--; // Update wishlist count
                updateWishlistCount(); // Refresh count
                renderWishlistItems(); // Re-render wishlist
                toggleWishlistPopup(); // Update wishlist visibility after removing items
                saveWishlistToLocalStorage(); // Save updated wishlist to local storage
            });
        });
    }

    // Function to display the cart popup
    document.getElementById('cart-icon').addEventListener('click', function() {
        toggleCartPopup();
    });

    // Function to toggle cart popup visibility and update its content
    function toggleCartPopup() {
        const cartPopup = document.getElementById('cart-popup');

        // Toggle cart popup visibility
        cartPopup.style.display = (cartPopup.style.display === 'none' || cartPopup.style.display === '') ? 'block' : 'none';

        // Update the cart display based on whether there are items in the cart
        if (cartData.length === 0) {
            document.getElementById('cart-empty').style.display = 'block'; // Show empty cart message
            document.getElementById('cart-items-container').style.display = 'none'; // Hide the items container
            document.getElementById('cart-total').style.display = 'none'; // Hide total
            document.getElementById('go-to-payment').style.display = 'none'; // Hide "Go to payment"
        } else {
            document.getElementById('cart-empty').style.display = 'none'; // Hide empty cart message
            document.getElementById('cart-items-container').style.display = 'block'; // Show items container
            document.getElementById('cart-total').style.display = 'flex'; // Show total
            document.getElementById('go-to-payment').style.display = 'block'; // Show "Go to payment"

            // Render cart items
            renderCartItems();
        }
    }

    // Function to render cart items
    function renderCartItems() {
        const cartContainer = document.getElementById('cart-items-container');
        cartContainer.innerHTML = ''; // Clear existing items

        if (cartData.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>'; // Message when cart is empty
            return;
        }

        let totalAmount = 0;

        // Render each item in the cart
        cartData.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <p>${item.name}</p>
                <span class="quantity">${item.quantity} x</span>
                <span class="price">₦${item.price.toFixed(2)}</span>
                <span class="remove-item" data-index="${index}">&times;</span>
            `;
   });
    }

    // Add to cart from wishlist
    document.getElementById('add-all-to-cart').addEventListener('click', function() {
        if (wishlistData.length === 0) {
            showAlert('Your wishlist is empty.'); // Notify user
            return;
        }

        // Add all wishlist items to cart
        wishlistData.forEach(item => {
            const productPrice = 100; // Replace this with logic to get actual product price based on the product name
            addToCart(item, productPrice);
        });

        wishlistData = []; // Clear the wishlist
        wishlistCount = 0; // Reset wishlist count
        updateWishlistCount(); // Update wishlist display
        saveWishlistToLocalStorage(); // Save updated wishlist to local storage
        toggleWishlistPopup(); // Close wishlist popup
        showAlert('All items have been added to the cart!'); // Notify user
    });
        // --- Payment Logic ---
    document.getElementById('go-to-payment').addEventListener('click', function() {
        const totalAmount = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
        const paystackUrl = `https://paystack.com/pay?amount=${totalAmount * 100}&email=customer@example.com`; // Adjust with actual email
        window.location.href = paystackUrl; // Redirect to Paystack payment page
    });

    const products = [
        { name: "WAW Multi-Purpose Soap", price: "₦350.00", image: "waw-multi-purpose-soap.png" },
        { name: "Eva Bathing Soap", price: "₦550.00", image: "eva-bathing-soap.png" },
        { name: "2Sure Dishwashing Liquid", price: "₦800.00", image: "2sure-dishwashing-liquid.png" },
        { name: "So Klin Detergent", price: "₦1,250.00", image: "so-klin-detergent.png" },
        { name: "Sunlight 2 in 1 Handwashing Powder", price: "₦1,250.00", image: "sunlight-2-in-1-handwashing-powder.png" },
        { name: "Viva Plus Detergent Powder", price: "₦1,300.00", image: "viva-plus-detergent-powder.png" },
        { name: "Cleanmax Sparkle Anti-Bacterial Hand Wash", price: "₦600.00", image: "cleanmax.png" },
        { name: "Familia Toilet Tissue", price: "₦250.00", image: "familia-tissue.png" },
        { name: "Laundry Basket", price: "₦750.00", image: "laundry-basket.png" },
        { name: "Black Facial Mask", price: "₦1,500.00", image: "black-facial-mask.png" },
        { name: "Cerave Acne Control Cleanser", price: "₦2,000.00", image: "cerave-cleanser.png" },
        { name: "Olay Lotion", price: "₦2,500.00", image: "olay-lotion.png" }
    ];
    
    // Search function
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResult = document.getElementById('searchResult');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const foundProduct = products.find(product => product.name.toLowerCase().includes(searchTerm));

        // Show the result
        if (foundProduct) {
            searchResult.innerHTML = `
                <div class="product">
                    <img src="${foundProduct.image}" alt="${foundProduct.name}">
                    <p class="product-name">Product found: ${foundProduct.name}</p>
                    <p class="price">Price: ${foundProduct.price}</p>
                    <button class="add-to-cart" data-product='${JSON.stringify(foundProduct)}'>Add to Cart</button>
                </div>
            `;
        } else {
            searchResult.innerHTML = `<p>Product doesn't exist</p>`;
        }
    });

    // Toggle search popup visibility when search icon is clicked
    const searchIcon = document.getElementById('search-icon');
    const searchPopup = document.getElementById('search-popup');
    
    searchIcon.addEventListener('click', () => {
        searchPopup.style.display = (searchPopup.style.display === 'none' || searchPopup.style.display === '') ? 'block' : 'none';
    });
    
// Add to cart functionality when clicking the button in the search result
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart')) {
        const product = JSON.parse(event.target.getAttribute('data-product')); // Get product details from the button
        addToCart(product); // Call addToCart function
    }
});

    
    // Add to cart functionality (placeholder)
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart')) {
            const productName = event.target.getAttribute('data-product');
            alert(`${productName} has been added to your cart!`); // Placeholder action
            // Implement actual add to cart logic here
        }
    });
    
     // Get elements from the DOM
const userIcon = document.getElementById('userIcon'); // The user icon that triggers the login popup
const loginModal = document.getElementById('loginModal'); // The login modal itself
const signupModal = document.getElementById('signupModal'); // The signup modal
const closeModalBtns = document.querySelectorAll('.close-btn'); // Close buttons within modals
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const messageArea = document.getElementById('message');
const signupMessageArea = document.getElementById('signupMessage');

// Function to toggle password visibility
function togglePasswordVisibility(inputField, toggleIcon) {
    toggleIcon.addEventListener('click', () => {
        const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
        inputField.setAttribute('type', type);
        toggleIcon.textContent = type === 'password' ? '👁️' : '🙈'; // Change icon based on visibility
    });
}

// Get password input fields and their toggle icons
const loginPasswordField = document.getElementById('password');
const signupPasswordField = document.getElementById('signupPassword');
const toggleLoginPasswordIcon = document.getElementById('toggleLoginPassword');
const toggleSignupPasswordIcon = document.getElementById('toggleSignupPassword');

// Initialize toggle password visibility
togglePasswordVisibility(loginPasswordField, toggleLoginPasswordIcon);
togglePasswordVisibility(signupPasswordField, toggleSignupPasswordIcon);

// Sample users for demo purposes
const usersDatabase = []; // This would typically be fetched from a server

// Function to open the login modal
function openLoginModal() {
    loginModal.style.display = 'block'; // Display the login modal
    signupModal.style.display = 'none'; // Hide the signup modal
}

// Function to open the signup modal
function openSignupModal() {
    signupModal.style.display = 'block'; // Display the signup modal
    loginModal.style.display = 'none'; // Hide the login modal
}

// Function to close modals
function closeModals() {
    loginModal.style.display = 'none'; // Hide the login modal
    signupModal.style.display = 'none'; // Hide the signup modal
}

// Event listeners for opening modals
userIcon.addEventListener('click', openLoginModal);
document.getElementById('openSignup').addEventListener('click', (e) => {
    e.preventDefault();
    openSignupModal(); // Open signup modal
});
document.getElementById('openLogin').addEventListener('click', (e) => {
    e.preventDefault();
    openLoginModal(); // Open login modal
});

// Close the modals when the close button (X) is clicked
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
});

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target === loginModal || event.target === signupModal) {
        closeModals();
    }
});

let isLoggedIn = false; // Track login state
let currentUserEmail = ''; // Store current user's email

// Handle signup
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const existingUser = usersDatabase.find(u => u.email === email);

    if (existingUser) {
        signupMessageArea.textContent = "Email already exists. Please login.";
        setTimeout(() => signupMessageArea.textContent = '', 3000);
    } else {
        usersDatabase.push({ name, email, password });
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        signupMessageArea.textContent = "Signup successful! You can now log in.";
        setTimeout(closeModals, 3000);
    }
});

// Handle login
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginID').value;
    const password = document.getElementById('password').value;

    const existingUser = usersDatabase.find(u => u.email === email);

    if (existingUser && existingUser.password === password) {
        isLoggedIn = true; // Set login state to true
        currentUserEmail = email; // Store the logged-in user's email

        // Show a welcome back message and hide the login form
        welcomeMessageArea.textContent = `Welcome back! Which of our exclusive deals would you like to get today?`;
        closeLoginModal(); // Optionally close the login modal

        // Update user icon
        userIcon.textContent = "👤"; // Change icon to a profile icon
    } else {
        messageArea.textContent = "Email doesn't exist or incorrect password. Please sign up.";
        setTimeout(() => messageArea.textContent = '', 3000);
    }
});

// Function to handle user icon click
userIcon.addEventListener('click', () => {
    if (isLoggedIn) {
        // Show user profile or logout option
        alert(`Logged in as ${currentUserEmail}`);
        // You could also open a modal with user options here
    } else {
        openLoginModal(); // Show login modal if not logged in
    }
});

// Auto-fill login form if credentials exist in local storage
window.addEventListener('load', () => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');

    if (savedEmail) {
        document.getElementById('loginID').value = savedEmail;
    }
    if (savedPassword) {
        document.getElementById('password').value = savedPassword;
    }
});
// Function to open the profile modal
function openProfileModal() {
    document.getElementById('userEmailDisplay').textContent = currentUserEmail; // Display current user email
    document.getElementById('profileModal').style.display = 'block'; // Show modal
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    isLoggedIn = false; // Reset login state
    currentUserEmail = ''; // Clear user email
    userIcon.textContent = "👥"; // Change icon back to user icon
    closeProfileModal(); // Close profile modal
});

// Event listener for user icon click
userIcon.addEventListener('click', () => {
    if (isLoggedIn) {
        openProfileModal(); // Show profile modal if logged in
    } else {
        openLoginModal(); // Show login modal if not logged in
    }
});


      // Close Wishlist Popup when the close button is clicked
    document.querySelector('#wishlist-popup .close-btn').addEventListener('click', function() {
        document.getElementById('wishlist-popup').style.display = 'none';
    });

    // Close Cart Popup when the close button is clicked
    document.querySelector('#cart-popup .close-btn').addEventListener('click', function() {
        document.getElementById('cart-popup').style.display = 'none';
    });

      // Close search popup when close button is clicked
      const closeBtn = document.querySelector('#search-popup .close-btn');
      closeBtn.addEventListener('click', () => {
          searchPopup.style.display = 'none';
      });
 });

