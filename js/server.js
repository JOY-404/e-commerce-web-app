
// Add products from server
document.addEventListener('DOMContentLoaded', () => {
    axios.get('http://localhost:3000/products').then(res => {
        res.data.forEach(product => {
            const prodElement = document.createElement('article');
            prodElement.className = 'card product-item';
            prodElement.setAttribute('id', `item${product.id}`);
            prodElement.innerHTML = `<header class="card__header">
                    <h1 class="product__title">
                        ${product.title}
                    </h1>
                </header>
                <div class="card__image">
                    <img src="${product.imageUrl}" alt="${product.title}">
                </div>
                <div class="card__content">
                    <h2 class="product__price"><span>₹ <span>${product.price}</span></span>
                    </h2>
                </div>
                <div class="card__actions">
                    <!-- <a href="" class="btn btn-detail">Details</a> -->
                    <button class="btn btn-cart">Add to Cart</button>
                    <input type="hidden" name="productId" value="${product.id}">
                </div>`;
            gridItems.appendChild(prodElement);
        });
    });
});

