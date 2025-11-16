// AION Mobile App - Основной файл
class AionApp {
    constructor() {
        this.currentScreen = 'splash-screen';
        this.init();
    }

    init() {
        console.log('🚀 AION Mobile App инициализирован');
        
        // Регистрируем Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker зарегистрирован:', registration);
                })
                .catch(error => {
                    console.log('❌ Ошибка Service Worker:', error);
                });
        }

        // Показываем сплеш-скрин на 2 секунды
        setTimeout(() => {
            this.checkAuth();
        }, 2000);

        // Добавляем обработчики жестов
        this.addSwipeListeners();
    }

// В файле js/app.js НАЙДИТЕ функцию checkAuth и ЗАМЕНИТЕ её на:

checkAuth() {
    console.log('🔐 Проверка авторизации...');
    const currentUser = this.getCurrentUser();
    console.log('👤 Текущий пользователь:', currentUser);
    
    if (currentUser && currentUser.name) {
        console.log('✅ Пользователь авторизован:', currentUser.name);
        this.showScreen('main-screen');
        if (window.cardsManager) {
            cardsManager.init(currentUser);
        }
    } else {
        console.log('❌ Пользователь не авторизован');
        this.showScreen('auth-screen');
    }
}

    showScreen(screenId) {
        // Скрываем все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Показываем нужный экран
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
        
        console.log('📱 Переключен экран:', screenId);
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('aion_current_user'));
    }

    setCurrentUser(user) {
        localStorage.setItem('aion_current_user', JSON.stringify(user));
    }

    logout() {
        localStorage.removeItem('aion_current_user');
        this.showScreen('auth-screen');
    }

    addSwipeListeners() {
        let startX, startY;
        const cardContainer = document.getElementById('cards-stack');

        cardContainer.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        cardContainer.addEventListener('touchend', e => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = endX - startX;
            const diffY = endY - startY;

            // Определяем направление свайпа
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX > 50) {
                    this.swipeCard('right');
                } else if (diffX < -50) {
                    this.swipeCard('left');
                }
            } else {
                if (diffY < -50) {
                    this.swipeCard('up');
                }
            }

            startX = startY = null;
        });
    }

    swipeCard(direction) {
        if (cardsManager.currentCard) {
            cardsManager.handleSwipe(direction);
        }
    }
}

// Глобальный экземпляр приложения
const aionApp = new AionApp();

// Глобальные функции для кнопок
function showScreen(screenId) {
    aionApp.showScreen(screenId);
}

function swipeCard(direction) {
    aionApp.swipeCard(direction);
}
