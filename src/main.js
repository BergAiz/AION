// AION - Основной JavaScript файл для dating-приложения
console.log('🚀 AION Dating App запущен!');

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM готов к работе');
    
    // Проверяем авторизован ли пользователь
    const currentUser = userService.getCurrentUser();
    
    if (currentUser) {
        // Пользователь уже авторизован - показываем основное приложение
        document.getElementById('app').style.display = 'block';
        cardManager.init();
        console.log('👤 Авторизован:', currentUser.name);
    } else {
        // Показываем форму аутентификации
        showAuthForm();
    }
    
    // Добавляем глобальные обработчики для свайпа вверх (отложить)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowUp') {
            handleSwipeUp();
        }
    });
    
    // Обработчик свайпа вверх на телефоне
    let startY = 0;
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        const endY = e.changedTouches[0].clientY;
        const diff = startY - endY;
        
        if (diff > 50) { // Свайп вверх
            handleSwipeUp();
        }
    });
});

// Показать форму аутентификации
function showAuthForm() {
    const app = document.getElementById('app');
    app.style.display = 'none'; // Скрываем основное приложение
    
    const authContainer = authComponent.create();
    document.body.appendChild(authContainer);
}

// Обработка свайпа вверх (отложить)
function handleSwipeUp() {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) return;
    
    const currentCard = document.querySelector('.aion-card');
    if (currentCard) {
        currentCard.style.transform = 'translateY(-500px) rotate(0deg)';
        currentCard.style.background = 'rgba(96, 165, 250, 0.3)';
        
        setTimeout(() => {
            cardManager.currentCardIndex++;
            cardManager.renderCurrentCard();
            console.log('⏸️ Отложено на потом');
        }, 300);
    }
}

// Выход из аккаунта
function logout() {
    userService.logout();
    location.reload(); // Перезагружаем страницу для показа формы входа
}

// Глобальные функции для тестирования
window.testAddCards = function() {
    // Добавляем тестовых пользователей если их нет
    if (cardManager.cards.length === 0) {
        cardManager.loadVisibleUsers();
    }
    cardManager.currentCardIndex = 0;
    cardManager.renderCurrentCard();
};

window.showStats = function() {
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
        alert(`Статистика:\nЛайков сегодня: ${currentUser.likesToday}/50\nИмя: ${currentUser.name}\nПолучено лайков: ${currentUser.likesReceivedToday || 0}`);
    } else {
        alert('Сначала войдите в аккаунт');
    }
};

window.openChat = function(partner) {
    chatDemo.show(partner);
};

window.logout = logout;

// Инициализация AI помощника
window.aiAssistant = new AIAssistant();

// Глобальные экземпляры компонентов
window.cardManager = new CardManager();
window.authComponent = new AuthComponent(); 
window.chatDemo = new ChatDemo();
window.userService = new UserService();
