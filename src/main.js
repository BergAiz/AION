// AION - Основной JavaScript файл
console.log('🚀 AION App запущен!');

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM готов к работе');
    
    // Инициализируем менеджер карточек
    cardManager.init();
    
    // Добавляем глобальные обработчики для свайпа вверх
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

// Обработка свайпа вверх (отложить)
function handleSwipeUp() {
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

// Глобальные функции для тестирования
window.testAddCards = function() {
    cardManager.loadSampleUsers();
    cardManager.currentCardIndex = 0;
    cardManager.renderCurrentCard();
};

window.showStats = function() {
    alert(`Статистика:\nЛайков: ${cardManager.stats.likesToday}\nПросмотрено: ${cardManager.stats.viewed}`);
};
