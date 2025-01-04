document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('message');
  
    try {
      // Validar credenciales contra JSON Server
      const response = await fetch('http://localhost:3000/usuarios'); // Endpoint
      const users = await response.json();
      const user = users.find(user => user.username === username && user.password === password);
  
      if (user) {
        // Login exitoso
        messageElement.textContent = `Login exitoso. Bienvenido, ${user.username}!`;
        messageElement.style.color = 'green';
  
        // Guardar la sesión en localStorage
        localStorage.setItem('loggedIn', 'true'); // Indicamos que el usuario está logueado
        localStorage.setItem('username', user.username); // Guardamos el nombre de usuario
  
        // Generar y mostrar código aleatorio
        const generatedCode = generateRandomCode();
        document.getElementById('generatedCode').textContent = generatedCode;
        document.getElementById('verificationSection').style.display = 'block';
  
        // Manejar verificación del código
        handleCodeVerification(generatedCode);
      } else {
        messageElement.textContent = 'Usuario o contraseña incorrectos.';
        messageElement.style.color = 'red';
      }
    } catch (error) {
      console.error('Error al conectar con JSON Server:', error);
      messageElement.textContent = 'Error al conectar con el servidor.';
      messageElement.style.color = 'red';
    }
  });
  
  // Función para generar un código aleatorio de 4 caracteres
  function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  
  // Manejar la validación del código generado
  function handleCodeVerification(generatedCode) {
    const verifyButton = document.getElementById('verifyButton');
    verifyButton.addEventListener('click', () => {
      const userCode = document.getElementById('verificationCode').value;
  
      if (userCode === generatedCode) {
        alert('¡Código correcto! Redirigiendo...');
        window.location.href = 'home.html'; // Redirigir a la página deseada
      } else {
        alert('Código incorrecto. Inténtalo de nuevo.');
      }
    });
  }