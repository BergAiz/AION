// AION - Основной JavaScript файл для dating-приложения
console.log('🚀 AION Dating App запущен!');

// Создаем глобальные экземпляры ДО загрузки DOM
window.userService = new UserService();
window.cardManager = new CardManager();
window.authComponent = new AuthComponent();
window.chatDemo = new ChatDemo();
window.aiAssistant = new AIAssistant();

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM готов к работе');
    
    // Проверяем авторизован ли пользователь
    const currentUser = userService.getCurrentUser();
    console.log('👤 Текущий пользователь:', currentUser);
    
    if (currentUser) {
        // Пользователь уже авторизован - показываем основное приложение
        document.getElementById('app').style.display = 'block';
        cardManager.init();
        console.log('✅ Авторизован:', currentUser.name);
    } else {
        // Показываем форму аутентификации
        console.log('🔄 Показываем форму аутентификации');
        showAuthForm();
    }
});

// Показать форму аутентификации
function showAuthForm() {
    const app = document.getElementById('app');
    app.style.display = 'none'; // Скрываем основное приложение
    
    const authContainer = authComponent.create();
    document.body.appendChild(authContainer);
    console.log('✅ Форма аутентификации создана');
}

// Глобальные функции для тестирования
window.testApp = function() {
    console.log('🧪 Тестирование приложения');
    const currentUser = userService.getCurrentUser();
    if (currentUser) {
        alert(`Тест: Авторизован ${currentUser.name}`);
    } else {
        alert('Тест: Не авторизован');
    }
};

console.log('🎯 AION инициализирован, ждем загрузки DOM...');
