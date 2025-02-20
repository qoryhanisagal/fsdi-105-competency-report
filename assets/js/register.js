// 🔹 I created an object literal to store my pet salon information
const petSalon = {
    name: "Groomi by Descoteaux",
    pets: JSON.parse(localStorage.getItem("registeredPets")) || [], // I make sure pets load from localStorage if they exist
    services: {
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
function Pet(firstName, lastName, age, gender, breed, category, service, type, color) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
    this.breed = breed;
    this.category = category;
    this.service = service;
    this.type = type;
    this.color = color;
}

// 🔹 I created this function to save my pets to localStorage
function savePetsToLocalStorage() {
    localStorage.setItem("registeredPets", JSON.stringify(petSalon.pets));
}

// 🔹 I use this function to populate the dropdown based on service category
function loadServicesForDropdown(category) {
    const petServiceDropdown = document.getElementById("petService");
    petServiceDropdown.innerHTML = ""; // I clear existing options before loading new ones

    if (petSalon.services[category]) {
        petSalon.services[category].forEach(service => {
            petServiceDropdown.append(new Option(service.name, service.name));
        });
    } else {
        petServiceDropdown.append(new Option("No services available", ""));
    }
}

// 🔹 This event listener makes sure the correct services load when a category is selected
document.getElementById("serviceCategory").addEventListener("change", function () {
    loadServicesForDropdown(this.value);
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

    // 🔹 I added validation to ensure all fields are properly filled
    if (firstName === "" || lastName === "" || isNaN(age) || age <= 0 || breed === "" || service === "" || color === "") {
        showNotification("All fields are required, and age must be a valid number.", "danger");
        return;
    }

    // 🔹 I create a new Pet object using the constructor
    const newPet = new Pet(firstName, lastName, age, gender, breed, category, service, type, color);
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
                <td><button class="btn btn-danger deletePet" data-index="${index}">Delete</button></td>
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

// 🔹 I ensure that the pets and services are loaded when the page is opened
document.addEventListener("DOMContentLoaded", () => {
    loadPetsFromLocalStorage();
    displayRegisteredPets();
    loadServicesForDropdown(document.getElementById("serviceCategory").value);
});