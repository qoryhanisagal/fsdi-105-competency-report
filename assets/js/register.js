/**
 * I created a `Pet` constructor function to ensure that every pet object
 * follows the same structure. This allows me to easily create and manage new pets dynamically.
 */
function Pet(firstName, lastName, age, gender, breed, service, type, color) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.gender = gender;
    this.breed = breed;
    this.service = service;
    this.type = type;
    this.color = color; // ✅ This stores the color
}


/**
 * I created an array called `pets` to store all registered pets.
 * Instead of manually writing pet objects, I use the `Pet` constructor to create them.
 */
const pets = [
    new Pet('Buddy', 'Smith', 3, 'Male', 'Golden Retriever', 'Grooming', 'Dog', 'Golden'), 
    new Pet('Mittens', 'Johnson', 2, 'Female', 'Siamese Cat', 'Nail Clipping', 'Cat', 'White'),
    new Pet('Rex', 'Brown', 5, 'Male', 'Bulldog', 'Bathing', 'Dog', 'Brown')
];

/**
 * I renamed `displayPet()` to `displayRow()` to align with the new requirement
 * of displaying pets inside a table instead of a list.
 * This function dynamically updates the `<tbody>` of the table.
 */
function displayRow() {
    const petTableBody = document.getElementById('petTableBody');
    petTableBody.innerHTML = ''; // I clear the table first to prevent duplicates.

    console.log("Current pets array:", pets); // ✅ Check if pets exist in the console

    // I loop through the `pets` array and create table rows dynamically.
    for (let i = 0; i < pets.length; i++) {
        const pet = pets[i];

        // Creating a row using template literals for cleaner HTML insertion.
        const row = `<tr>
            <td>${pet.firstName}</td>
            <td>${pet.lastName}</td>
            <td>${pet.age}</td>
            <td>${pet.gender}</td>
            <td>${pet.breed}</td>
            <td>${pet.service}</td>
            <td>${pet.type}</td>
            <td>${pet.color}</td>
            <td><button class="btn btn-danger" onclick="deletePet(${i})">Delete</button></td>
        </tr>`;

        petTableBody.innerHTML += row; // I add each new row to the table.
    }
    document.getElementById('petCount').textContent = `Total Registered Pets: ${pets.length}`;
}

/**
 * This function registers a new pet using user input from the form.
 * It creates a new pet object, adds it to the `pets` array, updates the UI, and clears the form.
 */
function registerPet(event) {
    event.preventDefault(); // I use `preventDefault()` to stop the form from refreshing the page.

    // Retrieving values from the input fields
    const firstName = document.getElementById('petFirstName').value;
    const lastName = document.getElementById('petLastName').value;
    const age = parseInt(document.getElementById('petAge').value, 10);
    const gender = document.getElementById('petGender').value;
    const service = document.getElementById('petService').value;
    const breed = document.getElementById('petBreed').value;
    const type = document.getElementById('petType').value;
    const color = document.getElementById('petColor').value; // Get color input

    /**
     * Input validation:
     * - Ensures name and breed fields are not empty.
     * - Ensures age is a positive number.
     * - If validation fails, an alert message is shown and the function stops execution.
     */
    if (firstName.trim() === '' || lastName.trim() === '' || breed.trim() === '' || color.trim() === '' || isNaN(age) || age <= 0) {
        alert('Please fill out all fields correctly.');
        return;
    }

    // Creating a new pet object using the `Pet` constructor
    const newPet = new Pet(firstName, lastName, age, gender, breed, service, type, color);

    // Add the new pet to the array

    // I add the new pet to the `pets` array
    pets.push(newPet);

    // Clearing the form fields after successful registration
    document.getElementById('petForm').reset();

    // Updating the table with the newly registered pet
    displayRow();
}
/**
 * Function to delete a pet
 */
function deletePet(index) {
    pets.splice(index, 1); // Remove pet from the array
    displayRow(); // Update table
}

/**
 * I use an event listener to ensure that the table loads correctly when the page opens.
 * This prevents errors where elements might not be ready when JavaScript runs.
 */
document.addEventListener('DOMContentLoaded', () => {
    displayRow(); // This should display any pets in the array when the page loads.
    document.getElementById('petForm').addEventListener('submit', registerPet);
});