
// Storage Controller

// Item Controller
const ItemCtrl = (function () {
    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            // { id: 0, name: "Steak Dinner", calories: 1200 },
            // { id: 1, name: "Cookie", calories: 400 },
            // { id: 2, name: "Eggs", calories: 300 }
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public Methods
    return {
        getItems: function () {
            return data.items;
        },
        addItem: function (name, calories) {
            let ID;
            // Create id
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function (id) {
            let found = null;
            // Loop through items
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function (name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function (id) {
            // Get ids
            const ids = data.items.map(item => item.id);

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        },
        setCurrentItem: function (current) {
            data.currentItem = current;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        getTotalCalories: function () {
            let total = 0;

            data.items.forEach(element => {
                total += element.calories;
            });

            // Set total cal in our data
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function () {
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: "#item-list",
        listItems: "#item-list li",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories"
    }

    // Public Methods
    return {
        populateItemList: function (items) {
            let output = "";
            const ul = document.querySelector(UISelectors.itemList);
            items.forEach((element) => {
                output += `
                <li class="collection-item" id="item-${element.id}">
                    <strong>${element.name}: </strong>
                    <em>${element.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pen-square"></i>
                    </a>
                </li>`;
            });
            ul.innerHTML = output;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {
            // Show List
            document.querySelector(UISelectors.itemList).style.display = "block";

            // Create li element
            const li = document.createElement("li");
            // Add class
            li.className = "collection-item";
            li.id = `item-${item.id}`;

            // Add HTML
            li.innerHTML = `
                <strong>${item.name}: </strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fas fa-pen-square"></i>
                </a>`
                ;
            // Insert to item list
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(element => {
                const itemID = element.getAttribute("id");
                console.log(item);
                if (itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                    <strong>${item.name}: </strong>
                    <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pen-square"></i>
                    </a>
                `;
                }
            })
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into an array
            listItems = Array.from(listItems);

            listItems.forEach(item => {
                item.remove();
            });
        },
        setInitialState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
    // Set initial state
    UICtrl.setInitialState();

    // Load Event Listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        // Disable submit on enter
        document.addEventListener("keypress", function (e) {
            if (e.keyCode === 13 || e.which === 13) { // If Enter key was pressed
                e.preventDefault();
                return false;
            }
        })

        // Edit icon click
        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);

        // Back btn event
        document.querySelector(UISelectors.backBtn).addEventListener("click", e => {
            UICtrl.setInitialState();
            e.preventDefault();
        });

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function (e) {

        // Get from input from UI Controller
        const input = UICtrl.getItemInput();
        if (input.name === "" || input.calories === "") {
            alert("Enter a Value!");
        } else {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            UICtrl.addListItem(newItem);

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add Total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Click edit item
    const itemEditClick = function (e) {
        e.preventDefault();
        if (e.target.classList.contains("edit-item")) {
            // Get list item id
            const listId = e.target.parentNode.parentNode.id;

            //Break into an array
            const listIdArr = listId.split("-");
            console.log(listIdArr);

            //Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            console.log(itemToEdit);

            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }
    }

    // Update item submit
    const itemUpdateSubmit = function (e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add Total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.setInitialState();

        e.preventDefault();
    }

    // Delete btn event
    const itemDeleteSubmit = function (e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete from data
        ItemCtrl.deleteItem(currentItem.id);

        // Delte from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add Total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.setInitialState();

        e.preventDefault();
    }

    // Clear items event
    const clearAllItemsClick = function () {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add Total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Remove from UI
        UICtrl.removeItems();

        // Hide list
        UICtrl.hideList();
    }

    // Public Methods
    return {
        init: function () {
            // Fetch Items from data
            const items = ItemCtrl.getItems();

            // Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate List with Items
                UICtrl.populateItemList(items);
            }

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            // Add Total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);


// Initialize App
App.init();