
// Modèle de données produits
// Récupérer les produits depuis le localStorage ou initialiser avec des valeurs par défaut
let products = JSON.parse(localStorage.getItem('products')) || [
    //const products = [
    {
        name: 'Tartiflette à réaction',
        price: 599.99,
        stock: 26
    },
    {
        name: 'Hélicoptère à pédales',
        price: 250.95,
        stock: 9
    },
    {
        name: 'Géranium électrique',
        price: 398.57,
        stock: 0
    }
];

// Fonctions pour générer le html
// Expression ternaire
function generateProductHTML(product) {
    const stockClass = product.stock < 10 && product.stock > 0 ? 'table-warning' : product.stock === 0 ? 'table-danger' : '';
    const stockStyle = `background-color: ${stockClass === 'table-warning' ? 'orange' : stockClass === 'table-danger' ? 'red' : 'inherit'};`;
// localStorage.clear() j'avais un bug avec <td>${product.price.toFixed(2)}</td>
// car lorsque la liste de produits est vide, que l'on crée un produit vide et que l'on reload,'NaN' se transforme en 'null', le code essaie d'accéder 'toFixed' d'un prix qui est 'null'
    return `
        <tr>
            <td class="w-100">${product.name}</td>
            <td>${product.price ? product.price.toFixed(2) : ''}</td>
            <td class="stock ${stockClass}" style="${stockStyle}">${product.stock}</td>
            <td class="text-nowrap">
                <button type="button" class="btn btn-outline-primary btn-sm stock-del">&minus;</button>
                <button type="button" class="btn btn-primary btn-sm stock-add">&plus;</button>
            </td>
            <td>
                <button type="button" class="btn btn-danger btn-sm product-del">&Cross;</button>
            </td>
        </tr>
    `;
}

// Fonction pour mettre à jour la liste des produits dans le DOM
function updateProductList() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';
// Boucle foreach qui parcourt chaque produit et génére le html 
    products.forEach(product => {
        const productHTML = generateProductHTML(product);
        productsContainer.innerHTML += productHTML;
    });

    // Sauvegarder les produits dans le localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Afficher / masquer le message d'alerte 
    const alertMessage = document.querySelector('.alert-warning');
    if (products.length === 0) {
        alertMessage.style.display = 'block'; // Afficher le message
    } else {
        alertMessage.style.display = 'none'; // Masquer le message
    }

}

// Fonction pour ajouter un nouveau produit
function addProduct(name, price, stock) {
    // créer le produit
    const newProduct = {
        name: name,
        price: parseFloat(price), // convertit en nombre a virgule
        stock: parseInt(stock) // convertit en nombre entier
    };
    // ajouter produit et le mettre a jour
    products.push(newProduct);
    updateProductList();
}

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    //console.log('%c🚀', 'font-size:180px');
    // Initialiser la liste des produits
    updateProductList(); 

    // Ajouter un écouteur d'événement sur le formulaire d'ajout
    const addForm = document.querySelector('.card-body');
    addForm.addEventListener('submit', function (event) {
        // Empêcher le formulaire de se soumettre
        event.preventDefault(); 
        // ajout du produit
        const productName = document.getElementById('add-name').value;
        const productPrice = document.getElementById('add-price').value;
        const productStock = document.getElementById('add-stock').value;
        addProduct(productName, productPrice, productStock);
    });

    // Ajouter d'eventlistener pour modifier le stock par boutons
    const productsContainer = document.getElementById('products');
    productsContainer.addEventListener('click', function (event) {
        const targetButton = event.target;
        const productIndex = Array.from(targetButton.closest('tr').parentElement.children).indexOf(targetButton.closest('tr'));
        
        if (targetButton.classList.contains('stock-del')) {
            // Décrémenter le stock
            products[productIndex].stock = Math.max(products[productIndex].stock - 1, 0);
        } else if (
            targetButton.classList.contains('stock-add')) {
            // Incrémenter le stock
            products[productIndex].stock++;
        } else if (
            targetButton.classList.contains('product-del')) {
            // Supprimer le produit
            products.splice(productIndex, 1);
        }
        // Mettre a jour la liste dans le DOM
        updateProductList();
    });
});
