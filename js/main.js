
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

    // POST request to DB with pid
    axios.post('http://localhost:3000/cart', { productId: pid }).then(res => {
      //saveToCartDOM(id);
      const pName = document.querySelector(`#${id} header h1`).innerText;
      showNotification(`${pName} Added to Cart`);
      getCartItems();
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
  }
});

function showNotification(message, isError=false) {
  // Gives a short toast
  const notification = document.getElementById('notification');
  const notice = document.createElement('div');
  notice.classList.add('toast');
  if (isError === true)
    notice.innerHTML = `<i class="fa fa-exclamation-circle fa-lg" aria-hidden="true" style='color: red;'></i>&nbsp;&nbsp;${message}`;
  else
    notice.innerHTML = `<i class="fa fa-check-circle fa-lg" aria-hidden="true" style='color: #99C24D;'></i>&nbsp;&nbsp;${message}`;

  notification.insertBefore(notice, notification.firstChild);
  setTimeout(() => notice.remove(), 3000);
}

/*
function saveToCartDOM(id) {
  const pName = document.querySelector(`#${id} header h1`).innerText;
  const price = document.querySelector(`#${id} .card__content .product__price span span`).innerText;
  const imgSrc = document.querySelector(`#${id} .card__image img`).src;

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
}
*/

// Remove Items from Cart function
const cartItems = document.querySelector('.cart-items');
cartItems.addEventListener('click', (e) => {
  //console.log(e.target.className);
  if (e.target.className == 'btn btn-danger') {
    const cartItem = e.target.parentNode.parentNode;
    const pid = cartItem.id.substring(9);

    // POST request to DB with pid
    axios.post('http://localhost:3000/cart-delete-item', { productId: pid }).then(res => {
      // Remove that item from the list
      const itemAmt = parseFloat(cartItem.querySelector(`.cart-price span`).innerText);
      const itemQty = parseInt(cartItem.querySelector('.cart-qty input').value);
      
      /*
      cartItems.removeChild(cartItem);
      // Update Cart Total Amount
      let cartTotPrice = document.getElementById('total-value').innerText;
      cartTotPrice = (parseFloat(cartTotPrice) - itemAmt).toFixed(2);
      document.getElementById('total-value').innerText = cartTotPrice;
      // Update cart qty count
      document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) - itemQty;
      */
      let cartPage = document.querySelector('#cart-container .pagination .active').id;
      if (cartItems.childElementCount == 1) cartPage = parseInt(cartPage) - 1;
      getCartItems(cartPage);
      showNotification('Item Removed from Cart');
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
  }
});


const paginatnProducts = document.querySelector('main .pagination');
paginatnProducts.addEventListener('click', (e) => {
  if(e.target.className === 'page') {
    //console.log(e.target.id);
    const page = e.target.id;
    getProducts(page);
  }
});

const paginatnCart = document.querySelector('#cart-container .pagination');
paginatnCart.addEventListener('click', (e) => {
  if (e.target.className === 'page') {
    //console.log(e.target.id);
    const page = e.target.id;
    getCartItems(page);
  }
});

const btnOrderNow = document.querySelector('.btn-order');
btnOrderNow.addEventListener('click', () => {
  const cartTotAmt = parseFloat(document.getElementById('total-value').innerText);
  
  if (cartTotAmt > 0) {
    axios.post('http://localhost:3000/create-order', { totAmt: cartTotAmt }).then(res => {
      let msg;
      if (res.data.success == true) {
        cartItems.innerHTML = '';
        const paginationContainer = document.querySelector('#cart-container .pagination');
        paginationContainer.innerHTML = '';
        // Update Cart Total Amount
        document.getElementById('total-value').innerText = (0).toFixed(2);
        // Update cart qty count
        document.querySelector('.cart-number').innerText = 0;

        showNotification(`Order sucessfully placed with order id = ${res.data.orderid}`);
      }
      else showNotification(`Failed to save order details.`, true);  
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
  }
  else {
    showNotification("Your Cart is Empty", true);
  }
});