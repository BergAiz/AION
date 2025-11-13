// AION - Основной JavaScript файл
console.log('🚀 AION App запущен!');

// Базовая инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM готов к работе');
    
    // Здесь будет логика параллакс-карточек
    const app = document.getElementById('app');
    
    // Временный контент для теста
    app.innerHTML = `
        <div class="container">
            <h1>🎯 AION</h1>
            <p>Инновационное dating-приложение</p>
            <div style="margin-top: 30px;">
                <button onclick="showTestCard()" style="
                    background: #8b5cf6; 
                    color: white; 
                    border: none; 
                    padding: 15px 30px; 
                    border-radius: 10px; 
                    font-size: 16px;
                    cursor: pointer;
                ">Тест карточки</button>
            </div>
        </div>
    `;
});

// Тестовая функция для карточки
function showTestCard() {
    alert('Система карточек будет реализована следующей! 🎴');
}
