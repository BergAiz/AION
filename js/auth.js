// AION - Модуль аутентификации (ИСПРАВЛЕННАЯ ВЕРСИЯ)
class AuthManager {
    constructor() {
        this.users = this.loadUsers();
        this.initAuthForm();
    }

    loadUsers() {
        const users = localStorage.getItem('aion_users');
        console.log('📁 Загружены пользователи:', users);
        return users ? JSON.parse(users) : [];
    }

    saveUsers() {
        localStorage.setItem('aion_users', JSON.stringify(this.users));
        console.log('💾 Пользователи сохранены:', this.users);
    }

    initAuthForm() {
        const authForm = document.getElementById('auth-form');
        if (authForm) {
            authForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('🎯 Форма отправлена');
                this.handleRegistration();
            });
        }
    }

    handleRegistration() {
        console.log('🔄 Начало регистрации...');
        
        // Получаем значения напрямую
        const name = document.getElementById('name').value;
        const age = parseInt(document.getElementById('age').value);
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const bio = document.getElementById('bio').value;

        console.log('📝 Данные формы:', { name, age, email, bio });

        const userData = {
            id: Date.now().toString(),
            name: name,
            age: age,
            email: email,
            password: password,
            bio: bio || 'Новый пользователь AION',
            photos: [],
            subscription: 'free',
            createdAt: new Date().toISOString(),
            likesToday: 0,
            lastLikeReset: new Date().toISOString(),
            likesReceivedToday: 0,
            lastReceivedReset: new Date().toISOString()
        };

        // Валидация
        if (userData.age < 18) {
            alert('❌ Минимальный возраст - 18 лет');
            return;
        }

        if (userData.name.length < 2) {
            alert('❌ Имя должно содержать минимум 2 символа');
            return;
        }

        if (!userData.email || !userData.password) {
            alert('❌ Заполните email и пароль');
            return;
        }

        // Проверка email
        const existingUser = this.users.find(u => u.email === userData.email);
        if (existingUser) {
            alert('❌ Пользователь с таким email уже существует');
            return;
        }

        console.log('✅ Валидация пройдена');

        // Регистрация
        this.register(userData);
    }

    register(userData) {
        console.log('👤 Регистрация пользователя:', userData.name);
        
        // Добавляем пользователя
        this.users.push(userData);
        this.saveUsers();
        
        // Сохраняем текущего пользователя
        localStorage.setItem('aion_current_user', JSON.stringify(userData));
        
        console.log('✅ Пользователь зарегистрирован и сохранен');
        console.log('📊 Текущий пользователь:', localStorage.getItem('aion_current_user'));
        
        // Показываем уведомление
        alert(`🎉 Добро пожаловать, ${userData.name}!`);
        
        // Перезагружаем страницу для применения изменений
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

// Глобальный экземпляр менеджера аутентификации
const authManager = new AuthManager();
