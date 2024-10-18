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
    function addToCart(productName, productPrice) {
        const existingProduct = cartData.find(item => item.name === productName);

        if (existingProduct) {
            existingProduct.quantity++; // If product exists, increment the quantity
        } else {
            // If product doesn't exist, add it as a new item
            const newProduct = {
                name: productName,
                price: productPrice,
                quantity: 1
            };
            cartData.push(newProduct);
        }

        cartCount++; // Increment cart count
        updateCartCount(); // Update count display
        renderCartItems(); // Update cart display
        saveCartToLocalStorage(); // Save updated cart to local storage

        showAlert(`${productName} has been added to cart`);
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

    // Example renderCartItems function with local storage
    function renderCartItems() {
        const cartContainer = document.getElementById('cart-items-container');
        cartContainer.innerHTML = ''; // Clear existing items

        let totalAmount = 0;

        cartData.forEach((item, index) => {
            // Create the cart item HTML
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            cartItem.innerHTML = `
                <p>${item.name}</p>
                <span class="quantity">${item.quantity} x</span>
                <span class="price">₦${item.price.toFixed(2)}</span>
                <span class="remove-item" data-index="${index}">&times;</span>
            `;

            // Append the cart item to the container
            cartContainer.appendChild(cartItem);

            // Calculate the total amount
            totalAmount += item.price * item.quantity;
        });

        // Update the total amount in the cart
        document.getElementById('total-amount').innerText = `₦${totalAmount.toFixed(2)}`;

        // Add event listeners for removing items
        document.querySelectorAll('.remove-item').forEach(removeBtn => {
            removeBtn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index')); // Get the index from the data attribute
                // Remove item from cartData and re-render
                cartData.splice(index, 1);
                cartCount--; // Update cart count
                updateCartCount(); // Refresh count
                renderCartItems(); // Re-render cart
                toggleCartPopup(); // Update cart visibility after removing items
                saveCartToLocalStorage(); // Save updated cart to local storage
            });
        });
    }

    // --- Payment Logic ---
    document.getElementById('go-to-payment').addEventListener('click', function() {
        const totalAmount = cartData.reduce((total, item) => total + (item.price * item.quantity), 0);
        const paystackUrl = `https://paystack.com/pay?amount=${totalAmount * 100}&email=customer@example.com`; // Adjust with actual email
        window.location.href = paystackUrl; // Redirect to Paystack payment page
    });

    // --- Search Popup Logic ---
    const searchIcon = document.getElementById('search-icon');
    const searchPopup = document.getElementById('search-popup');
    searchIcon.addEventListener('click', () => {
        searchPopup.style.display = (searchPopup.style.display === 'none' || searchPopup.style.display === '') ? 'block' : 'none';
    });

  
        // --- Login Popup Logic ---
    
        // Get elements from the DOM
        const userIcon = document.getElementById('userIcon'); // The user icon that triggers the login popup
        const loginModal = document.getElementById('loginModal'); // The login modal itself
        const closeModalBtn = loginModal.querySelector('.close-btn'); // The close button within the modal
    
        // Function to open the login modal
        function openLoginModal() {
            loginModal.style.display = 'block'; // Display the modal
        }
    
        // Function to close the login modal
        function closeLoginModal() {
            loginModal.style.display = 'none'; // Hide the modal
        }
    
        // Event listener for opening the login modal when user icon is clicked
        userIcon.addEventListener('click', openLoginModal);
    
        // Event listener for closing the modal when the close button (X) is clicked
        closeModalBtn.addEventListener('click', closeLoginModal);
    
        // Close the modal if the user clicks anywhere outside of the modal content
        window.addEventListener('click', function(event) {
            if (event.target === loginModal) {
                closeLoginModal();
            }
        });
    });
    
