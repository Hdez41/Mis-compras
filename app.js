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
// 🟢 AQUÍ ESTÁ EL NUEVO CÓDIGO AUTOMÁTICO (Service Worker e Instalación al Primer Toque)
// =========================================================================

// Asegúrate de que este bloque exacto esté al final de tu app.js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/Mis-compras/sw.js')
            .then(() => console.log('Service Worker de Compras activo.'))
            .catch(err => console.error('Error de registro:', err));
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    const launchAutomaticPrompt = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Instalación automática: ${outcome}`);
        deferredPrompt = null;
        document.removeEventListener('click', launchAutomaticPrompt);
    };

    document.addEventListener('click', launchAutomaticPrompt);
});
