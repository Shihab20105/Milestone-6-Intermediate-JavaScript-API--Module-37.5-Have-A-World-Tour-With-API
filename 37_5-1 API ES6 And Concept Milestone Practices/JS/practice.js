/*                      37_5-1 API ES6 and concept milestone practices */


// Load Billionaires
const loadBillionaires = async (searchText, dataLimit) => {
    const url = `https://forbes400.onrender.com/api/forbes400`;
    const res = await fetch(url);
    const data = await res.json();

    // Filter if search text exists
    let filtered = data;
    if (searchText) {
        filtered = data.filter(b =>
            b.personName.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    displayBillionaires(filtered, dataLimit);
};

// Display Billionaires
const displayBillionaires = (billionaires, dataLimit) => {
    const billionairesContainer = document.getElementById('billionaires-container');
    billionairesContainer.textContent = '';

    const showAll = document.getElementById('show-all');

    if (dataLimit && billionaires.length > 10) {
        billionaires = billionaires.slice(0, 10);
        showAll.classList.remove('d-none');
    } else {
        showAll.classList.add('d-none');
    }

    const noBillionaires = document.getElementById('no-found-message');
    if (billionaires.length === 0) {
        noBillionaires.classList.remove('d-none');
    } else {
        noBillionaires.classList.add('d-none');
    }

    billionaires.forEach(billionaire => {
        const billionaireDiv = document.createElement('div');
        billionaireDiv.classList.add('col');
        billionaireDiv.innerHTML = `
        <div class="card p-3 h-100">
            <img src="${billionaire.squareImage || 'https://via.placeholder.com/150'}"
                 class="card-img-top" alt="${billionaire.personName}">
            <div class="card-body">
                <h5 class="card-title">${billionaire.personName}</h5>
                <p class="card-text">Net Worth: $${billionaire.finalWorth} Billion</p>
                <p class="card-text"><small>${billionaire.industries.join(', ')}</small></p>
                <button onclick="loadBillionaireDetails('${billionaire.personName}')"
                    class="btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#billionaireDetailModal">Show Details</button>
            </div>
        </div>
        `;
        billionairesContainer.appendChild(billionaireDiv);
    });

    toggleSpinner(false);
};


// Process Search
const processSearch = (dataLimit) => {
    toggleSpinner(true);
    const searchField = document.getElementById('search-field');
    let searchText = searchField.value.trim();

    // If search is empty OR equals "billionaire", just show top billionaires
    if (searchText === "" || searchText.toLowerCase() === "billionaire") {
        searchText = ""; // ignore and show default list
    }

    loadBillionaires(searchText, dataLimit);
};


// Search Button Click
document.getElementById('btn-search').addEventListener('click', function () {
    processSearch(10);
});

// Enter Key Search
document.getElementById('search-field').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        processSearch(10);
    }
});

// Spinner
const toggleSpinner = isLoading => {
    const loaderSection = document.getElementById('loader');
    if (isLoading) loaderSection.classList.remove('d-none');
    else loaderSection.classList.add('d-none');
};

// Show All Button
document.getElementById('btn-show-all').addEventListener('click', function () {
    processSearch();
});

// Load Billionaire Details
const loadBillionaireDetails = async (name) => {
    const url = `https://forbes400.onrender.com/api/forbes400`;
    const res = await fetch(url);
    const data = await res.json();
    const billionaire = data.find(b => b.personName === name);
    displayBillionaireDetails(billionaire);
};

// Display Billionaire Details in Modal
const displayBillionaireDetails = billionaire => {
    const modalTitle = document.getElementById('billionaireDetailModalLabel');
    modalTitle.innerText = billionaire.personName;

    const details = document.getElementById('billionaire-details');
    details.innerHTML = `
        <p><strong>Net Worth:</strong> $${billionaire.finalWorth} Billion</p>
        <p><strong>Industries:</strong> ${billionaire.industries.join(', ')}</p>
        <p><strong>Country:</strong> ${billionaire.countryOfCitizenship}</p>
        <p><strong>Rank:</strong> ${billionaire.rank}</p>
        <p><strong>Bio:</strong> ${billionaire.bios ? billionaire.bios[0] : 'No bio available'}</p>
    `;
};

// Initial Load (first 10 billionaires)
loadBillionaires("", 10);

