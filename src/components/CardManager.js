// AION - Менеджер карточек и система свайпов
class CardManager {
    constructor() {
        this.cards = [];
        this.currentCardIndex = 0;
        this.stats = {
            likesToday: 0,
            viewed: 0
        };
    }

    // Инициализация менеджера
    init() {
        this.loadSampleUsers();
        this.renderCurrentCard();
        this.updateStats();
    }

    // Загрузка тестовых пользователей
    loadSampleUsers() {
        const sampleUsers = [
            {
                id: 1,
                name: "Анна",
                age: 25,
                bio: "Люблю путешествия и фотографию. Ищу серьезные отношения.",
                photos: []
            },
            {
                id: 2, 
                name: "Максим",
                age: 28,
                bio: "Программист, увлекаюсь спортом и научной фантастикой.",
                photos: []
            },
            {
                id: 3,
                name: "София", 
                age: 23,
                bio: "Студентка, обожаю искусство и кофе.",
                photos: []
            },
            {
                id: 4,
                name: "Дмитрий",
                age: 30, 
                bio: "Предприниматель, ищу умную и целеустремленную девушку.",
                photos: []
            }
        ];

        this.cards = sampleUsers.map(user => new AionCard(user));
    }

    // Отображение текущей карточки
    renderCurrentCard() {
        const container = document.getElementById('cards-container');
        
        if (this.currentCardIndex >= this.cards.length) {
            container.innerHTML = `
                <div class="no-cards">
                    <h3>🎉 На сегодня всё!</h3>
                    <p>Завтра появятся новые анкеты</p>
                    <button onclick="location.reload()">Обновить</button>
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        const cardElement = this.cards[this.currentCardIndex].create();
        container.appendChild(cardElement);
        
        this.addSwipeListeners(cardElement);
        this.stats.viewed++;
        this.updateStats();
    }

    // Добавление обработчиков свайпов
    addSwipeListeners(cardElement) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        cardElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            cardElement.style.transition = 'none';
        });

        cardElement.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            currentX = e.clientX - startX;
            const rotate = currentX * 0.1;
            
            cardElement.style.transform = `
                translateX(${currentX}px) 
                rotate(${rotate}deg)
            `;
            
            // Изменение цвета при свайпе
            if (currentX > 50) {
                cardElement.style.background = 'rgba(72, 187, 120, 0.3)';
            } else if (currentX < -50) {
                cardElement.style.background = 'rgba(239, 68, 68, 0.3)';
            }
        });

        cardElement.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            
            cardElement.style.transition = 'all 0.3s ease';
            
            if (currentX > 100) {
                this.handleSwipe('like');
            } else if (currentX < -100) {
                this.handleSwipe('dislike');
            } else {
                // Возврат на место
                cardElement.style.transform = 'translateX(0) rotate(0)';
                cardElement.style.background = 'rgba(255, 255, 255, 0.15)';
            }
        });

        // Обработчики для кнопок
        cardElement.querySelector('.btn-like').addEventListener('click', () => {
            this.handleSwipe('like');
        });

        cardElement.querySelector('.btn-dislike').addEventListener('click', () => {
            this.handleSwipe('dislike');
        });

        cardElement.querySelector('.btn-super-like').addEventListener('click', () => {
            this.handleSwipe('super-like');
        });
    }

    // Обработка свайпа
    handleSwipe(action) {
        const cardElement = document.querySelector('.aion-card');
        
        if (action === 'like') {
            cardElement.style.transform = 'translateX(500px) rotate(30deg)';
            this.stats.likesToday++;
            console.log('❤️ Лайк:', this.cards[this.currentCardIndex].user.name);
        } else if (action === 'dislike') {
            cardElement.style.transform = 'translateX(-500px) rotate(-30deg)';
            console.log('👎 Дизлайк:', this.cards[this.currentCardIndex].user.name);
        } else if (action === 'super-like') {
            cardElement.style.transform = 'translateY(-500px)';
            console.log('⭐ Суперлайк:', this.cards[this.currentCardIndex].user.name);
        }

        setTimeout(() => {
            this.currentCardIndex++;
            this.renderCurrentCard();
        }, 300);
    }

    // Обновление статистики
    updateStats() {
        document.querySelectorAll('.stat-number')[0].textContent = this.stats.likesToday;
        document.querySelectorAll('.stat-number')[1].textContent = this.stats.viewed;
    }
}

// Глобальный экземпляр менеджера
const cardManager = new CardManager();
