// Navigation - hamburger
const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

backdrop.addEventListener('click', () => {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
});

menuToggle.addEventListener('click', () => {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
});

// Cart - popup
const cartBtn1 = document.getElementById('cart-btn1');
const cartBtn2Mob = document.getElementById('cart-btn2');
const cartClose = document.getElementById('cart-close');
const cartContainer = document.getElementById('cart-container');

cartBtn1.addEventListener('click', () => {
  cartContainer.classList.toggle('active');
});

cartBtn2Mob.addEventListener('click', () => {
  // As side nav bar is open - first close it
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
  cartContainer.classList.add('active');
});

cartClose.addEventListener('click', () => {
  cartContainer.classList.remove('active');
});


// Add to Cart Function
const gridItems = document.getElementById('grid-items');
gridItems.addEventListener('click', (e) => {
  if(e.target.className == 'btn btn-cart') {
    const id = e.target.parentNode.parentNode.id;
    const pName = document.querySelector(`#${id} header h1`).innerText;
    const price = document.querySelector(`#${id} .card__content .product__price span span`).innerText;
    const imgSrc = document.querySelector(`#${id} .card__image img`).src;

    if(document.querySelector(`#cart-${id}`)) {
      const cartItem = document.querySelector(`#cart-${id}`);
      const cartQty = parseInt(cartItem.lastElementChild.firstElementChild.value) + 1;
      cartItem.lastElementChild.firstElementChild.value = cartQty;
      //console.log((cartQty * parseFloat(price)).toFixed(2));
      cartItem.querySelector('.cart-price.cart-col').innerText = `₹ ${(cartQty * parseFloat(price)).toFixed(2)}`;
    }
    else {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-row';
      cartItem.setAttribute('id', `cart-${id}`);
      cartItem.innerHTML = `<span class='cart-item cart-col'>
                            <img class='cart-img' src="${imgSrc}" alt="">
                            <span>${pName}</span>
                        </span>
                        <span class='cart-price cart-col'>₹ ${parseFloat(price).toFixed(2)}</span>
                        <span class='cart-qty cart-col'>
                            <input type="text" value='1'>
                            <button class="btn btn-danger">REMOVE</button>
                        </span>`;
      const cartItems = document.querySelector('.cart-items');
      cartItems.appendChild(cartItem);
    }

    // Update Cart Total Amount
    let cartTotPrice = document.getElementById('total-value').innerText;
    cartTotPrice = (parseFloat(price) + parseFloat(cartTotPrice)).toFixed(2);
    document.getElementById('total-value').innerText = cartTotPrice;

    // Update cart qty count
    document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) + 1;

    // Gives a short toast
    const notification = document.getElementById('notification');
    const notice = document.createElement('div');
    notice.classList.add('toast');
    notice.innerHTML = `<i class="fa fa-check-circle fa-lg" aria-hidden="true" style='color: #99C24D;'></i>&nbsp;&nbsp;${pName} Added to Cart`;
    //notification.appendChild(notice);
    notification.insertBefore(notice, notification.firstChild);

    setTimeout(() => {
      notice.remove();
    }, 3000);
  }
});