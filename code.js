const DATA =
  '{\n    "items": [\n      {\n        "sys": { "id": "1" },\n        "fields": {\n          "title": "queen panel bed",\n          "price": 10.99,\n          "image": { "fields": { "file": { "url": "./images/product-1.jpeg" } } }\n        }\n      },\n      {\n        "sys": { "id": "2" },\n        "fields": {\n          "title": "king panel bed",\n          "price": 12.99,\n          "image": { "fields": { "file": { "url": "./images/product-2.jpeg" } } }\n        }\n      },\n      {\n        "sys": { "id": "3" },\n        "fields": {\n          "title": "single panel bed",\n          "price": 12.99,\n          "image": { "fields": { "file": { "url": "./images/product-3.jpeg" } } }\n        }\n      },\n      {\n        "sys": { "id": "4" },\n        "fields": {\n          "title": "twin panel bed",\n          "price": 22.99,\n          "image": { "fields": { "file": { "url": "./images/product-4.jpeg" } } }\n        }\n      },\n      {\n        "sys": { "id": "5" },\n        "fields": {\n          "title": "fridge",\n          "price": 88.99,\n          "image": { "fields": { "file": { "url": "./images/product-5.jpeg" } } }\n        }\n      },\n      {\n        "sys": { "id": "6" },\n        "fields": {\n          "title": "dresser",\n          "price": 32.99,\n          "image": { "fields": { "file": { "url": "./images/product-6.jpeg" } } }\n        }\n      },\n      {\n        "sys": { "id": "7" },\n        "fields": {\n          "title": "couch",\n          "price": 45.99,\n          "image": { "fields": { "file": { "url": "./images/product-7.jpeg" } } }\n        }\n      },\n      {\n        "sys": { "id": "8" },\n        "fields": {\n          "title": "table",\n          "price": 33.99,\n          "image": { "fields": { "file": { "url": "./images/product-8.jpeg" } } }\n        }\n      }\n    ]\n  }\n  ';

const productData = JSON.parse(DATA);
console.log(productData);

const arrData = [...productData.items];
console.log(arrData);

// // ElementBuilder  // //

function ElementBuilder(name) {
  this.element = document.createElement(name);
  this.text = function (text) {
    this.element.textContent = text;
    return this;
  };

  this.type = function (type) {
    this.element.type = type;
    return this;
  };

  this.className = function (className) {
    this.element.className = className;
    return this;
  };

  this.src = function (src) {
    this.element.src = src;
    return this;
  };
  this.innerHTML = function (innerHTML) {
    this.element.innerHTML = innerHTML;
    return this;
  };

  this.onclick = function (ev, fn) {
    this.element.addEventListener(ev, fn);
    return this;
  };
  this.appendTo = function (parent) {
    if (parent instanceof ElementBuilder) {
      parent.build().appendChild(this.element);
    } else {
      parent.appendChild(this.element);
    }
    return this;
  };
  this.build = function () {
    return this.element;
  };
}
const builder = {
  create: function (name) {
    return new ElementBuilder(name);
  },
};

// // Product Part On Main page  // //
class Product {
  constructor({ id, title, price, image }) {
    (this.id = id),
      (this.title = title),
      (this.price = price),
      (this.image = image);
  }

  paint() {
    const container = document.querySelector(".products-center");
    const article = builder
      .create("article")
      .className("product")
      .appendTo(container);
    const div = builder
      .create("div")
      .className("img-container")
      .appendTo(article);
    const image = builder
      .create("img")
      .className("product-img")
      .appendTo(div)
      .src(this.image);
    const button = builder
      .create("button")
      .className("bag-btn")
      .appendTo(div)
      .onclick("click", () => cart.add(this.id))
      .innerHTML(
        '<i class="fas fa-shopping-cart"></i>Add to cart<i class="fas fa-shopping-cart"></i>'
      );
    const h3 = builder.create("h3").appendTo(article).text(this.title);
  }
}

class ProductPrint {
  constructor() {
    this.products = arrData.map(
      (item) =>
        new Product({
          id: item.sys.id,
          title: item.fields.title,
          price: item.fields.price,
          image: item.fields.image.fields.file.url,
        })
    );

    console.log(this.products);
  }

  make() {
    this.products.forEach((item) => {
      item.paint();
    });
  }
  get(id) {
    return this.products.find((item) => item.id === id);
  }
}

const doShoping = new ProductPrint();
doShoping.make();
// console.log(doShoping);

// // Cart Panel  // //
class Cart {
  constructor({ id }) {
    this.product = doShoping.get(id);
    this.counter = 1;
  }

  sum() {
    return this.product.price * this.counter;
  }

  draw() {
    const cartcontent = document.querySelector(".cart-content");
    const cartitem = builder
      .create("div")
      .className("cart-item")
      .appendTo(cartcontent);
    const image = builder
      .create("img")
      .src(this.product.image)
      .appendTo(cartitem);
    const titleprice = builder.create("div").appendTo(cartitem);
    const title = builder
      .create("h4")
      .appendTo(titleprice)
      .innerHTML(this.product.title);
    const price = builder
      .create("h5")
      .appendTo(titleprice)
      .innerHTML(this.product.price);
    const remove = builder
      .create("span")
      .appendTo(titleprice)
      .text("remove")
      .className("remove-item")
      .onclick("click", () => {
        cart.remove(this.product.id);
      });
    const updown = builder.create("div").appendTo(cartitem);
    const up = builder
      .create("i")
      .appendTo(updown)
      .className("fas fa-chevron-up")
      .onclick("click", () => {
        this.counter++;
        cart.make();
      });
    const amount = builder
      .create("p")
      .appendTo(updown)
      .className("item-amount")
      .innerHTML(this.counter);
    const down = builder
      .create("i")
      .appendTo(updown)
      .className("fas fa-chevron-down")
      .onclick("click", () => {
        this.counter--;
        if (this.counter === 0) cart.remove(this.product.id);
        else cart.make();
      });
  }
}

class CartItems {
  constructor({ cartTotalItems, cartContent, cartTotalPrice }) {
    this.items = [];
    this.cartContent = cartContent;
    this.cartTotalItems = cartTotalItems;
    this.cartTotalPrice = cartTotalPrice;
  }

  add(id) {
    const exist = this.items.find((item) => item.product.id === id);
    if (exist) {
      exist.counter++;
    } else {
      this.items.push(new Cart({ id }));
    }
    this.make();
  }

  open() {
    const cartoverlayin = document.querySelector(".cart-overlay");
    cartoverlayin.className += " transparentBcg";

    const cartin = document.querySelector(".cart");
    cartin.className += " showCart";
  }

  close() {
    const cartoverlayout = document.querySelector(".cart-overlay");
    cartoverlayout.className = "cart-overlay";

    const cartout = document.querySelector(".cart");
    cartout.className = "cart";
  }

  remove(id) {
    this.items = this.items.filter((t) => t.product.id !== id);
    this.make();
  }

  clear() {
    this.items.splice(0, this.items.length);
    this.make();
  }

  make() {
    cartContent.innerHTML = "";
    let sum = 0,
      counter = 0;
    this.items.forEach((item) => {
      sum += item.sum();
      counter += item.counter;
      item.draw();
    });
    cartTotalItems.textContent = counter;
    cartTotalPrice.textContent = sum;
  }
}
const cartTotalItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const cartTotalPrice = document.querySelector(".cart-total");

const cart = new CartItems({ cartTotalItems, cartContent, cartTotalPrice });
// console.log(cart);

const openCart = document.querySelector(".cart-btn");
openCart.addEventListener("click", () => cart.open());

const closecart = document.querySelector(".close-cart");
closecart.addEventListener("click", () => cart.close());

const clearCart = document.querySelector(".clear-cart");
clearCart.addEventListener("click", () => cart.clear());
