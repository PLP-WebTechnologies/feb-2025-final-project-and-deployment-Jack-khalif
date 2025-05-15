console.clear();

// Extract product ID from URL query parameter
let id = location.search.split('?')[1];
console.log("Product ID:", id);

// Update cart badge count from cookie if present
if (document.cookie.indexOf(',counter=') >= 0) {
  let counter = document.cookie.split(',')[1].split('=')[1];
  let badge = document.getElementById("badge");
  if (badge) badge.innerHTML = counter;
}

/**
 * Dynamically creates the product detail section
 * @param {Object} product - Product data object
 */
function dynamicContentDetails(product) {
  // Main container for product details
  const mainContainer = document.createElement('div');
  mainContainer.id = 'containerD';
  document.getElementById('containerProduct').appendChild(mainContainer);

  // Image section
  const imageSection = document.createElement('div');
  imageSection.id = 'imageSection';

  const mainImg = document.createElement('img');
  mainImg.id = 'imgDetails';
  mainImg.src = product.preview;
  imageSection.appendChild(mainImg);

  // Product details section
  const productDetails = document.createElement('div');
  productDetails.id = 'productDetails';

  // Product name
  const productName = document.createElement('h1');
  productName.textContent = product.name;

  // Product brand
  const productBrand = document.createElement('h4');
  productBrand.textContent = product.brand;

  // Price and description container
  const detailsDiv = document.createElement('div');
  detailsDiv.id = 'details';

  const productPrice = document.createElement('h3');
  productPrice.textContent = `Rs ${product.price}`;

  const descriptionTitle = document.createElement('h3');
  descriptionTitle.textContent = 'Description';

  const productDescription = document.createElement('p');
  productDescription.textContent = product.description;

  detailsDiv.appendChild(productPrice);
  detailsDiv.appendChild(descriptionTitle);
  detailsDiv.appendChild(productDescription);

  // Product preview thumbnails section
  const productPreviewDiv = document.createElement('div');
  productPreviewDiv.id = 'productPreview';

  const previewTitle = document.createElement('h3');
  previewTitle.textContent = 'Product Preview';
  productPreviewDiv.appendChild(previewTitle);

  // Create preview images with click event to update main image
  for (let i = 0; i < product.photos.length; i++) {
    const previewImg = document.createElement('img');
    previewImg.id = 'previewImg';
    previewImg.src = product.photos[i];

    previewImg.onclick = function () {
      mainImg.src = product.photos[i];
    };

    productPreviewDiv.appendChild(previewImg);
  }

  // Add to Cart button
  const buttonDiv = document.createElement('div');
  buttonDiv.id = 'button';

  const addToCartBtn = document.createElement('button');
  addToCartBtn.textContent = 'Add to Cart';

  addToCartBtn.onclick = function () {
    let order = id + " ";
    let counter = 1;

    if (document.cookie.indexOf(',counter=') >= 0) {
      order = id + " " + document.cookie.split(',')[0].split('=')[1];
      counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1;
    }

    document.cookie = `orderId=${order},counter=${counter}`;
    const badge = document.getElementById("badge");
    if (badge) badge.innerHTML = counter;

    console.log("Updated cookie:", document.cookie);
  };

  buttonDiv.appendChild(addToCartBtn);

  // Append all to productDetails container
  productDetails.appendChild(productName);
  productDetails.appendChild(productBrand);
  productDetails.appendChild(detailsDiv);
  productDetails.appendChild(productPreviewDiv);
  productDetails.appendChild(buttonDiv);

  // Append image section and details to main container
  mainContainer.appendChild(imageSection);
  mainContainer.appendChild(productDetails);

  return mainContainer;
}

// Handle case where ID is missing
if (!id) {
  document.getElementById('containerProduct').innerHTML = "<p>No product selected.</p>";
} else {
  // Fetch product details from API
  const httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        console.log('Connected to API');
        const productDetails = JSON.parse(this.responseText);
        dynamicContentDetails(productDetails);
      } else {
        console.error('Failed to connect to API');
      }
    }
  };

  httpRequest.open('GET', `https://5d76bf96515d1a0014085cf9.mockapi.io/product/${id}`, true);
  httpRequest.send();
}
