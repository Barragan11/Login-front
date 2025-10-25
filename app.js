// --- Manejo del modal de login (funciona en cualquier página) ---
document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const loginModal = document.getElementById('loginModal');
  const closeModal = document.getElementById('closeModal');

  if (loginBtn && loginModal && closeModal) {
    loginBtn.onclick = function() {
      loginModal.style.display = 'block';
    };
    closeModal.onclick = function() {
      loginModal.style.display = 'none';
    };
    window.onclick = function(event) {
      if (event.target === loginModal) {
        loginModal.style.display = 'none';
      }
    };
  }
});

// Capturamos el formulario
const form = document.getElementById("formLogin");

// Escuchamos el evento "submit"
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // evita que la página se recargue

  // Obtener los valores escritos por el usuario
  const login = document.getElementById("login").value;
  const contrasena = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cuenta: login,
        contrasena: contrasena
      })
    });

    let data;
    try {
      data = await res.json();
    } catch (parseErr) {
      console.warn("Respuesta no JSON del servidor", parseErr);
      data = {};
    }

    if (res.ok) {
      const cuenta = data.usuario?.cuenta;
      if (cuenta) {
        // ✅ Guardar login y contraseña en localStorage (solo práctica)
        localStorage.setItem("loginGuardado", login);
        localStorage.setItem("passwordGuardado", contrasena);

        // ✅ Mostrar mensaje con SweetAlert2
        Swal.fire({
          title: 'Inicio de sesión exitoso',
          html: `Bienvenido, <strong>${cuenta}</strong>`,
          icon: 'success',
          confirmButtonText: 'Continuar',
          allowOutsideClick: false
        }).then(() => {
          console.log("Usuario recibido:", data.usuario);

          // Mostrar el nombre junto al candado
          const userNameSpan = document.getElementById('userName');
          if (userNameSpan) userNameSpan.textContent = cuenta;

          // Cerrar modal automáticamente
          const loginModal = document.getElementById('loginModal');
          if (loginModal) loginModal.style.display = 'none';

          // Limpiar formulario
          form.reset();
        });

      } else {
        console.warn('200 OK sin usuario:', data);
        Swal.fire({
          title: 'Error',
          text: 'Respuesta incompleta del servidor. No se permite el acceso.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      Swal.fire({
        title: 'Acceso denegado',
        text: data?.error ?? `Error ${res.status}: ${res.statusText}`,
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      }).then(() => {
        document.getElementById("login").value = "";
        document.getElementById("password").value = "";
      });
    }

  } catch (err) {
    console.error("Error al conectar con el servidor:", err);
    Swal.fire({
      title: 'Error de conexión',
      text: 'No se pudo conectar con el servidor.',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }
});
