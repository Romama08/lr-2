document.addEventListener('DOMContentLoaded', () => {
    renderBookings();
});

function renderBookings() {
    const container = document.getElementById('bookings-history');
    const bookings = JSON.parse(localStorage.getItem('userBookings')) || [];

    if (bookings.length === 0) {
        container.innerHTML = '<p class="empty-msg">У вас ще немає активних бронювань.</p>';
        return;
    }

    container.innerHTML = ''; 

    bookings.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'booking-card';
        
        card.innerHTML = `
    <div class="booking-details">
        <span class="booking-title">${item.title}</span>
        <span class="booking-meta">${item.location} • ${item.date}</span>
        <small>Замовник: ${item.userName}</small>
    </div>
    <div class="booking-status" style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 8px;">
        <span class="badge success" style="margin: 0;">${item.status}</span>
        <button class="cancel-btn" onclick="deleteBooking(${item.id})" style="margin: 0; padding: 4px 12px; font-size: 0.8rem;">Скасувати</button>
    </div>
`;
        container.appendChild(card);
    });
}

// Функція видалення конкретного елемента
window.deleteBooking = function(idToDelete) {
    if (confirm("Ви впевнені, що хочете видалити цей квиток?")) {
        let bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
        
        // Фільтруємо так, щоб залишилися ВСІ, крім того, чий ID збігається
        const updatedBookings = bookings.filter(b => b.id !== idToDelete);
        
        // Оновлюємо базу даних браузера
        localStorage.setItem('userBookings', JSON.stringify(updatedBookings));
        
        // Перемальовуємо список
        renderBookings();
    }
};