document.addEventListener('DOMContentLoaded', () => {
    // === ЕЛЕМЕНТИ DOM ===
    const eventsContainer = document.getElementById('events-container');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const resetBtn = document.getElementById('reset-filters');
    const aboutSection = document.getElementById('about-content');

    let allEvents = []; 

    // === ЗАВАНТАЖЕННЯ ДАНИХ ===
    fetch('data/events.json')
        .then(response => {
            if (!response.ok) throw new Error("Помилка завантаження JSON");
            return response.json();
        })
        .then(data => {
            allEvents = data;
            renderEvents(allEvents); // Початкове виведення всіх подій
            setupInteractivity();    // Налаштування кнопок та меню
            setupFilters();          // Налаштування логіки фільтрів
        })
        .catch(error => {
            console.error('Помилка завантаження:', error);
            if (eventsContainer) {
                eventsContainer.innerHTML = "<p style='text-align:center;'>Не вдалося завантажити події. Спробуйте пізніше.</p>";
            }
        });

    // === ФУНКЦІЯ ВИВОДУ КАРТОК ===
    function renderEvents(events) {
        if (!eventsContainer) return;
        eventsContainer.innerHTML = '';

        if (events.length === 0) {
            eventsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; font-size: 1.2rem;">Нічого не знайдено за вашим запитом 😕</p>';
            return;
        }

        // Отримуємо поточну дату для порівняння 
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let i = 0;
        let renderedCount = 0;

        // === ВИКОРИСТАННЯ WHILE ===
        while (i < events.length) {
            const event = events[i];
            const eventDate = new Date(event.date); // Припускаємо формат YYYY-MM-DD у JSON

            // Відображаємо лише МАЙБУТНІ події 
            if (eventDate >= today) {
                const card = document.createElement('article');
                card.className = 'event-card';

                const imgPath = `images/${event.image}`; 

                let priceClass = "price-normal";
                let badge = "";
                const priceNum = parseInt(event.price.toString().replace(/\D/g, ''));

                if (priceNum >= 1000) {
                    priceClass = "price-premium";
                    badge = '<span class="badge-vip" style="background: #e63946; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; margin-left: 10px; vertical-align: middle;">VIP</span>';
                }

                card.innerHTML = `
                    <img src="${imgPath}" alt="${event.title}">
                    <div class="event-content">
                        <h3>${event.title}</h3>
                        <p><strong>Дата:</strong> ${event.date}</p>
                        <p><strong>Місце:</strong> ${event.location}</p>
                        <p class="price" style="font-size: 1.1rem; font-weight: bold; margin-top: 10px;">
                            Ціна: <span class="${priceClass}">${event.price}</span> ${badge}
                        </p>
                        <p style="color: #838a1e; font-size: 0.9rem; margin-top: 15px; font-weight: bold;">Детальніше →</p>
                    </div>
                `;

                // Оформлення рамок (використовуємо renderedCount для чергування)
                card.style.borderBottom = (renderedCount % 2 === 0) ? "4px solid #838a1e" : "4px solid #fbbf24";

                card.addEventListener('click', () => {
                    window.location.href = `event-details.html?id=${event.id}`;
                });

                eventsContainer.appendChild(card);
                renderedCount++;
            }
            i++; 
        }

        if (renderedCount === 0 && events.length > 0) {
            eventsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">На жаль, усі події вже відбулися. Слідкуйте за оновленнями!</p>';
        }
    }

    // === НАЛАШТУВАННЯ ФІЛЬТРІВ ===
    function setupFilters() {
        if (!categoryFilter || !priceFilter) return;

        const handleFilter = () => {
            const category = categoryFilter.value;
            const priceRange = priceFilter.value;

            const filtered = allEvents.filter(event => {
                const matchCategory = (category === 'all' || event.category === category);
                const priceNum = parseInt(event.price.toString().replace(/\D/g, ''));
                let matchPrice = true;
                
                if (priceRange === 'low') matchPrice = priceNum < 500;
                else if (priceRange === 'medium') matchPrice = priceNum >= 500 && priceNum <= 1000;
                else if (priceRange === 'high') matchPrice = priceNum > 1000;

                return matchCategory && matchPrice;
            });

            renderEvents(filtered);
        };

        categoryFilter.addEventListener('change', handleFilter);
        priceFilter.addEventListener('change', handleFilter);

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                categoryFilter.value = 'all';
                priceFilter.value = 'all';
                renderEvents(allEvents);
            });
        }
    }

    // === ІНТЕРАКТИВНІСТЬ ===
    function setupInteractivity() {
        if (aboutSection) {
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = "Приховати опис";
            toggleBtn.className = "reset-btn"; 
            toggleBtn.style.margin = "20px auto";
            toggleBtn.style.display = "block";
            
            aboutSection.parentNode.insertBefore(toggleBtn, aboutSection);

            toggleBtn.onclick = function() {
                if (aboutSection.style.display === "none") {
                    aboutSection.style.display = "block";
                    this.textContent = "Приховати опис";
                } else {
                    aboutSection.style.display = "none";
                    this.textContent = "Показати опис";
                }
            };
        }

    }
});
