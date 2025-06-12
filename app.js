async function loadJson(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error loading JSON ${error.message}`);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  toggleButton();
});

function toggleButton() {
  const productCartItem = document.querySelector(".product__cart-item");
  if (!productCartItem) {
    console.log("productCartItem element not founded");
    return;
  }
  productCartItem.addEventListener("click", (event) => {
    const cartAdd = event.target.closest(".cart-add");
    if (cartAdd) {
      const cartCounter = cartAdd.nextElementSibling;
      if (cartCounter) {
        if (cartAdd.classList.contains("active")) {

          cartAdd.classList.remove("active");
          cartCounter.classList.add("active");
          const productCartBlock = cartAdd.closest(".product__cart-block");
          addToCart(productCartBlock);
        }
      }
    }
  });
}

function addToCart(productCartBlock) {
  const modalPhoto = productCartBlock.querySelector('picture img').src;
  
  const itemName = productCartBlock.querySelector("h4").innerText;
  const itemPrice = parseFloat(
    productCartBlock.querySelector("strong").innerText.replace("$", "")
  );
  currentQuantity = 1;

  const cartFull = document.createElement("div");
  cartFull.classList.add("cart__bought-full");
  cartFull.setAttribute("data-label", `${itemName}`);
  cartFull.innerHTML = `
                <div class="cart__bought-content">
                <div class="cart__bought-desert">
                  <h5>${itemName}</h5>
                  <p class="desert__quantity">${currentQuantity}x</p>
                  <p class="desert__price">@ &#36; ${itemPrice.toFixed(2)}</p>
                  <p class="desert__final"> &#36; ${itemPrice.toFixed(2)}</p>
                </div>
                <button class="cart__bought-delete">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="10"
                    fill="none"
                    viewBox="0 0 10 10"
                  >
                    <path
                      fill="#CAAFA7"
                      d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"
                    />
                  </svg>
                </button>
              </div>
  `;
  const cartModalItem = document.createElement("article");
  cartModalItem.classList.add("cart__modal-item");
  cartModalItem.setAttribute("data-label", `${itemName}`);
  cartModalItem.innerHTML = `
                <picture>
              <img
                src="${modalPhoto}"
                alt="${itemName}"
              />
            </picture>
                  <div class="cart__bought-desert">
                  <h5>${itemName}</h5>
                  <p class="desert__quantity">${currentQuantity}x</p>
                  <p class="desert__price">@ &#36; ${itemPrice.toFixed(2)}</p>
                </div>
                  <p class="desert__final">&#36;${itemPrice.toFixed(2)}</p>
  `;

  const productBasket = document.querySelector(".cart__bought");
  const modalOrderDessert = document.querySelector(".modal__order-dessert");
  if (productBasket) {
    productBasket.appendChild(cartFull);
    modalOrderDessert.appendChild(cartModalItem);
  }

  const cartAdd = productCartBlock.querySelector(".cart-add");
  const cartCounter = productCartBlock.querySelector(".cart__counter");
  const dataCartFull = cartFull.getAttribute(`${itemName}`);
  const dataCartBlock = productCartBlock.getAttribute(`${itemName}`);
  //
  const itemDessertQuantity =
    productCartBlock.querySelector(".quantity-dessert");

  updateCartItemCount();
  const cartsBoughtDelete = document.querySelectorAll(".cart__bought-delete");
  const desertQuantity = cartFull.querySelector(".desert__quantity");
  const desertFinal = cartFull.querySelector(".desert__final");
  const desertQuantityModal = cartModalItem.querySelector(".desert__quantity");
  const desertFinalModal = cartModalItem.querySelector(".desert__final");

  cartsBoughtDelete.forEach((cartBoughtDelete) => {
    cartBoughtDelete.addEventListener("click", () => {
      productBasket.removeChild(cartFull);
      modalOrderDessert.removeChild(cartModalItem);
      updateCartItemCount();
      if (dataCartFull == dataCartBlock) {
        cartCounter.classList.remove("active");
        cartAdd.classList.add("active");
        itemDessertQuantity.innerHTML = 1;
      }
    });
  });

  const incrementButton = productCartBlock.querySelector(".btn-inc");
  const decrementButton = productCartBlock.querySelector(".btn-dec");

  incrementButton.addEventListener("click", () => {
    currentQuantity++;
    desertQuantity.innerText = `${currentQuantity}x`;
    desertFinal.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
    desertQuantityModal.innerText = `${currentQuantity}x`;
    desertFinalModal.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
    updateCartItemCount();
  });

  decrementButton.addEventListener("click", () => {
    if (currentQuantity > 1) {
      currentQuantity--;
      desertQuantity.innerText = `${currentQuantity}x`;
      desertFinal.innerText = `$${(itemPrice * currentQuantity).toFixed(2)}`;
      desertQuantityModal.innerText = `${currentQuantity}x`;
      desertFinalModal.innerText = `$${(itemPrice * currentQuantity).toFixed(
        2
      )}`;
      updateCartItemCount();
    }
  });
}

function setupCartCounter() {
  const productCartItem = document.querySelector(".product__cart-item");
  if (!productCartItem) {
    console.error("productCartItem not found");
    return;
  }
  productCartItem.addEventListener("click", (event) => {
    const decrementButton = event.target.closest(".btn-dec");
    const incrementButton = event.target.closest(".btn-inc");

    if (decrementButton) {
      itemQuantityInput = decrementButton.nextElementSibling;

      if (
        itemQuantityInput &&
        itemQuantityInput.classList.contains("quantity-dessert")
      ) {
        let quantity = parseInt(itemQuantityInput.innerText);
        if (quantity > 1) {
          itemQuantityInput.innerText = quantity - 1;
        }
      }
    }

    if (incrementButton) {
      itemQuantityInput = incrementButton.previousElementSibling;

      if (
        itemQuantityInput &&
        itemQuantityInput.classList.contains("quantity-dessert")
      ) {
        let quantity = parseInt(itemQuantityInput.innerText);
        itemQuantityInput.innerText = quantity + 1;
      }
    }
  });
  updateCartItemCount();
}

function clearCart() {
  const clearCartButton = document.getElementById("clear-cart");
  clearCartButton.addEventListener("click", () => {
    const cartsBoughtFulls = document.querySelectorAll(".cart__bought-full");
    const cartModalItems = document.querySelectorAll(".cart__modal-item");

    if (cartsBoughtFulls.length >= 1) {
      cartsBoughtFulls.forEach((cart) => cart.remove());
      cartModalItems.forEach((cart) => cart.remove());
    }

    const productCartBlocks = document.querySelectorAll(".product__cart-block");
    productCartBlocks.forEach((productCartBlock) => {
      const cartAdd = productCartBlock.querySelector(".cart-add");
      const cartCounter = productCartBlock.querySelector(".cart__counter");
      const quantityDessert =
        productCartBlock.querySelector(".quantity-dessert");

      cartAdd.classList.add("active");
      cartCounter.classList.remove("active");
      quantityDessert.innerHTML = 1;
    });
    updateCartItemCount();
  });
}

function updateCartItemCount() {
  const cartsBoughtFull = document.querySelectorAll(".cart__bought-full");
  const cartCountElement = document.querySelector(".cart-count");
  const totalPrice = document.querySelector(".total-price");
  const totalPriceModal = document.querySelector(".total-price-modal");
  let totalQuantity = 0;
  let totalAmount = 0;

  cartsBoughtFull.forEach((item) => {
    const quantityText = item.querySelector(".desert__quantity").innerText;
    const quantity = parseInt(quantityText);
    totalQuantity += quantity;

    const totalPriceText = item.querySelector(".desert__final").innerText;
    const total = parseFloat(totalPriceText.replace("$", ""));
    totalAmount += total;
  });
  if (cartCountElement) {
    cartCountElement.innerText = `You cart (${totalQuantity})`;
  }
  if (totalPrice) {
    totalPrice.innerText = `$${totalAmount.toFixed(2)}`;
    totalPriceModal.innerText = `$${totalAmount.toFixed(2)}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadJson("data.json")
    .then((data) => {
      const productCartItem = document.querySelector(".product__cart-item");
      data.forEach((item) => {
        const article = document.createElement("article");
        article.classList.add("product__cart-block");
        article.setAttribute("data-label", `${item.name}`);
        let itemSumDessert = 1;
        article.innerHTML = `
                    <picture>
              <source
                srcset="${item.image.mobile}"
                media="(max-width: 760px)"
              />
              <source
                srcset="${item.image.tablet}"
                media="(max-width: 1040px)"
              />
              <img
                src="${item.image.desktop}"
                alt="${item.name}"
              />
            </picture>
            <button class="cart-add active">
              <img
                src="./assets/images/icon-add-to-cart.svg"
                alt="icon Add to cart"
              />Add to Cart
            </button>
            <div class="cart__counter">
              <button class="btn-dec">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="2"
                  fill="none"
                  viewBox="0 0 10 2"
                >
                  <path fill="#fff" d="M0 .375h10v1.25H0V.375Z" />
                </svg>
              </button>
              <span class="quantity-dessert">${itemSumDessert}</span>
              <button class="btn-inc">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  fill="none"
                  viewBox="0 0 10 10"
                >
                  <path
                    fill="#fff"
                    d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
                  />
                </svg>
              </button>
            </div>
            <p>${item.category}</p>
            <h4>${item.name}</h4>
            <strong>$${item.price.toFixed(2)}</strong>
        `;
        productCartItem.appendChild(article);
      });
      toggleButton();
      setupCartCounter();
      updateCartItemCount();
      clearCart();
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
});
