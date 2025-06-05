const restaurants = [
    { name: "김치찌개집", category: "한식", rating: 4.5 },
    { name: "파스타하우스", category: "양식", rating: 4.2 },
    { name: "라멘야", category: "일식", rating: 4.7 },
    { name: "중화요리집", category: "중식", rating: 4.0 },
    { name: "샐러드바", category: "건강식", rating: 4.3 },
    { name: "피자집", category: "양식", rating: 4.1 },
    { name: "떡볶이집", category: "분식", rating: 4.4 }
];

function getRandomRestaurants(restaurantList, count = 3) {
    const shuffled = [...restaurantList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayResults(selectedRestaurants) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    selectedRestaurants.forEach((restaurant, index) => {
        const card = document.createElement('div');
        card.className = 'restaurant-card';
        card.innerHTML = `
            <h3>${index + 1}. ${restaurant.name}</h3>
            <p>카테고리: ${restaurant.category}</p>
            <p>평점: ${restaurant.rating}/5</p>
        `;
        resultsDiv.appendChild(card);
    });
}

document.getElementById('randomBtn').addEventListener('click', function () {
    const selected = getRandomRestaurants(restaurants, 3);
    displayResults(selected);
});
