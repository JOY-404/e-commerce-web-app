
const cartContainer = document.getElementById('cart-container');
// Navigation - hamburger
const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

backdrop.addEventListener('click', () => {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
  cartContainer.classList.remove('active');
});

menuToggle.addEventListener('click', () => {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
  cartContainer.classList.remove('active');
});

// Cart - popup
const cartBtn1 = document.getElementById('cart-btn1');
const cartBtn2Mob = document.getElementById('cart-btn2');
const cartClose = document.getElementById('cart-close');

cartBtn1.addEventListener('click', () => {
  backdrop.style.display = 'block';
  cartContainer.classList.add('active');
});

cartBtn2Mob.addEventListener('click', () => {
  // As side nav bar is open - first close it
  backdrop.style.display = 'block';
  sideDrawer.classList.remove('open');
  cartContainer.classList.add('active');
});

cartClose.addEventListener('click', () => {
  backdrop.style.display = 'none';
  cartContainer.classList.remove('active');
});


// Add to Cart Function
const gridItems = document.getElementById('grid-items');
gridItems.addEventListener('click', (e) => {
  // Add to cart button is clicked
  if(e.target.className == 'btn btn-cart') {
    const id = e.target.parentNode.parentNode.id;
    const pid = document.querySelector(`#${id} .card__actions input`).value;
    const pName = document.querySelector(`#${id} header h1`).innerText;
    const price = document.querySelector(`#${id} .card__content .product__price span span`).innerText;
    const imgSrc = document.querySelector(`#${id} .card__image img`).src;

    // POST request to DB with pid
    axios.post('http://localhost:3000/cart', { productId: pid }).then(res => {

      if (document.querySelector(`#cart-${id}`)) {
        const cartItem = document.querySelector(`#cart-${id}`);
        const cartQty = parseInt(cartItem.lastElementChild.firstElementChild.value) + 1;
        cartItem.lastElementChild.firstElementChild.value = cartQty;
        //console.log((cartQty * parseFloat(price)).toFixed(2));
        cartItem.querySelector('.cart-price.cart-col span').innerText = `${(cartQty * parseFloat(price)).toFixed(2)}`;
      }
      else {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-row';
        cartItem.setAttribute('id', `cart-${id}`);
        cartItem.innerHTML = `<span class='cart-item cart-col'>
                            <img class='cart-img' src="${imgSrc}" alt="">
                            <span>${pName}</span>
                        </span>
                        <span class='cart-price cart-col'>₹&nbsp;<span>${parseFloat(price).toFixed(2)}</span></span>
                        <span class='cart-qty cart-col'>
                            <input type="text" value='1' readonly>
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
      setTimeout(() => notice.remove(), 3000);

    }).catch(err => {
      console.log(err);
      showErrorNotification();
    });
  }
});

function showErrorNotification() {
  const notification = document.getElementById('notification');
  const notice = document.createElement('div');
  notice.classList.add('toast');
  notice.innerHTML = `<i class="fa fa-exclamation-circle fa-lg" aria-hidden="true" style='color: red;'></i>&nbsp;&nbsp;Oops! Something Went Wrong`;
  notification.insertBefore(notice, notification.firstChild);
  setTimeout(() => notice.remove(), 3000);
}

// Remove Items from Cart function
const cartItems = document.querySelector('.cart-items');
cartItems.addEventListener('click', (e) => {
  //console.log(e.target.className);
  if (e.target.className == 'btn btn-danger') {
    // Remove that item from the list
    const cartItem = e.target.parentNode.parentNode;
    const itemAmt = parseFloat(cartItem.querySelector(`.cart-price span`).innerText);
    const itemQty = parseInt(cartItem.querySelector('.cart-qty input').value);
    cartItems.removeChild(cartItem);
    // Update Cart Total Amount
    let cartTotPrice = document.getElementById('total-value').innerText;
    cartTotPrice = (parseFloat(cartTotPrice) - itemAmt).toFixed(2);
    document.getElementById('total-value').innerText = cartTotPrice;
    // Update cart qty count
    document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) - itemQty;
  }
});