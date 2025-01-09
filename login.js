const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
  
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
  
        if (response.ok) {
          // Assuming the server responds with the user's status or some data
          const user = await response.json();
    
          // Check the user status and redirect accordingly
          if (user.status === 'professor') {
            window.location.href = '/mkdocs/index.html';
          } else if (user.status === 'admin') {
            window.location.href = '/qr.html'; // Or redirect to admin page
          } else {
            window.location.href = '/qr.html';  // Default to user page
          }
        } else {
          const errorText = await response.text();
          errorMessage.textContent = errorText;
          errorMessage.classList.remove('hidden');
        }
      } catch (error) {
        console.error('Error during login:', error);
        errorMessage.textContent = 'Server error. Please try again later.';
        errorMessage.classList.remove('hidden');
      }
    });