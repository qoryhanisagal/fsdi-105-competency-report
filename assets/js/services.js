// 🔹 Object Literal for Salon (Stores services)
const salon = {
    name: "Groomi by Descoteaux",
    services: JSON.parse(localStorage.getItem("salonServices")) || [] // ✅ Load services from storage or set empty
};

// 🔹 Save Services to Local Storage
function saveServicesToLocalStorage() {
    localStorage.setItem("salonServices", JSON.stringify(salon.services));
}

// 🔹 Register New Service (Using jQuery)
$(document).ready(() => {
    $("#serviceForm").submit(function (event) {
        event.preventDefault();

        // Retrieve form values
        const name = $("#serviceName").val().trim();
        const description = $("#serviceDescription").val().trim();
        const price = parseFloat($("#servicePrice").val());
        const duration = $("#serviceDuration").val().trim();
        const category = $("#serviceCategory").val(); // ✅ Category stored exactly as selected

        // 🔹 Validation
        if (name === "" || description === "" || isNaN(price) || price <= 0 || duration === "" || category === "") {
            showNotification("All fields are required, and price must be valid.", "danger");
            return;
        }

        // ✅ Create a new Service object
        const newService = {
            name: name,
            category: category,
            description: description,
            price: parseFloat(price).toFixed(2), // ✅ Ensures correct price format
            duration: duration
        };

        // ✅ Add new service to the array
        salon.services.push(newService);

        // ✅ Save Services to Local Storage
        saveServicesToLocalStorage();

        // ✅ Show success message
        showNotification("Service added successfully!", "success");

        // ✅ Clear the form fields
        $("#serviceForm")[0].reset();

        // ✅ Reload services from storage & Update UI
        displayServices();
    });

    // ✅ Load stored services & display them on page load
    displayServices();
});

// 🔹 Function to Display Services as Cards
function displayServices() {
    const serviceCardsContainer = document.getElementById("serviceCardsContainer");

    // ✅ Ensure container exists before modifying it
    if (!serviceCardsContainer) {
        console.error("Error: `serviceCardsContainer` not found in the DOM.");
        return;
    }

    // ✅ Reload the latest services from localStorage
    salon.services = JSON.parse(localStorage.getItem("salonServices")) || [];

    serviceCardsContainer.innerHTML = ""; // ✅ Clear existing services

    if (salon.services.length === 0) {
        serviceCardsContainer.innerHTML = `<p class="text-center">No services available.</p>`;
        return;
    }

    salon.services.forEach((service, index) => {
        const categoryBadge = getCategoryBadge(service.category); // ✅ Get category badge

        const serviceCard = `
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm p-3">
                    <h5 class="card-title">${service.name}</h5>
                    <p><span class="badge ${categoryBadge}">${service.category}</span></p>
                    <p class="card-text">${service.description}</p>
                    <p><strong>Price:</strong> $${service.price}</p>
                    <p><strong>Duration:</strong> ${service.duration}</p>
                    <button class="btn btn-danger deleteService" data-index="${index}">Delete</button>
                </div>
            </div>
        `;
        serviceCardsContainer.innerHTML += serviceCard;
    });

    // ✅ Attach delete event to buttons
    document.querySelectorAll(".deleteService").forEach(button => {
        button.addEventListener("click", function () {
            deleteService(this.dataset.index);
        });
    });

    // ✅ Update Service Count
    document.getElementById("serviceCount").textContent = `Total Services: ${salon.services.length}`;
}

// 🔹 Function to Get Category Badge Color
function getCategoryBadge(category) {
    switch (category) {
        case "🐾 Grooming Services":
            return "bg-primary text-white";
        case "🚿 Bathing & Hygiene Services":
            return "bg-success text-white";
        case "✂️ Styling & Coat Care":
            return "bg-warning text-dark";
        case "🐶 Specialty Services":
            return "bg-info text-white";
        case "🏡 Boarding & Daycare":
            return "bg-secondary text-white";
        case "🎾 Fun & Wellness Services":
            return "bg-danger text-white";
        case "🩺 Health & Maintenance Services":
            return "bg-dark text-white";
        default:
            return "bg-light text-dark";
    }
}

// 🔹 Function to Delete a Service
function deleteService(index) {
    salon.services.splice(index, 1); // ✅ Remove service from array
    saveServicesToLocalStorage(); // ✅ Update local storage
    displayServices(); // ✅ Refresh UI
}

// 🔹 Function to Show Notifications Using jQuery
function showNotification(message, type) {
    const notification = $(`<div class="alert alert-${type}">${message}</div>`);
    $("#serviceNotification").html(notification);
    setTimeout(() => { notification.fadeOut(); }, 3000);
}