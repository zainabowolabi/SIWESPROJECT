document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission

        const name = document.getElementById('name').value;
        const company = document.getElementById('company').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;

        // Here you can handle the form submission, e.g., sending data to your server
        console.log('Form Submitted:', {
            name,
            company,
            email,
            phone,
            message,
        });

        // Clear the form after submission
        contactForm.reset();
        alert('Your message has been sent!'); // Confirmation message
    });
});
