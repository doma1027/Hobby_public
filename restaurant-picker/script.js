// 기본 설정
const DEFAULT_RESTAURANTS = [
    "MS생감자치킨 (치밥+맥주)", "계란집 (오므라이스)", "김치찜", "달맞이 (국밥)",
    "도원참치", "람바다", "리듬앤버거", "밥볶다", "북청집 (제육볶음)",
    "삼미칼국수", "선순대", "소호반점", "오덮", "원조닭한마리칼국수",
    "조박사 (짬뽕)", "조재벌 (김치찌개)", "진짜돼지 (김치찌개, 제육볶음)",
    "킹콩부대찌개", "통통낙지마을", "효카츠 (돈가스)"
];

const LUNCH_QUOTES = [
    "메뉴 골랐으면, 이젠 맛있게 먹는 일만 남았지!",
    "다이어트는 내일부터~ 오늘은 맛있게!",
    "이 메뉴, 입이 먼저 환호하네!",
    "점심 회의 끝! 이제 본격 먹방 시작!",
    "누가 골랐는지 몰라도 메뉴 센스 인정!",
    "이건 점심이 아니라 축제다!",
    "다들 젓가락 장전 완료~ 공격 개시!",
    "같이 먹으니까 100배 맛있다!",
    "밥 잘 먹는 사람이 일도 잘해요~",
    "이 맛은 우리 팀워크만큼이나 완벽!",
    "한입 먹자마자 기분 전환 완료!",
    "점심 먹고 나면 일 하기 싫어지는 건 국룰~",
    "누가 이 메뉴 추천했는지 월급 올려줘야 해!",
    "오늘의 점심은 스트레스 제로 한 끼!",
    "한 숟갈에 힐링이 온다...",
    "이 조합, 배도 마음도 꽉 찬다!",
    "회사 최고의 복지는 이 점심!",
    "메뉴 맛보고 승진한 기분!",
    "이렇게 먹고도 일한다고? 천재다 우리.",
    "맛있게 먹는 우리가 진정한 승자!"
];

class MenuSelectorApp {
    constructor() {
        this.restaurants = this.loadRestaurants();
        this.isAnimating = false;
        this.selectedItems = [];
        this.selectionHistory = this.loadSelectionHistory();

        this.initializeElements();
        this.bindEvents();
        this.updateUI();
    }

    initializeElements() {
        this.selectButton = document.getElementById('selectButton');
        this.addMenuButton = document.getElementById('addMenuButton');
        this.statsButton = document.getElementById('statsButton');
        this.initialMessage = document.getElementById('initialMessage');
        this.animationLabels = document.getElementById('animationLabels');
        this.resultLabels = document.getElementById('resultLabels');
        this.quoteLabel = document.getElementById('quoteLabel');
        this.statsModal = document.getElementById('statsModal');
        this.statsContent = document.getElementById('statsContent');
    }

    bindEvents() {
        this.selectButton.addEventListener('click', () => this.startSelection());
        this.addMenuButton.addEventListener('click', () => this.addNewRestaurant());
        this.statsButton.addEventListener('click', () => this.showStats());

        // 모달 닫기
        document.querySelector('.close').addEventListener('click', () => this.closeStats());
        window.addEventListener('click', (event) => {
            if (event.target === this.statsModal) {
                this.closeStats();
            }
        });
    }

    loadRestaurants() {
        const saved = localStorage.getItem('restaurants');
        return saved ? JSON.parse(saved) : [...DEFAULT_RESTAURANTS];
    }

    saveRestaurants() {
        localStorage.setItem('restaurants', JSON.stringify(this.restaurants));
    }

    loadSelectionHistory() {
        const saved = localStorage.getItem('selectionHistory');
        return saved ? JSON.parse(saved) : {};
    }

    saveSelectionHistory() {
        localStorage.setItem('selectionHistory', JSON.stringify(this.selectionHistory));
    }

    updateUI() {
        if (this.restaurants.length === 0) {
            this.initialMessage.textContent = "식당 목록이 비어있습니다.\n식당을 추가해주세요.";
            this.selectButton.disabled = true;
        } else {
            this.selectButton.disabled = false;
        }
    }

    startSelection() {
        if (this.isAnimating || this.restaurants.length === 0) return;

        this.isAnimating = true;
        this.selectButton.disabled = true;
        this.selectButton.textContent = "🥁 두구두구... 🥁";

        // 초기화
        this.initialMessage.style.display = 'none';
        this.resultLabels.innerHTML = '';
        this.quoteLabel.innerHTML = '';
        this.animationLabels.innerHTML = '';

        // 월요일 제외 로직
        const today = new Date().getDay();
        let availableRestaurants = [...this.restaurants];
        if (today === 1) { // 월요일
            availableRestaurants = availableRestaurants.filter(r => r !== "조박사 (짬뽕)");
        }

        if (availableRestaurants.length === 0) {
            this.showFeedback("선택 가능한 메뉴가 없습니다.", "warning");
            this.resetButton();
            return;
        }

        const numToSelect = Math.min(3, availableRestaurants.length);
        this.selectedItems = this.getRandomItems(availableRestaurants, numToSelect);

        this.animateSelection(0, numToSelect);
    }

    getRandomItems(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    animateSelection(index, total, step = 0) {
        if (index >= total) {
            this.finalizeSelection();
            return;
        }

        const maxSteps = 12;
        const delay = 55 + step * 5;

        if (step < maxSteps) {
            const randomItem = this.restaurants[Math.floor(Math.random() * this.restaurants.length)];

            if (step === 0) {
                const animDiv = document.createElement('div');
                animDiv.className = 'animation-item';
                animDiv.id = `anim-${index}`;
                this.animationLabels.appendChild(animDiv);
            }

            const animElement = document.getElementById(`anim-${index}`);
            animElement.textContent = randomItem;

            setTimeout(() => {
                this.animateSelection(index, total, step + 1);
            }, delay);
        } else {
            // 애니메이션 완료, 최종 결과 표시
            const animElement = document.getElementById(`anim-${index}`);
            if (animElement) {
                animElement.remove();
            }

            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            resultDiv.textContent = `✨ ${this.selectedItems[index]} ✨`;
            this.resultLabels.appendChild(resultDiv);

            setTimeout(() => {
                this.animateSelection(index + 1, total, 0);
            }, 200);
        }
    }

    finalizeSelection() {
        // 선택 기록 저장
        this.logSelection();

        // 랜덤 명언 표시
        const randomQuote = LUNCH_QUOTES[Math.floor(Math.random() * LUNCH_QUOTES.length)];
        this.quoteLabel.textContent = randomQuote;

        this.resetButton();
        this.isAnimating = false;
    }

    logSelection() {
        const timestamp = new Date().toISOString();
        this.selectedItems.forEach(item => {
            if (!this.selectionHistory[item]) {
                this.selectionHistory[item] = 0;
            }
            this.selectionHistory[item]++;
        });
        this.saveSelectionHistory();
    }

    resetButton() {
        this.selectButton.disabled = false;
        this.selectButton.textContent = "🍚 다시 돌려보기! 🍚";
    }

    addNewRestaurant() {
        if (this.isAnimating) {
            this.showFeedback("애니메이션 중에는 식당을 추가할 수 없습니다.", "warning");
            return;
        }

        const newRestaurant = prompt("추가할 식당 이름을 입력하세요:");
        if (newRestaurant && newRestaurant.trim()) {
            const trimmedName = newRestaurant.trim();
            if (this.restaurants.includes(trimmedName)) {
                this.showFeedback(`'${trimmedName}'은(는) 이미 목록에 있습니다.`, "warning");
                return;
            }

            this.restaurants.push(trimmedName);
            this.saveRestaurants();
            this.showFeedback(`'${trimmedName}' 추가 완료!`, "success");
            this.updateUI();
        }
    }

    showStats() {
        const sortedStats = Object.entries(this.selectionHistory)
            .sort(([, a], [, b]) => b - a);

        let statsText = "--- 메뉴 선택 횟수 ---\n\n";
        if (sortedStats.length === 0) {
            statsText += "아직 선택된 메뉴가 없습니다.";
        } else {
            sortedStats.forEach(([restaurant, count]) => {
                statsText += `${restaurant}: ${count}회\n`;
            });
        }

        this.statsContent.textContent = statsText;
        this.statsModal.style.display = 'block';
    }

    closeStats() {
        this.statsModal.style.display = 'none';
    }

    showFeedback(message, type = "info") {
        this.initialMessage.style.display = 'block';
        this.initialMessage.textContent = message;

        // 색상 변경
        const colors = {
            success: '#48BB78',
            warning: '#F6AD55',
            error: '#FC8181',
            info: '#F6AD9A'
        };

        this.initialMessage.style.color = colors[type] || colors.info;

        setTimeout(() => {
            this.initialMessage.style.color = '#F6AD9A';
            if (!this.isAnimating && this.resultLabels.children.length === 0) {
                this.initialMessage.textContent = "오늘 뭐 먹지?\n버튼을 눌러 메뉴를 선택하세요!";
            }
        }, 2000);
    }
}

// 앱 초기화
document.addEventListener('DOMContentLoaded', () => {
    new MenuSelectorApp();
});
