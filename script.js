document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('articles')) {
        localStorage.setItem('articles', JSON.stringify({}));
    }
});

function searchArticle() {
    const articleId = document.getElementById('searchInput').value.trim();
    const articles = JSON.parse(localStorage.getItem('articles'));
    const resultSection = document.getElementById('resultSection');
    resultSection.innerHTML = '';

    if (articles[articleId]) {
        const articleInfo = document.createElement('div');
        articleInfo.innerHTML = `Article Number: ${articleId}, Current Stock: ${articles[articleId]}`;

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.placeholder = 'Quantity';
        quantityInput.style.margin = '0 10px';

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.onclick = function() { adjustStock(articleId, parseInt(quantityInput.value) || 0, true); };

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() { adjustStock(articleId, parseInt(quantityInput.value) || 0, false); };

        resultSection.appendChild(articleInfo);
        resultSection.appendChild(quantityInput);
        resultSection.appendChild(addButton);
        resultSection.appendChild(removeButton);
    } else {
        resultSection.innerHTML = `Article Number: ${articleId} is not in stock.`;
    }
}

function adjustStock(articleId, quantity, isAdding) {
    const articles = JSON.parse(localStorage.getItem('articles'));
    if (isAdding) {
        articles[articleId] = (articles[articleId] || 0) + quantity;
    } else {
        articles[articleId] = Math.max(0, (articles[articleId] || 0) - quantity);
    }
    localStorage.setItem('articles', JSON.stringify(articles));
    alert(`Stock for Article Number: ${articleId} updated. New Quantity: ${articles[articleId]}`);
    searchArticle(); // Refresh the search result to show updated stock
}

function verifyAccessCode() {
    const code = document.getElementById('accessCodeInput').value;
    if (code === '1010') {
        document.getElementById('articlesList').style.display = 'block';
        populateArticlesList();
    } else {
        alert('Incorrect code. Access denied.');
    }
}

function closeArticlesList() {
    document.getElementById('articlesList').style.display = 'none';
    document.getElementById('closeArticlesListButton').style.display = 'none'; // Hide the close button
}


function populateArticlesList() {
    const articlesList = document.getElementById('articlesList');
    articlesList.innerHTML = '<button onclick="closeArticlesList()" id="closeArticlesListButton">Close Article List</button>'; // Ensure the Close button is there

    const manageMenu = document.createElement('div');
    manageMenu.id = 'manageMenu';
    manageMenu.innerHTML = `
        <input type="text" id="articleNumber" placeholder="Article Number">
        <input type="number" id="articleQuantity" placeholder="Quantity">
        <button onclick="addArticle()">Add Article</button>
    `;
    articlesList.appendChild(manageMenu);

    const articles = JSON.parse(localStorage.getItem('articles'));
    if (Object.keys(articles).length === 0) {
        const noArticles = document.createElement('div');
        noArticles.innerText = 'No articles in stock.';
        articlesList.appendChild(noArticles);
        return;
    }

    Object.entries(articles).forEach(([articleId, quantity]) => {
        const articleItem = document.createElement('div');
        articleItem.classList.add('articleItem');
        
        const articleText = document.createElement('span');
        articleText.innerText = `Article Number: ${articleId}, Quantity: ${quantity}`;

        const editButton = document.createElement('button');
        editButton.innerText = 'Edit Stock';
        editButton.onclick = function() { showEditField(articleId, articleItem, quantity); };

        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.onclick = function() { removeArticle(articleId); };

        articleItem.appendChild(articleText);
        articleItem.appendChild(editButton);
        articleItem.appendChild(removeButton);
        articlesList.appendChild(articleItem);
    });
}


function addArticle() {
    const articleId = document.getElementById('articleNumber').value;
    const quantity = parseInt(document.getElementById('articleQuantity').value);
    const articles = JSON.parse(localStorage.getItem('articles'));
    articles[articleId] = (articles[articleId] || 0) + quantity;
    localStorage.setItem('articles', JSON.stringify(articles));
    alert('Article added/updated successfully!');
    populateArticlesList(); // Refresh the list
}

function removeArticle(articleId) {
    const articles = JSON.parse(localStorage.getItem('articles'));
    if (articles[articleId]) {
        delete articles[articleId]; // Remove the article from the object
        localStorage.setItem('articles', JSON.stringify(articles)); // Update localStorage
        populateArticlesList(); // Refresh the list
        alert(`Article Number: ${articleId} has been removed.`);
    }
}

function showEditField(articleId, articleItem, currentQuantity) {
    // Remove any existing edit field first
    const existingEditField = document.querySelector('.editStockField');
    if (existingEditField) {
        existingEditField.remove();
    }

    const editField = document.createElement('input');
    editField.type = 'number';
    editField.className = 'editStockField';
    editField.value = currentQuantity;
    editField.style.margin = '0 10px';

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.onclick = function() { editStock(articleId, editField.value); };

    // Insert the edit field and save button before the "Remove" button
    articleItem.insertBefore(editField, articleItem.children[1]);
    articleItem.insertBefore(saveButton, articleItem.children[2]);
}

function editStock(articleId, newQuantity) {
    const articles = JSON.parse(localStorage.getItem('articles'));
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 0) {
        articles[articleId] = quantity;
        localStorage.setItem('articles', JSON.stringify(articles));
        populateArticlesList(); // Refresh the list to remove the edit field and update the quantity
    } else {
        alert('Please enter a valid stock quantity.');
    }
}
