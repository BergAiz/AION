// AION - Компонент карточки пользователя с параллакс-эффектом
class AionCard {
    constructor(user) {
        this.user = user;
        this.element = null;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
    }

    create() {
        const card = document.createElement('div');
        card.className = 'aion-card';
        card.innerHTML = `
            <div class="card-content">
                <div class="user-photo" style="background: linear-gradient(45deg, #${Math.random().toString(16).slice(2, 8)}, #${Math.random().toString(16).slice(2, 8)})">
                    <div class="photo-placeholder">${this.user.name.charAt(0)}</div>
                </div>
                <div class="user-info">
                    <h3>${this.user.name}, ${this.user.age}</h3>
                    <p>${this.user.bio}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-dislike">👎</button>
                    <button class="btn-super-like">⭐</button>
                    <button class="btn-like">👍</button>
                </div>
            </div>
        `;

        this.element = card;
        this.addEventListeners();
        return card;
    }

    addEventListeners() {
        // Параллакс-эффект при движении мыши/таче
        this.element.addEventListener('mousemove', (e) => {
            if (this.isDragging) return;
            
            const rect = this.element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 20;
            const rotateX = (centerY - y) / 20;
            
            this.element.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
        });

        this.element.addEventListener('mouseleave', () => {
            if (!this.isDragging) {
                this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }
        });
    }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AionCard;
}
