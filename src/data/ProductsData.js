// src/data/products.js

const productsData = [
  {
    id: "1",
    name: "Men Shirt",
    category: "Men",
    inner: "Black",
    outer: "Red",
    rating: "4.8 ⭐⭐⭐⭐ ",
    images: [
      require("../assets/images/mens.jpg"),
      require("../assets/images/mens.jpg"),
    ],
    image: require("../assets/images/mens.jpg"),
    price:  999,
    company: "Nike",
    size: "43",
  },
  {
    id: "2",
    name: "Women Dress",
    category: "Women",
    images: [
      require("../assets/images/women.jpg"),
    ],
    image: require("../assets/images/women.jpg"),
    price: 1499,
    company: "Zara",
    rating: "4.7",
  },
  {
    id: "3",
    name: "Kids Wear",
    category: "Kids",
    images: [
      require("../assets/images/kids.jpg"),
    ],
    image: require("../assets/images/kids.jpg"),
    price:799,
    company: "H&M",
    rating: "4.3",
  },
];

export default productsData;