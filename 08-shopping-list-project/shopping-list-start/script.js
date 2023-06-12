//
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;



//Fucntions
const displayItems = () => {
    const itemFromStorage = getItemFromStorage();
    itemFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}


const onAddItemSubmit = e => {
    e.preventDefault();

    const newItem = itemInput.value;

    //Validate Input
    newItem === '' ? alert('Please add an item') : null;
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove()
        isEditMode = false;
    } else {
        if (checkIfItemExist(newItem)) {
            alert('That item already exists!');
            return;
        }
    }
    // Create list item
    // Create item DOM element
    addItemToDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

}



const addItemToDOM = item => {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');

    li.appendChild(button);

    itemList.appendChild(li);
}
const createButton = classes => {
    const button = document.createElement('button');
    button.className = classes;

    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}
const createIcon = classes => {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}
const addItemToStorage = item => {
    const itemFromStorage = getItemFromStorage();

    itemFromStorage.push(item);

    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

const getItemFromStorage = () => {
    let itemFromStorage;

    localStorage.getItem('item') === null ? itemFromStorage = [] : itemFromStorage = JSON.parse(localStorage.getItem('items'));
    return itemFromStorage;
}

const onClickItem = e => {
    e.target.parentElement.classList.contains('remove-item') ? removeItem(e.target.parentElement.parentElement) : setItemToEdit(e.target);
}

const checkIfItemExist = item => {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.includes(item) ? true : false;
}

const setItemToEdit = item => {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit.mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = `<i class="fa solid fa-pen"></i> Update Item`;
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}
const removeItem = item => {

    confirm('Are you sure') ? (item.remove(), removeItemFromStorage(item.textContent), checkUI()) : null;
}

const removeItemFromStorage = item => {
    let itemsFromStorage = getItemFromStorage();

    // Filter out item to be removed

    itemsFromStorage = itemsFromStorage.filter(i => i !== item);

    // Res-set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

const clearItems = () => {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);

    }

    //CLear from localStorage
    localStorage.removeItem('items');

    checkUI();
}
const filterItems = e => {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();

        itemName.indexOf(text) != -1 ? item.style.display = 'flex' : item.style.display = 'none'

    });


}

const checkUI = () => {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');
    if (items.length === 0) {
        clearBtn.style.display = 'none'; itemFilter.style.display = 'none';

    } else {
        clearBtn.style.display = 'block'; itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

// Initialize app
const init = () => {
    //Event listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();