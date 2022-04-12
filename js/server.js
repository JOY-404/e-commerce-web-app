
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
                    <input type="hidden" value="${product.id}">
                </div>`;
            gridItems.appendChild(prodElement);
        });
    }).catch(err => {
        if (err.response) {
            showNotification(`Oops! Something went wrong! ${err.response.status}`, true);
        }
        else if (err.request) {
            showNotification('Error: No Response From Server', true);
        }
        else {
            showNotification(err.message, true);
        }
    });

    axios.get('http://localhost:3000/cart').then(res => {
        let cartTotPrice = 0;
        let totalQty = 0;

        res.data.forEach(product => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-row';
            cartItemElement.setAttribute('id', `cart-item${product.id}`);
            const totAmt = parseFloat(product.price) * parseFloat(product.cartItems.quantity);
            cartItemElement.innerHTML = `<span class='cart-item cart-col'>
                            <img class='cart-img' src="${product.imageUrl}" alt="">
                            <span>${product.title}</span>
                        </span>
                        <span class='cart-price cart-col'>₹&nbsp;<span>${totAmt.toFixed(2)}</span></span>
                        <span class='cart-qty cart-col'>
                            <input type="text" value='${product.cartItems.quantity}' readonly>
                            <button class="btn btn-danger">REMOVE</button>
                        </span>`;
            cartItems.appendChild(cartItemElement);

            cartTotPrice += totAmt;
            totalQty += parseInt(product.cartItems.quantity);
        });

        // Update Cart Total Amount
        document.getElementById('total-value').innerText = cartTotPrice.toFixed(2);;
        // Update cart qty count
        document.querySelector('.cart-number').innerText = totalQty;
    }).catch(err => {
        if (err.response) {
            showNotification(`Oops! Something went wrong! ${err.response.status}`, true);
        }
        else if (err.request) {
            showNotification('Error: No Response From Server', true);
        }
        else {
            showNotification(err.message, true);
        }
    });    
});

