document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('item-input');
    const addBtn = document.getElementById('add-btn');
    const shoppingList = document.getElementById('shopping-list');

    // 1. Obtener los artículos guardados del dispositivo
    let items = JSON.parse(localStorage.getItem('my_shopping_list')) || [];

    // 2. Guardar los artículos en el almacenamiento local
    function saveToLocalStorage() {
        localStorage.setItem('my_shopping_list', JSON.stringify(items));
    }

    // 3. Dibujar la lista en la pantalla
    function renderList() {
        shoppingList.innerHTML = '';
        
        items.forEach((item, index) => {
            const li = document.createElement('li');
            if (item.completed) li.classList.add('completed');

 const iconName = item.completed ? '✅' : '🔲'; 
const checkedClass = item.completed ? 'checked' : '';

            li.innerHTML = `
                <span class="material-icons checkbox-icon ${checkedClass}" onclick="toggleItem(${index})">${iconName}</span>
                <span class="item-text" onclick="toggleItem(${index})">${item.text}</span>
                <button class="delete-btn" onclick="deleteItem(${index})">
                    <span class="material-icons">delete</span>
                </button>
            `;
            shoppingList.appendChild(li);
        });
    }

    // 4. Agregar un nuevo producto
    function addItem() {
        const text = itemInput.value.trim();
        if (text === '') return;

        items.push({ text: text, completed: false });
        itemInput.value = '';
        
        saveToLocalStorage();
        renderList();
    }

    // 5. Marcar o desmarcar un producto (Función global)
    window.toggleItem = (index) => {
        items[index].completed = !items[index].completed;
        saveToLocalStorage();
        renderList();
    };

    // 6. Eliminar un producto (Función global)
    window.deleteItem = (index) => {
        items.splice(index, 1);
        saveToLocalStorage();
        renderList();
    };

    // Escuchadores de eventos para la lista
    addBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });

    // Cargar la lista al abrir la aplicación
    renderList();
});

// =========================================================================
// AQUÍ COMIENZA EL BLOQUE QUE HABÍA QUE REEMPLAZAR (Service Worker e Instalación en Chrome)
// =========================================================================

// 1. Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker activo.'))
            .catch(err => console.error('Error de registro:', err));
    });
}

// 2. Lógica de instalación corregida para Google Chrome (Espera al clic en el botón)
let deferredPrompt;
const installBtn = document.getElementById('chrome-install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Evita que Chrome intente lanzar su propio aviso automáticamente
    e.preventDefault();
    // Guarda el evento para usarlo en el clic
    deferredPrompt = e;
    // Muestra nuestro botón personalizado de instalación al usuario
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

// El navegador exige que la acción ocurra DENTRO de un evento 'click' provocado por el usuario
if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Ahora sí, Chrome aprueba el prompt porque viene de un clic directo
        deferredPrompt.prompt();
        
        // Conoce la respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`El usuario decidió: ${outcome}`);
        
        // Limpia la variable y oculta el botón ya que se procesó
        deferredPrompt = null;
        installBtn.style.display = 'none';
    });
}

// Oculta el botón si el usuario ya la tiene instalada en su dispositivo
window.addEventListener('appinstalled', () => {
    console.log('¡Instalación completada con éxito!');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
    deferredPrompt = null;
});

