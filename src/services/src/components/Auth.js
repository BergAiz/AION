// AION - Компонент аутентификации (регистрация/вход)
class AuthComponent {
    constructor() {
        this.isLoginMode = true;
    }

    // Создание формы аутентификации
    create() {
        const container = document.createElement('div');
        container.className = 'auth-container';
        container.innerHTML = this.getAuthHTML();
        
        this.addEventListeners(container);
        return container;
    }

    // HTML для формы
    getAuthHTML() {
        return `
            <div class="auth-modal">
                <div class="auth-header">
                    <h2>🎯 AION</h2>
                    <p>${this.isLoginMode ? 'Вход в аккаунт' : 'Создание аккаунта'}</p>
                </div>

                <form class="auth-form" id="authForm">
                    ${!this.isLoginMode ? `
                        <div class="form-group">
                            <input type="text" id="name" placeholder="Ваше имя" required>
                        </div>
                        <div class="form-group">
                            <input type="number" id="age" placeholder="Возраст" min="18" max="100" required>
                        </div>
                    ` : ''}

                    <div class="form-group">
                        <input type="email" id="email" placeholder="Email" required>
                    </div>

                    <div class="form-group">
                        <input type="password" id="password" placeholder="Пароль" required>
                    </div>

                    ${!this.isLoginMode ? `
                        <div class="form-group">
                            <textarea id="bio" placeholder="Расскажите о себе..." rows="3"></textarea>
                        </div>
                    ` : ''}

                    <button type="submit" class="auth-btn">
                        ${this.isLoginMode ? 'Войти' : 'Создать аккаунт'}
                    </button>
                </form>

                <div class="auth-switch">
                    ${this.isLoginMode ? 
                        'Нет аккаунта? <a href="#" id="switchToRegister">Зарегистрироваться</a>' : 
                        'Уже есть аккаунт? <a href="#" id="switchToLogin">Войти</a>'
                    }
                </div>

                <div class="auth-features">
                    <h4>Возможности AION:</h4>
                    <ul>
                        <li>🤖 AI-помощник в переписке</li>
                        <li>🎴 Умные карточки с параллаксом</li>
                        <li>⚡ Мгновенные знакомства</li>
                        <li>🛡️ Безопасная модерация</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Добавление обработчиков событий
    addEventListeners(container) {
        // Переключение между входом и регистрацией
        container.querySelector('#switchToRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.isLoginMode = false;
            this.render(container);
        });

        container.querySelector('#switchToLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.isLoginMode = true;
            this.render(container);
        });

        // Обработка отправки формы
        container.querySelector('#authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(container);
        });
    }

    // Обработка отправки формы
    handleSubmit(container) {
        const formData = new FormData(container.querySelector('#authForm'));
        
        if (this.isLoginMode) {
            this.handleLogin(formData);
        } else {
            this.handleRegister(formData);
        }
    }

    // Обработка входа
    handleLogin(formData) {
        const email = formData.get('email');
        const password = formData.get('password');

        const user = userService.login(email, password);
        
        if (user) {
            if (user.banned) {
                this.showError(`Аккаунт заблокирован: ${user.banReason}`);
                return;
            }
            this.onAuthSuccess(user);
        } else {
            this.showError('Неверный email или пароль');
        }
    }

    // Обработка регистрации
    handleRegister(formData) {
        const userData = {
            name: formData.get('name'),
            age: parseInt(formData.get('age')),
            email: formData.get('email'),
            password: formData.get('password'),
            bio: formData.get('bio') || 'Новый пользователь AION'
        };

        // Валидация
        if (userData.age < 18) {
            this.showError('Минимальный возраст - 18 лет');
            return;
        }

        // Проверка email
        const existingUser = userService.users.find(u => u.email === userData.email);
        if (existingUser) {
            this.showError('Пользователь с таким email уже существует');
            return;
        }

        // Модерация био
        const moderationResult = userService.moderateText(userData.bio);
        if (!moderationResult.isClean) {
            this.showError(`Недопустимое описание: ${moderationResult.warning}`);
            return;
        }

        const user = userService.register(userData);
        this.onAuthSuccess(user);
    }

    // Успешная аутентификация
    onAuthSuccess(user) {
        console.log('✅ Успешная аутентификация:', user.name);
        
        // Скрываем auth компонент и показываем основное приложение
        document.querySelector('.auth-container').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        // Инициализируем карточки
        cardManager.init();
    }

    // Показ ошибок
    showError(message) {
        // Удаляем старые ошибки
        const oldError = document.querySelector('.auth-error');
        if (oldError) oldError.remove();

        // Создаем новое сообщение об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.innerHTML = `❌ ${message}`;
        errorDiv.style.cssText = `
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.5);
            color: #fecaca;
            padding: 12px;
            border-radius: 8px;
            margin: 15px 0;
            text-align: center;
        `;

        const form = document.querySelector('.auth-form');
        form.parentNode.insertBefore(errorDiv, form);
    }

    // Обновление компонента
    render(container) {
        container.innerHTML = this.getAuthHTML();
        this.addEventListeners(container);
    }
}

// Глобальный экземпляр компонента аутентификации
const authComponent = new AuthComponent();
