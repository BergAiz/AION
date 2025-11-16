// AION - Модуль карточек и свайпов
class CardsManager {
    constructor() {
        this.cards = [];
        this.currentCardIndex = 0;
        this.currentCard = null;
        this.userService = new UserService();
    }

    init(currentUser) {
        this.currentUser = currentUser;
        this.loadVisibleUsers();
        this.renderCurrentCard();
        this.updateStats();
    }

    loadVisibleUsers() {
        // Тестовые пользователи
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

        this.cards = sampleUsers
            .filter(user => user.id.toString() !== this.currentUser.id)
            .map(user => new AionCard(user));

        console.log(`👥 Загружено карточек: ${this.cards.length}`);
    }

    renderCurrentCard() {
        const container = document.getElementById('cards-stack');
        const noCards = document.getElementById('no-cards');

        if (this.currentCardIndex >= this.cards.length) {
            container.innerHTML = '';
            noCards.style.display = 'block';
            return;
        }

        noCards.style.display = 'none';
        container.innerHTML = '';
        
        this.currentCard = this.cards[this.currentCardIndex];
        const cardElement = this.currentCard.create();
        container.appendChild(cardElement);
        
        this.updateStats();
    }

    handleSwipe(direction) {
        if (!this.currentCard) return;

        const cardElement = document.querySelector('.aion-card');
        
        switch (direction) {
            case 'right':
                this.swipeLike(cardElement);
                break;
            case 'left':
                this.swipeDislike(cardElement);
                break;
            case 'up':
                this.swipeSuperLike(cardElement);
                break;
        }

        setTimeout(() => {
            this.currentCardIndex++;
            this.renderCurrentCard();
        }, 300);
    }

    swipeLike(cardElement) {
        cardElement.style.transform = 'translateX(500px) rotate(30deg)';
        this.userService.incrementLikes(this.currentUser.id);
        console.log('❤️ Лайк:', this.currentCard.user.name);
        
        // Показываем чат при мэтче (случайно)
        if (Math.random() > 0.7) {
            setTimeout(() => {
                this.openChat(this.currentCard.user);
            }, 500);
        }
    }

    swipeDislike(cardElement) {
        cardElement.style.transform = 'translateX(-500px) rotate(-30deg)';
        console.log('👎 Дизлайк:', this.currentCard.user.name);
    }

    swipeSuperLike(cardElement) {
        cardElement.style.transform = 'translateY(-500px) scale(1.1)';
        console.log('⭐ Суперлайк:', this.currentCard.user.name);
        
        // Всегда показываем чат для суперлайка
        setTimeout(() => {
            this.openChat(this.currentCard.user);
        }, 500);
    }

    openChat(partner) {
        if (window.chatManager) {
            chatManager.openChat(partner);
            aionApp.showScreen('chat-screen');
        }
    }

    updateStats() {
        const likesCount = document.getElementById('likes-count');
        if (likesCount && this.currentUser) {
            likesCount.textContent = this.currentUser.likesToday || 0;
        }
    }
}

// Класс карточки
class AionCard {
    constructor(user) {
        this.user = user;
        this.element = null;
    }

    create() {
        const card = document.createElement('div');
        card.className = 'aion-card';
        
        // Случайный цвет для аватара
        const colors = [
            'linear-gradient(135deg, #667eea, #764ba2)',
            'linear-gradient(135deg, #f093fb, #f5576c)',
            'linear-gradient(135deg, #4facfe, #00f2fe)',
            'linear-gradient(135deg, #43e97b, #38f9d7)'
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        card.innerHTML = `
            <div class="card-content">
                <div class="user-photo" style="background: ${randomColor}">
                    <div class="photo-placeholder">${this.user.name.charAt(0)}</div>
                </div>
                <div class="user-info">
                    <h3>${this.user.name}, ${this.user.age}</h3>
                    <p>${this.user.bio}</p>
                </div>
            </div>
        `;

        this.element = card;
        return card;
    }
}

// Сервис пользователей
class UserService {
    incrementLikes(userId) {
        const users = JSON.parse(localStorage.getItem('aion_users')) || [];
        const user = users.find(u => u.id === userId);
        if (user) {
            user.likesToday = (user.likesToday || 0) + 1;
            localStorage.setItem('aion_users', JSON.stringify(users));
        }
    }
}

// Глобальный экземпляр менеджера карточек
const cardsManager = new CardsManager();
