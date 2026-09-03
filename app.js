// 1. Registrar el Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker registrado con éxito.'))
            .catch(err => console.error('Error al registrar Service Worker:', err));
    });
}

// 2. Lógica para capturar y mostrar la opción de instalación
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Evita que el navegador muestre su propio banner automático de inmediato
    e.preventDefault();
    // Guarda el evento para usarlo más tarde
    deferredPrompt = e;
    // Muestra nuestro botón personalizado de instalación
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    // Muestra la ventana flotante nativa de instalación
    deferredPrompt.prompt();
    
    // Espera la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`El usuario respondió a la instalación: ${outcome}`);
    
    // Limpia la variable y oculta el botón ya que se procesó la acción
    deferredPrompt = null;
    installBtn.style.display = 'none';
});

// Ocultar el botón si la app ya está instalada y se abre desde el escritorio
window.addEventListener('appinstalled', () => {
    console.log('¡Gracias por instalar la aplicación!');
    installBtn.style.display = 'none';
    deferredPrompt = null;
});

