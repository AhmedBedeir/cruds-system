// calling all inputs ids
const title = document.getElementById('title');
const price = document.getElementById('price');
const taxes = document.getElementById('taxes');
const ads = document.getElementById('ads');
const discount = document.getElementById('discount');
const total = document.getElementById('total');
const count = document.getElementById('count');
const category = document.getElementById('category');
const create = document.getElementById('submit');
const search = document.getElementById('search');
let products = [];
let mode = 'create';
let modeSearch = 'title';
let tem = 0;
// get total
function getTotal() {
  if (price.value !== '') {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.backgroundColor = '#098b00';
  } else {
    total.style.backgroundColor = '#ff6600';
    total.innerHTML = '';
  }
}
// create row (one product)
function createRow(i, item) {
  let row = `
  <tr>
    <td>${i + 1}</td>
    <td>${item.title}</td>
    <td>${item.price}</td>
    <td>${item.taxes}</td>
    <td>${item.ads}</td>
    <td>${item.discount}</td>
    <td>${item.total}</td>
    <td>${item.count}</td>
    <td>${item.category}</td>
    <td><button onclick = "updateData(${i})" id="update">Update</button></td>
    <td><button onclick = "deleteItem(${i})" id="delete">Delete</button></td>
  </tr>
  `;
  return row;
}
// check data in local storage
if (localStorage.products != null) {
  products = JSON.parse(localStorage.products);
  console.log(typeof JSON.parse(localStorage.products));
}
create.onclick = function () {
  if (checkValidData()) {
    const newProduct = {
      title: title.value.toLowerCase(),
      price: price.value,
      taxes: taxes.value || 0,
      ads: ads.value || 0,
      discount: discount.value || 0,
      total: total.innerHTML,
      category: category.value.toLowerCase(),
      count: count.value || 1,
    };
    if (mode === 'create') {
      products.push(newProduct);
    } else {
      products[tem] = newProduct;
      create.innerHTML = 'Create';
      mode = 'create';
      create.style.backgroundColor = '#fff';
      create.style.color = '#333';
    }
    localStorage.setItem('products', JSON.stringify(products));
    clearData();
    showData();
  }
};
// clear data from input
function clearData() {
  title.value = '';
  price.value = '';
  taxes.value = '';
  ads.value = '';
  discount.value = '';
  count.value = '';
  category.value = '';
  total.innerHTML = '';
  total.style.backgroundColor = '#ff6600';
}
// show data (read)
function showData() {
  let table = ``;
  for (let i = 0; i < products.length; i++) {
    table += createRow(i, products[i]);
  }
  document.getElementById('tbody').innerHTML = table;
  let btnDeleteAll = document.getElementById('delete-all');
  if (products.length > 0) {
    btnDeleteAll.innerHTML = `
      <button onclick = "deleteAll()">Delete All (${products.length})</button>
    `;
  } else {
    btnDeleteAll.innerHTML = '';
  }
}
showData();
// delete
function deleteItem(i) {
  products.splice(i, 1);
  localStorage.setItem('products', JSON.stringify(products));
  showData();
}
function deleteAll() {
  if (confirm('Are you sure to delete All Products...!')) {
    localStorage.clear();
    products.splice(0);
    showData();
  }
}
// update
function updateData(i) {
  title.value = products[i].title;
  price.value = products[i].price;
  taxes.value = products[i].taxes;
  ads.value = products[i].ads;
  discount.value = products[i].discount;
  total.innerHTML = products[i].total;
  getTotal();
  count.value = products[i].count;
  category.value = products[i].category;
  create.innerHTML = 'Update';
  create.style.backgroundColor = '#098b00';
  create.style.color = '#fff';
  mode = 'update';
  tem = i;
  scroll({
    top: 0,
    behavior: 'smooth',
  });
}

// search
function getModeSearch(id) {
  if (id === 'searchC') {
    modeSearch = 'category';
    search.placeholder = 'Search By Category';
  } else {
    modeSearch = 'title';
    search.placeholder = 'Search By Title';
  }
  search.focus();
}
function searchByValue(value) {
  let table = ``;
  for (let i = 0; i < products.length; i++) {
    if (modeSearch === 'title') {
      if (products[i].title.includes(value.toLowerCase())) {
        table += createRow(i, products[i]);
        console.log(i);
      }
    } else {
      if (products[i].category.includes(value.toLowerCase())) {
        table += createRow(i, products[i]);
      }
    }
  }
  document.getElementById('tbody').innerHTML = table;
}
// clean data
function checkValidData() {
  // check entered Data
  if (!title.value || !price.value || !category.value) {
    alert('Enter product Data...!');
    return false;
  }
  // check valid data
  if (
    +price.value < 1 ||
    +count.value < 0 ||
    +taxes.value < 0 ||
    +discount.value < 0 ||
    +discount.value > price ||
    +ads.value < 0
  ) {
    alert('Enter valid Data...!');
    return false;
  }
  return true;
}
