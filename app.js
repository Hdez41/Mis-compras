document.addEventListener('DOMContentLoaded', () => {
    const itemInput = document.getElementById('item-input');
    const addBtn = document.getElementById('add-btn');
    const shoppingList = document.getElementById('shopping-list');

    // Cargar artículos guardados al iniciar la app
    let items = JSON.parse(localStorage.getItem('shopping_list')) || [];

    function saveToLocalStorage() {
        localStorage.setItem('shopping_list', JSON.stringify(items));
    }

    function renderList() {
        shoppingList.innerHTML = '';
        
        items.forEach((item, index) => {
            const li = document.createElement('li');
            if (item.completed) li.classList.add('completed');

            // Icono de la casilla de verificación
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

    function addItem() {
        const text = itemInput.value.trim();
        if (text === '') return;

        items.push({ text: text, completed: false });
        itemInput.value = '';
        
        saveToLocalStorage();
        renderList();
    }

    // Funciones globales para los clics internos de la lista
    window.toggleItem = (index) => {
        items[index].completed = !items[index].completed;
        saveToLocalStorage();
        renderList();
    };

    window.deleteItem = (index) => {
        items.splice(index, 1);
        saveToLocalStorage();
        renderList();
    };

    // Eventos
    addBtn.addEventListener('click', addItem);
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });

    // Renderizar la lista inicialmente si hay datos
    renderList();
});

// 1. Registrar el Service Worker (Obligatorio para que sea instalable)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker listo.'))
            .catch(err => console.error('Error en Service Worker:', err));
    });
}

// 2. Lógica para lanzar la instalación automática al abrir la web
window.addEventListener('beforeinstallprompt', async (e) => {
    // Evita que el navegador gestione el banner a su propio ritmo
    e.preventDefault();
    
    // Guarda el evento de instalación
    const deferredPrompt = e;
    
    // Pequeña pausa de 1.5 segundos para dejar que la página cargue visualmente primero
    setTimeout(async () => {
        // Muestra la ventana flotante nativa del sistema (Chrome, Edge, Android)
        deferredPrompt.prompt();
        
        // Comprueba si el usuario aceptó o rechazó la instalación
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`El usuario eligió: ${outcome}`);
    }, 1500); 
});
