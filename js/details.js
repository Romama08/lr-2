document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const eventId = parseInt(params.get('id'));

    if (!eventId) {
        const titleEl = document.getElementById('det-title');
        if (titleEl) titleEl.textContent = "Помилка: Подію не вибрано";
        return;
    }

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
                document.getElementById('det-title').textContent = "Подію не знайдено";
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
        });
});

function renderEventDetails(event) {
    document.getElementById('det-title').textContent = event.title;
    document.getElementById('det-image').src = `images/${event.image}`;
    document.getElementById('det-image').alt = event.title;
    document.getElementById('det-date').textContent = event.date;
    document.getElementById('det-location').textContent = event.location;
    document.getElementById('det-price').textContent = event.price;

    const descEl = document.getElementById('det-description');
    if (descEl) {
        descEl.textContent = event.description || "Опис цієї події з'явиться незабаром.";
    }

    // Початковий розрахунок вартості для 1 квитка
    const totalPriceDisplay = document.getElementById('total-price-display');
    if (totalPriceDisplay) {
        totalPriceDisplay.textContent = event.price;
    }
}

function setupBookingLogic(event) {
    const buyBtn = document.getElementById('buy-ticket-btn');
    const checkoutSection = document.getElementById('checkout-section');
    const confirmBtn = document.getElementById('confirm-booking-btn');
    const quantityInput = document.getElementById('ticket-quantity');
    const totalPriceDisplay = document.getElementById('total-price-display');
    const msg = document.getElementById('details-form-msg');
    
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');

    // Отримуємо чисте число з ціни (наприклад, з "500 грн" отримаємо 500)
    const unitPrice = parseInt(event.price.toString().replace(/\D/g, ''));

    // === РЕАЛІЗАЦІЯ ПІДРАХУНКУ ВАРТОСТІ ===
    if (quantityInput && totalPriceDisplay) {
        quantityInput.addEventListener('input', () => {
            let qty = parseInt(quantityInput.value);
            if (qty < 1 || isNaN(qty)) qty = 1;
            
            const total = qty * unitPrice;
            totalPriceDisplay.textContent = `${total} грн`;
        });
    }

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
        const qty = parseInt(quantityInput.value) || 1;

        if (name === "" || !email.includes("@")) {
            msg.textContent = "⚠ Введіть коректні дані!";
            msg.style.color = "red";
            return;
        }

        // === ДОДАВАННЯ В "МОЇ БРОНЮВАННЯ" ===
        const newBooking = {
            id: Date.now(),
            title: event.title,
            date: event.date,
            location: event.location,
            userName: name,
            quantity: qty,
            totalPrice: qty * unitPrice,
            status: "Заброньовано"
        };

        let bookings = JSON.parse(localStorage.getItem('userBookings')) || [];
        bookings.push(newBooking);
        localStorage.setItem('userBookings', JSON.stringify(bookings));

        // === ЗМІНА СТАТУСУ КНОПКИ ===
        msg.textContent = `✅ Успішно заброньовано (${qty} квит.)`;
        msg.style.color = "green";
        
        confirmBtn.textContent = "Заброньовано";
        confirmBtn.disabled = true;
        confirmBtn.style.backgroundColor = "#6c757d"; 
        confirmBtn.style.cursor = "default";

        setTimeout(() => {
            if (msg) msg.textContent = "";
        }, 5000);
    };
}
