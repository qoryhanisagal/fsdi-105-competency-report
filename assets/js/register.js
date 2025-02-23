// 🔹 I created an object literal to store my pet salon information
const petSalon = {
    name: "Groomi by Descoteaux",
    pets: JSON.parse(localStorage.getItem("registeredPets")) || [], // I make sure pets load from localStorage if they exist
    services: JSON.parse(localStorage.getItem("salonServices")) || { // ✅ Load services dynamically from localStorage
        "Grooming Services": [
            { name: "Full Grooming" },
            { name: "Hair Trimming" },
            { name: "De-shedding Treatment" }
        ],
        "Bathing & Hygiene Services": [
            { name: "Regular Bath" },
            { name: "Medicated Bath" },
            { name: "Ear Cleaning" }
        ],
        "Styling & Coat Care": [
            { name: "Creative Coloring" },
            { name: "Fur Styling" },
            { name: "Nail Painting" }
        ]
    }
};

// 🔹 I use a constructor function to ensure that all pets follow the same structure
function Pet(firstName, lastName, age, gender, breed, category, service, type, color, phoneNumber) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
    this.breed = breed;
    this.category = category;
    this.service = service;
    this.type = type;
    this.color = color;
    this.phoneNumber = phoneNumber; // Add phone number
}

// 🔹 I created this function to save my pets to localStorage
function savePetsToLocalStorage() {
    localStorage.setItem("registeredPets", JSON.stringify(petSalon.pets));
}

// 🔹 I use this function to populate the services dropdown based on the selected category
function loadServicesForDropdown(category) {
    const petServiceDropdown = document.getElementById("petService");
    petServiceDropdown.innerHTML = ""; // 🔹 Clear existing options

    // ✅ Load all stored services from localStorage
    const storedServices = JSON.parse(localStorage.getItem("salonServices")) || [];

    // ✅ Filter services that belong to the selected category
    const filteredServices = storedServices.filter(service => service.category === category);

    if (filteredServices.length === 0) {
        petServiceDropdown.innerHTML = "<option value=''>No services available</option>";
        return;
    }

    // ✅ Populate the dropdown with services in the selected category
    filteredServices.forEach(service => {
        petServiceDropdown.append(new Option(service.name, service.name));
    });
}

// 🔹 This event listener updates the service dropdown when a category is selected
document.getElementById("serviceCategory").addEventListener("change", function () {
    loadServicesForDropdown(this.value); // ✅ Dynamically update the service dropdown
});

// ✅ Ensure services load when the page is opened
document.addEventListener("DOMContentLoaded", () => {
    loadPetsFromLocalStorage();
    displayRegisteredPets();
});

// 🔹 I created a function to display alerts using jQuery for better UI experience
function showNotification(message, type) {
    const notification = $(`<div class="alert alert-${type}">${message}</div>`);
    $("#petNotification").html(notification);
    setTimeout(() => {
        notification.fadeOut();
    }, 3000);
}

// 🔹 This function registers a new pet
document.getElementById("petForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // 🔹 I retrieve the form values from user input
    const firstName = document.getElementById("petFirstName").value.trim();
    const lastName = document.getElementById("petLastName").value.trim();
    const age = parseInt(document.getElementById("petAge").value, 10);
    const gender = document.getElementById("petGender").value;
    const breed = document.getElementById("petBreed").value.trim();
    const category = document.getElementById("serviceCategory").value;
    const service = document.getElementById("petService").value;
    const type = document.getElementById("petType").value;
    const color = document.getElementById("petColor").value.trim();
    const phoneNumber = document.getElementById("petPhoneNumber").value.trim();

// 🔹 I added validation to ensure all fields are properly filled
if (firstName === "" || lastName === "" || isNaN(age) || age <= 0 || breed === "" || service === "" || color === "" || phoneNumber === "") {
    showNotification("All fields are required, and age must be a valid number.", "danger");
    return;
}

    // 🔹 I create a new Pet object using the constructor
    const newPet = new Pet(firstName, lastName, age, gender, breed, category, service, type, color, phoneNumber);
    petSalon.pets.push(newPet); // I add the new pet to my pets array

    // 🔹 I save the updated pets list to localStorage
    savePetsToLocalStorage();

    // 🔹 I reload pets from localStorage to ensure the latest data is displayed
    loadPetsFromLocalStorage();
    displayRegisteredPets();

    // 🔹 I show a success notification to let the user know the pet was added
    showNotification("Pet registered successfully!", "success");

    // 🔹 I clear the form fields after successful registration
    document.getElementById("petForm").reset();
});

// 🔹 This function loads pets from localStorage to keep data persistent
function loadPetsFromLocalStorage() {
    petSalon.pets = JSON.parse(localStorage.getItem("registeredPets")) || [];
}

// 🔹 I use this function to display the registered pets in the UI
function displayRegisteredPets() {
    const petTableBody = document.getElementById("petTableBody");
    petTableBody.innerHTML = ""; // I clear previous entries before displaying new data

    if (petSalon.pets.length === 0) {
        document.getElementById("petCount").textContent = "Total Registered Pets: 0";
        return;
    }

    petSalon.pets.forEach((pet, index) => {
        const row = `
            <tr>
                <td>${pet.firstName}</td>
                <td>${pet.lastName}</td>
                <td>${pet.age}</td>
                <td>${pet.gender}</td>
                <td>${pet.breed}</td>
                <td><span class="badge ${getCategoryBadge(pet.category)}">${pet.category}</span></td>
                <td>${pet.service}</td>
                <td>${pet.type}</td>
                <td>${pet.color}</td>
                <td>${pet.phoneNumber || 'N/A'}</td> <!-- Ensure phone number is displayed -->
                <td>
                    <button class="btn btn-warning editPet" data-index="${index}">Edit</button>
                    <button class="btn btn-danger deletePet" data-index="${index}">Delete</button>
                </td>
            </tr>
        `;
        petTableBody.innerHTML += row;
    });

    document.getElementById("petCount").textContent = `Total Registered Pets: ${petSalon.pets.length}`;

    // 🔹 I attach the delete event to each pet so users can remove them dynamically
    document.querySelectorAll(".deletePet").forEach(button => {
        button.addEventListener("click", function () {
            deletePet(this.dataset.index);
        });
    });

    // 🔹 I attach edit event to each edit button
    document.querySelectorAll(".editPet").forEach(button => {
        button.addEventListener("click", function () {
            editPet(this.dataset.index);
        });
    });
}

// 🔹 This function assigns a category badge color based on the service type
function getCategoryBadge(category) {
    switch (category) {
        case "Grooming Services":
            return "bg-primary";
        case "Bathing & Hygiene Services":
            return "bg-success";
        case "Styling & Coat Care":
            return "bg-warning text-dark";
        default:
            return "bg-secondary";
    }
}

// 🔹 This function deletes a pet and updates localStorage
function deletePet(index) {
    petSalon.pets.splice(index, 1);
    savePetsToLocalStorage();
    displayRegisteredPets();
}
// 🔹 This function edits a pet and updates localStorage
function editPet(index) {
    const pet = petSalon.pets[index];

    // Fill the form with the current pet's data
    document.getElementById("petFirstName").value = pet.firstName;
    document.getElementById("petLastName").value = pet.lastName;
    document.getElementById("petAge").value = pet.age;
    document.getElementById("petGender").value = pet.gender;
    document.getElementById("petBreed").value = pet.breed;
    document.getElementById("serviceCategory").value = pet.category;
    document.getElementById("petService").value = pet.service;
    document.getElementById("petType").value = pet.type;
    document.getElementById("petColor").value = pet.color;
    document.getElementById("petPhoneNumber").value = pet.phoneNumber; // Ensure the phone number field is populated

    // Add a hidden input to keep track of the pet's index (for later updating)
    const petIndexInput = document.getElementById("petIndex");
    if (!petIndexInput) {
        const hiddenIndexInput = document.createElement("input");
        hiddenIndexInput.type = "hidden";
        hiddenIndexInput.id = "petIndex";
        hiddenIndexInput.name = "petIndex";
        document.getElementById("petForm").appendChild(hiddenIndexInput);
    }
    document.getElementById("petIndex").value = index;
}

// ✅ Call function on page load to load services into dropdown
document.addEventListener("DOMContentLoaded", () => {
    loadPetsFromLocalStorage();
    displayRegisteredPets();
    loadServicesForDropdown(); // ✅ Load services into dropdown on register page
});