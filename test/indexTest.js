document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");
    const baseURL = "http://localhost:3000/pups";
    let dogs = [];

    // Fetch dogs from the server
    function fetchDogs() {
        fetch(baseURL)
            .then(response => response.json())
            .then(data => {
                dogs = data;
                renderDogBar();
            })
            .catch(error => console.error('Error fetching dogs:', error));
    }

    // Render dog names in the dog bar
    function renderDogBar() {
        dogBar.innerHTML = "";
        dogs.forEach(dog => {
            const span = document.createElement("span");
            span.textContent = dog.name;
            span.dataset.id = dog.id;
            span.addEventListener("click", () => showDogInfo(dog.id));
            dogBar.appendChild(span);
        });
    }

    // Show more info about a dog when clicked
    function showDogInfo(dogId) {
        const dog = dogs.find(dog => dog.id == dogId);
        if (!dog) return;
        const buttonStatus = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
        dogInfo.innerHTML = `
            <img src="${dog.image}" />
            <h2>${dog.name}</h2>
            <button data-id="${dog.id}" data-status="${dog.isGoodDog}">${buttonStatus}</button>
        `;
        const dogButton = dogInfo.querySelector("button");
        dogButton.addEventListener("click", () => toggleDogStatus(dog));
    }

    // Toggle dog status (Good Dog / Bad Dog)
    function toggleDogStatus(dog) {
        dog.isGoodDog = !dog.isGoodDog;
        fetch(`${baseURL}/${dog.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ isGoodDog: dog.isGoodDog })
        })
        .then(response => response.json())
        .then(updatedDog => {
            const dogButton = dogInfo.querySelector("button");
            dogButton.textContent = updatedDog.isGoodDog ? "Good Dog!" : "Bad Dog!";
            dogButton.dataset.status = updatedDog.isGoodDog;
            const updatedDogIndex = dogs.findIndex(d => d.id == updatedDog.id);
            if (updatedDogIndex !== -1) {
                dogs[updatedDogIndex] = updatedDog;
            }
        })
        .catch(error => console.error('Error updating dog status:', error));
    }

    // Filter good dogs
    filterButton.addEventListener("click", () => {
        const filterStatus = filterButton.textContent.includes("ON");
        filterButton.textContent = `Filter good dogs: ${filterStatus ? "OFF" : "ON"}`;
        if (filterStatus) {
            const goodDogs = dogs.filter(dog => dog.isGoodDog);
            renderDogBar(goodDogs);
        } else {
            renderDogBar();
        }
    });

    // Initial fetch of dogs
    fetchDogs();
});
