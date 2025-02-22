// 🚀 services.js is loaded!
console.log("🚀 services.js is loaded!");

// 🏪 My Pet Salon Object (Stores Services)
const salon = {
    name: "Groomi by Descoteaux",
    services: JSON.parse(localStorage.getItem("salonServices")) || [] // 💾 Load services from storage with empty array
};

// 💾 Function to Save Services to Local Storage
function saveServicesToLocalStorage() {
    localStorage.setItem("salonServices", JSON.stringify(salon.services));
    console.log("💾 Services saved to localStorage:", salon.services);
}

// 🛠️ If Local Storage is Empty, Load Default Services
if (salon.services.length === 0) {
    console.log("📢 No services found, adding default services...");

    // ✅ Default Service List (Preloaded for Fresh Starts)
    const defaultServices = [
        {
            name: "Full Grooming",
            category: "🐾 Grooming Services",
            description: "Complete grooming package including bath, haircut, and nail trim.",
            price: "50.00",
            duration: "90 mins"
        },
        {
            name: "Regular Bath",
            category: "🚿 Bathing & Hygiene Services",
            description: "A refreshing bath with shampoo and conditioner.",
            price: "30.00",
            duration: "45 mins"
        },
        {
            name: "Nail Clipping",
            category: "✂️ Styling & Coat Care",
            description: "Trimming nails to keep your pet's paws healthy and comfortable.",
            price: "15.00",
            duration: "15 mins"
        },
        {
            name: "Overnight Stay",
            category: "🏡 Boarding & Daycare",
            description: "Comfortable overnight boarding with 24/7 care.",
            price: "70.00",
            duration: "1 Night"
        }
    ];

    // 🔄 Push Default Services to My Array
    salon.services.push(...defaultServices);
    
    // 💾 Save to Local Storage
    saveServicesToLocalStorage();

    console.log("✅ Default services added to localStorage!");
}

// 📂 Function to Load Services from Local Storage
function loadServicesFromLocalStorage() {
    salon.services = JSON.parse(localStorage.getItem("salonServices")) || [];
    console.log("📂 Loaded services:", salon.services); // 🔍 Debugging
}

// 🏗️ Constructor Function for Services
function Service(name, category, description, price, duration) {
    this.name = name;
    this.category = category;
    this.description = description;
    this.price = parseFloat(price).toFixed(2);
    this.duration = duration;
}
// 🖥️ Function to Display Services in the UI
function displayServices() {
    console.log("📢 displayServices() is running...");

    const serviceCardsContainer = document.getElementById("serviceCardsContainer");

    if (!serviceCardsContainer) {
        console.error("🚨 Error: `serviceCardsContainer` not found in the DOM.");
        return;
    }

    // 🗂 Load Latest Services from Storage
    loadServicesFromLocalStorage();
    console.log("🗂 Stored Services:", salon.services); // 🔍 Debugging local storage

    // ✨ Clear Existing Services Before Updating UI
    serviceCardsContainer.innerHTML = "";

    if (salon.services.length === 0) {
        console.warn("⚠ No services available!");
        serviceCardsContainer.innerHTML = `<p class="text-center">No services available.</p>`;
        return;
    }

    // 🔄 Loop Through Services & Render Cards
    salon.services.forEach((service, index) => {
        console.log(`✅ Rendering service: ${service.name}`); // 🔍 Debugging
        const categoryBadge = getCategoryBadge(service.category);

        const serviceCard = document.createElement("div");
        serviceCard.className = "col-md-4 mb-3";
        serviceCard.innerHTML = `
            <div class="card shadow-sm p-3">
                <h5 class="card-title">${service.name}</h5>
                <p><span class="badge ${categoryBadge}">${service.category}</span></p>
                <p class="card-text">${service.description}</p>
                <p><strong>Price:</strong> $${service.price}</p>
                <p><strong>Duration:</strong> ${service.duration}</p>
                <button class="btn btn-danger deleteService" data-index="${index}">Delete</button>
            </div>
        `;
        serviceCardsContainer.appendChild(serviceCard);
    });

    // 🗑️ Attach Delete Event to Each Button
    document.querySelectorAll(".deleteService").forEach(button => {
        button.addEventListener("click", function () {
            deleteService(this.dataset.index);
        });
    });

    // 🔢 Update Service Count
    document.getElementById("serviceCount").textContent = `Total Services: ${salon.services.length}`;
}

// 🏁 Ensure `displayServices()` Runs After DOM Loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("📢 Page Loaded – Displaying Services...");
    displayServices();
});

// 🎨 Function to Get Category Badge Color
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

// 🗑️ Delete a Service
function deleteService(index) {
    console.log(`🗑 Deleting service at index ${index}...`);
    salon.services.splice(index, 1);
    saveServicesToLocalStorage();
    displayServices();
}

// ✏️ Edit a Service (Populates Form for Editing)
function editService(index) {
    const service = salon.services[index];

    // ✍️ Populate Form Fields with Service Data
    document.getElementById("serviceName").value = service.name;
    document.getElementById("serviceCategory").value = service.category;
    document.getElementById("serviceDescription").value = service.description;
    document.getElementById("servicePrice").value = service.price;
    document.getElementById("serviceDuration").value = service.duration;

    // 🔄 Store Editing Index
    editingIndex = index;

    // 🔁 Change Button Text to "Update Service"
    document.querySelector("#addServiceBtn").textContent = "Update Service";
}

// 📝 Register New Service via Form Submission
$(document).ready(() => {
    console.log("📢 jQuery is ready, waiting for form submission...");

    $("#serviceForm").submit(function (event) {
        event.preventDefault();

        const name = $("#serviceName").val().trim();
        const description = $("#serviceDescription").val().trim();
        const price = parseFloat($("#servicePrice").val());
        const duration = $("#serviceDuration").val().trim();
        const category = $("#serviceCategory").val();

        if (!name || !description || !category || !duration || isNaN(price) || price <= 0) {
            showNotification("⚠ Please fill out all fields correctly.", "danger");
            return;
        }
        
        // ✅ Show Success Message
        showNotification("✅ Service added successfully!", "success");

// 🆕 Create a New Service Instance
    const newService = new Service(name, category, description, price, duration);

        // 💾 Add to Local Storage
        salon.services.push(newService);
        saveServicesToLocalStorage();

        console.log("✅ Service Added:", newService);

        // 🔄 Update UI
        displayServices();

        // 🧹 Clear Form
        $("#serviceForm")[0].reset();
        showNotification("✅ Service added successfully!", "success");
    });

    // 🖥️ Display Services on Page Load
    displayServices();
});

// 🔔 Show Notifications with jQuery
function showNotification(message, type) {
    const notification = $(`<div class="alert alert-${type}">${message}</div>`);
    $("#serviceNotification").html(notification).fadeIn();

    setTimeout(() => { 
        notification.fadeOut(() => { notification.remove(); }); 
    }, 3000);
}

// 🎬 Load Services & Display on Page Load
document.addEventListener("DOMContentLoaded", () => {
    console.log("📢 Page Loaded – Displaying Services...");
    displayServices();
});