// I am using `const` for the `pets` array because I want to prevent reassignment of the entire array.
// However, using `const` still allows me to modify its contents (e.g., adding new pets using .push()).
const pets = [
    { name: 'Buddy', age: 3, gender: 'Male', service: 'Grooming', breed: 'Golden Retriever' },
    { name: 'Mittens', age: 2, gender: 'Female', service: 'Nail Clipping', breed: 'Siamese Cat' },
    { name: 'Rex', age: 5, gender: 'Male', service: 'Bathing', breed: 'Bulldog' }
];

// I chose `const` instead of `let` because I don't want to accidentally reassign the entire `pets` array.
// If I had used `let`, I could reassign it completely, which is not necessary for this project.
// Incorrect reassignment that `const` prevents:
// pets = [];  // ❌ This would throw an error because `pets` is a constant.

/**
 * Display the total number of registered pets
 */
function displayPetCount() {
    document.getElementById('petCount').textContent = `Total Registered Pets: ${pets.length}`;
}

/**
 * Display pet names dynamically in the HTML
 */
function displayPetNames() {
    const petNamesList = document.getElementById('petNamesList');
    petNamesList.innerHTML = ''; // Clear previous list

    for (let i = 0; i < pets.length; i++) {
        const pet = pets[i];
        const listItem = document.createElement('li');
        listItem.textContent = pet.name;
        petNamesList.appendChild(listItem);
    }
}

/**
 * Calculate and display the average pet age
 */
function displayAverageAge() {
    const totalAge = pets.reduce((sum, pet) => sum + pet.age, 0);
    const averageAge = (totalAge / pets.length).toFixed(2);
    document.getElementById('averageAge').textContent = `Average Age of Pets: ${averageAge} years`;
}

/**
 * Add a new pet from the registration form
 */
function registerPet(event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Get user input values
    const name = document.getElementById('petName').value;
    const age = parseInt(document.getElementById('petAge').value, 10);
    const gender = document.getElementById('petGender').value;
    const service = document.getElementById('petService').value;
    const breed = document.getElementById('petBreed').value;

    // Validate input (ensure name and breed are not empty)
    if (name.trim() === '' || breed.trim() === '' || isNaN(age) || age <= 0) {
        alert('Please fill out all fields correctly.');
        return;
    }

    // Create a new pet object
    const newPet = { name, age, gender, service, breed };

    // Add the new pet to the pets array
    pets.push(newPet);

    // Clear the form inputs
    document.getElementById('petForm').reset();

    // Update the displayed pet list and count
    displayPetCount();
    displayPetNames();
    displayAverageAge();
}

// Attach event listener to the registration form
document.addEventListener('DOMContentLoaded', () => {
    // Run initial display functions
    displayPetCount();
    displayPetNames();
    displayAverageAge();

    // Attach form submission event
    const petForm = document.getElementById('petForm');
    if (petForm) {
        petForm.addEventListener('submit', registerPet);
    }
});