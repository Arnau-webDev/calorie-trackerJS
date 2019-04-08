
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
        logData: function () {
            return data;
        }
    }
})();

// UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories"
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
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        getSelectors: function () {
            return UISelectors;
        }
    }
})();

// App Controller
const App = (function (ItemCtrl, UICtrl) {
    // Load Event Listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit)
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

            // Clear fields
            UICtrl.clearInput();
        }

        e.preventDefault();
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

            // Load event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);


// Initialize App
App.init();