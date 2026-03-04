document.addEventListener('DOMContentLoaded', () => {
    // 1. Отримуємо ID події з URL
    const params = new URLSearchParams(window.location.search);
    const eventId = parseInt(params.get('id'));

    if (!eventId) {
        console.error("ID події не знайдено в URL");
        const titleEl = document.getElementById('det-title');
        if (titleEl) titleEl.textContent = "Помилка: Подію не вибрано";
        return;
    }

    // 2. Завантажуємо дані з JSON
    fetch('data/events.json')
        .then(response => {
            if (!response.ok) throw new Error("Помилка завантаження файлу JSON");
            return response.json();
        })
        .then(events => {
            const event = events.find(e => e.id === eventId);

            if (event) {
                renderEventDetails(event);
                setupBookingLogic(event);
            } else {
                document.getElementById('det-title').textContent = "Подію не знайдено в базі";
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            const titleEl = document.getElementById('det-title');
            if (titleEl) titleEl.textContent = "Сервіс тимчасово недоступний";
        });
});

/**
 * Функція для виводу даних події в HTML
 */
function renderEventDetails(event) {
    document.getElementById('det-title').textContent = event.title;
    
    // ВИПРАВЛЕНО: додаємо шлях до папки images перед назвою файлу
    document.getElementById('det-image').src = `images/${event.image}`;
    
    document.getElementById('det-image').alt = event.title;
    document.getElementById('det-date').textContent = event.date;
    document.getElementById('det-location').textContent = event.location;
    document.getElementById('det-price').textContent = event.price;

    const descEl = document.getElementById('det-description');
    if (descEl) {
        descEl.textContent = event.description || "Опис цієї події з'явиться незабаром.";
    }
}

/**
 * Логіка показу форми та багаторазового бронювання
 */
function setupBookingLogic(event) {
    const buyBtn = document.getElementById('buy-ticket-btn');
    const checkoutSection = document.getElementById('checkout-section');
    const confirmBtn = document.getElementById('confirm-booking-btn');
    const msg = document.getElementById('details-form-msg');

    // Поля вводу
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');

    // При натисканні "Купити" показуємо форму
    if (buyBtn && checkoutSection) {
        buyBtn.addEventListener('click', () => {
            checkoutSection.style.display = 'block';
            buyBtn.style.display = 'none';
            checkoutSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (!confirmBtn) return;

    confirmBtn.onclick = () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        // Валідація
        if (name === "" || !email.includes("@") || !email.includes(".")) {
            msg.textContent = "⚠ Будь ласка, введіть коректне ім'я та Email!";
            msg.style.color = "red";
            return;
        }

        // 3. ГЕНЕРУЄМО УНІКАЛЬНЕ БРОНЮВАННЯ
        // Використовуємо Date.now() + Math.random() для 100% унікальності ID
        const newBooking = {
            id: Date.now() + Math.floor(Math.random() * 1000), 
            title: event.title,
            date: event.date,
            location: event.location,
            userName: name,
            status: "Оплачено"
        };

        // Отримуємо існуючі та додаємо нове
        let bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
        bookings.push(newBooking);
        localStorage.setItem('userBookings', JSON.stringify(bookings));

        // 4. ВІЗУАЛЬНИЙ ЕФЕКТ УСПІХУ (БЕЗ БЛОКУВАННЯ)
        msg.textContent = `✅ Квиток для ${name} успішно заброньовано!`;
        msg.style.color = "green";

        // Очищаємо поля для наступного замовлення
        nameInput.value = "";
        emailInput.value = "";

        // Тимчасова анімація кнопки
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = "Готово! Додати ще?";
        confirmBtn.style.backgroundColor = "#28a745"; // Зелений

        setTimeout(() => {
            confirmBtn.textContent = originalText;
            confirmBtn.style.backgroundColor = ""; // Повертаємо початковий стиль
            msg.textContent = ""; // Прибираємо повідомлення через 5 сек
        }, 4000);
    };
}
