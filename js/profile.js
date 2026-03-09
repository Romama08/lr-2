document.addEventListener('DOMContentLoaded', () => {
    renderBookings();
});

/**
 * Функція для відображення історії бронювань користувача
 */
function renderBookings() {
    const container = document.getElementById('bookings-history');
    if (!container) return;

    // Отримуємо масив бронювань з локального сховища
    const bookings = JSON.parse(localStorage.getItem('userBookings')) || [];

    // Перевірка на наявність записів
    if (bookings.length === 0) {
        container.innerHTML = '<p class="empty-msg">У вас ще немає активних бронювань.</p>';
        return;
    }

    container.innerHTML = ''; 

    // Проходимо по кожному бронюванню та створюємо картку
    bookings.forEach((item) => {
        const card = document.createElement('div');
        card.className = 'booking-card';
        
        card.innerHTML = `
            <div class="booking-details">
                <span class="booking-title">${item.title}</span>
                <span class="booking-meta">${item.location} • ${item.date}</span>
                <div style="margin-top: 5px; font-size: 0.85rem; color: #555;">
                    <p>Кількість квитків: <strong>${item.quantity || 1}</strong></p>
                    <p>Сума до сплати: <strong>${item.totalPrice ? item.totalPrice + ' грн' : 'Уточнюється'}</strong></p>
                    <small>Замовник: ${item.userName}</small>
                </div>
            </div>
            <div class="booking-status" style="display: flex; flex-direction: column; align-items: flex-end; justify-content: center; gap: 8px;">
                <span class="badge success" style="margin: 0; background-color: #838a1e; color: white; padding: 4px 8px; border-radius: 4px;">
                    ${item.status}
                </span>
                <button class="cancel-btn" onclick="deleteBooking(${item.id})" 
                        style="margin: 0; padding: 6px 12px; font-size: 0.8rem; background: #f4f4f4; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
                    Скасувати
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

/**
 * Функція видалення конкретного квитка за ID
 * Використовує фільтрацію масиву
 */
window.deleteBooking = function(idToDelete) {
    if (confirm("Ви впевнені, що хочете видалити це бронювання?")) {
        let bookings = JSON.parse(localStorage.getItem('userBookings')) || [];

        const updatedBookings = bookings.filter(b => b.id !== idToDelete);

        localStorage.setItem('userBookings', JSON.stringify(updatedBookings));

        renderBookings();
    }
};
