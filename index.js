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

        wishlistPopup.style.display = (wishlistPopup.style.display === 'none' || wishlistPopup.style.display === '') ? 'block' : 'none';

        if (wishlistData.length === 0) {
            document.getElementById('wishlist-empty').style.display = 'block'; 
            document.getElementById('wishlist-items-container').style.display = 'none'; 
        } else {
            document.getElementById('wishlist-empty').style.display = 'none'; 
            document.getElementById('wishlist-items-container').style.display = 'block'; 

            renderWishlistItems();
        }
    }

   // Function to render wishlist items
function renderWishlistItems() {
    const wishlistContainer = document.getElementById('wishlist-items-container');
    wishlistContainer.innerHTML = ''; // Clear the wishlist container

    wishlistData.forEach((item, index) => {
        const wishlistItem = document.createElement('div');
        wishlistItem.classList.add('wishlist-item');

        wishlistItem.innerHTML = 
            `<p>${item}</p>
            <span class="remove-item" data-index="${index}">&times;</span>`;

        wishlistContainer.appendChild(wishlistItem);

        wishlistItem.querySelector('.remove-item').addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            wishlistData.splice(index, 1); // Remove item from wishlist
            wishlistCount--; 
            updateWishlistCount(); // Update wishlist counter in UI
            renderWishlistItems(); // Re-render the updated wishlist
            toggleWishlistPopup();
            saveWishlistToLocalStorage(); // Save the updated wishlist to localStorage
        });
    });
}

document.getElementById('cart-icon').addEventListener('click', function() {
    toggleCartPopup(); // Toggle visibility of the cart popup
});

function toggleCartPopup() {
    const cartPopup = document.getElementById('cart-popup');

    // Toggle cart popup display and show/hide relevant elements based on cart status
    cartPopup.style.display = (cartPopup.style.display === 'none' || cartPopup.style.display === '') ? 'block' : 'none';

    if (cartData.length === 0) {
        document.getElementById('cart-empty').style.display = 'block'; // Show empty cart message
        document.getElementById('cart-items-container').style.display = 'none';
        document.getElementById('cart-total').style.display = 'none'; 
        document.getElementById('go-to-payment').style.display = 'none'; 
    } else {
        document.getElementById('cart-empty').style.display = 'none'; 
        document.getElementById('cart-items-container').style.display = 'block'; // Show cart items
        document.getElementById('cart-total').style.display = 'flex'; 
        document.getElementById('go-to-payment').style.display = 'block'; 

        renderCartItems(); // Render cart items and display them in the cart
    }
}
// Function to render all items in the cart, calculate the total amount, and handle item removal
function renderCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    cartContainer.innerHTML = ''; // Clear the cart container

    let totalAmount = 0;

    cartData.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = 
            `<p>${item.name}</p>
            <span class="quantity">${item.quantity} x</span>
            <span class="price">₦${item.price.toFixed(2)}</span>
            <span class="remove-item" data-index="${index}">&times;</span>`;

        cartContainer.appendChild(cartItem);

        totalAmount += item.price * item.quantity; // Calculate the total amount
    });

    document.getElementById('total-amount').innerText = `₦${totalAmount.toFixed(2)}`; // Display total amount

  // Add event listeners for each "remove-item" button to remove items from the cart
    document.querySelectorAll('.remove-item').forEach(removeBtn => {
        removeBtn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            cartData.splice(index, 1); // Remove item from cart
            cartCount--; 
            updateCartCount(); // Update cart counter in UI
            renderCartItems(); // Re-render the updated cart items
            saveCartToLocalStorage(); // Save updated cart to localStorage
            toggleCartPopup(); 
        });
    });
}
// Event listener for adding all items from the wishlist to the cart
document.getElementById('add-all-to-cart').addEventListener('click', function() {
    if (wishlistData.length === 0) {
        showAlert('Your wishlist is empty.'); // Show alert if the wishlist is empty
        return;
    }

    wishlistData.forEach(item => {
        const productPrice = 100; // Assign a fixed price to each wishlist item
        addToCart(item, productPrice); // Add wishlist items to cart
    });

    wishlistData = []; // Clear the wishlist after adding items to the cart
    wishlistCount = 0; 
    updateWishlistCount(); // Update wishlist counter in UI
    saveWishlistToLocalStorage(); // Save updated wishlist to localStorage
    toggleWishlistPopup(); // Close wishlist popup
    showAlert('All items have been added to the cart!'); // Show success message
});
// Event listener for proceeding to the payment page with the total cart amount
document.getElementById('go-to-payment').addEventListener('click', function() {
    const totalAmount = cartData.reduce((total, item) => total + (item.price * item.quantity), 0); // Calculate total amount for payment
    const paystackUrl = `https://paystack.com/pay?amount=${totalAmount * 100}&email=customer@example.com`; 
    window.location.href = paystackUrl; // Redirect to payment page
});

//search functionality
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


// Add to cart functionality (legacy placeholder to remove)
document.addEventListener('click', (event) => {
if (event.target.classList.contains('add-to-cart')) {
    const productName = event.target.getAttribute('data-product');
    alert(`${productName} has been added to your cart!`); // Placeholder action
    // Implement actual add to cart logic here
}
});

 // Get elements from the DOM
    const userIcon = document.getElementById('userIcon');
    const loginModal = document.getElementById('loginModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    userIcon.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

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
    
      // Close Wishlist Popup when the close button is clicked
      function closeWishlistPopup() {
        wishlistPopup.style.display = 'none'; // Hide the popup
    }
    
    // Event listener to close the popup when the close button is clicked
    wishlistCloseBtn.addEventListener('click', closeWishlistPopup);

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