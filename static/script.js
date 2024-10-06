document.addEventListener('DOMContentLoaded', function() {
    const conversionTypeSelect = document.getElementById('conversion-type');
    const unitSelect = document.getElementById('unit');
    const scenarioContainer = document.getElementById('scenario-container');
    const valueInput = document.getElementById('value');
    const languageSelect = document.getElementById('language');
    const explanationSelect = document.getElementById('explanation');

    const unitOptions = {
        mass: ['kg', 't', 'g', 'mg', 'lbs', 'oz'],
        length: ['m', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'],
        width: ['m', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'],
        height: ['m', 'cm', 'mm', 'in', 'ft', 'yd', 'mi'],
        area: ['m2', 'cm2', 'mm2', 'ft2', 'in2', 'yd2', 'ha', 'acre'],
        power: ['kW', 'hp', 'W', 'MW']
    };

    function updateUnitOptions() {
        const selectedType = conversionTypeSelect.value;
        unitSelect.innerHTML = '';
        unitOptions[selectedType].forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit;
            unitSelect.appendChild(option);
        });

        // Show or hide the scenario container based on the selected type
        if (selectedType === 'area') {
            scenarioContainer.style.display = 'block';
        } else {
            scenarioContainer.style.display = 'none';
        }
    }

    conversionTypeSelect.addEventListener('change', updateUnitOptions);

    // Initialize unit options on page load
    updateUnitOptions();

    // Set default value to 100
    valueInput.value = 100;

    document.getElementById('converter-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const conversionType = document.getElementById('conversion-type').value;
        const unit = document.getElementById('unit').value;
        const value = valueInput.value;
        const scenario = document.getElementById('scenario').value;
        const language = languageSelect.value;
        const explanation = explanationSelect.value;

        // Construct the URL for the embed endpoint
        const url = `/embed?value=${value}&conversion_type=${conversionType}&unit=${unit}&scenario=${scenario}&lng=${language}&explanation=${explanation}`;

        try {
            const response = await fetch(url);
            const result = await response.text();

            document.getElementById('result').innerHTML = result;
        } catch (error) {
            document.getElementById('result').innerHTML = `
                <h2>Error</h2>
                <p>There was an error processing your request. Please try again.</p>
            `;
        }
    });

    // Initialize i18next for translations
    i18next
        .use(i18nextBrowserLanguageDetector)
        .use(i18nextHttpBackend)
        .init({
            fallbackLng: 'en',
            debug: true,
            backend: {
                loadPath: '/locale/{{lng}}/translation.json'
            }
        }, function(err, t) {
            if (err) {
                console.error('Error loading translations:', err);
            } else {
                // Initialize the UI with the translated text
                document.querySelectorAll('[data-i18n]').forEach(function(element) {
                    element.innerHTML = t(element.getAttribute('data-i18n'));
                });
            }
        });

    // Handle language change
    languageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        i18next.changeLanguage(selectedLanguage, function(err, t) {
            if (err) {
                console.error('Error changing language:', err);
            } else {
                // Update the UI with the new language
                document.querySelectorAll('[data-i18n]').forEach(function(element) {
                    element.innerHTML = t(element.getAttribute('data-i18n'));
                });
            }
        });
    });
});