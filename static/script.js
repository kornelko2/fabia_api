document.addEventListener('DOMContentLoaded', function() {
    const conversionTypeSelect = document.getElementById('conversion-type');
    const unitSelect = document.getElementById('unit');
    const scenarioContainer = document.getElementById('scenario-container');
    const valueInput = document.getElementById('value');
    const languageSelect = document.getElementById('language');
    const explanationSelect = document.getElementById('explanation');
    const iframeCodeTextarea = document.getElementById('iframe-code');

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

        let apiUrl = `/convert/${conversionType}/${value}?unit=${unit}`;

        if (conversionType === 'area') {
            apiUrl += `&scenario=${scenario}`;
        }

        try {
            const response = await fetch(apiUrl);
            const result = await response.json();

            document.getElementById('result').innerHTML = `
                <h2>Result</h2>
                <p>${new Intl.NumberFormat().format(value)} ${unit} ${conversionType} is approximately ${new Intl.NumberFormat().format(result.fabia_units)} Škoda Fabia 1.2 HTP units.</p>
            `;
        } catch (error) {
            document.getElementById('result').innerHTML = `
                <h2>Error</h2>
                <p>There was an error processing your request. Please try again.</p>
            `;
        }
    });

    document.getElementById('generate-iframe').addEventListener('click', function() {
        const conversionType = document.getElementById('conversion-type').value;
        const unit = document.getElementById('unit').value;
        const value = valueInput.value;
        const scenario = document.getElementById('scenario').value;
        const language = languageSelect.value;
        const explanation = explanationSelect.value;

        let iframeSrc = `/convert/${conversionType}/${value}?unit=${unit}&language=${language}&explanation=${explanation}`;

        if (conversionType === 'area') {
            iframeSrc += `&scenario=${scenario}`;
        }

        const iframeCode = `<iframe src="${iframeSrc}" width="600" height="400"></iframe>`;
        iframeCodeTextarea.value = iframeCode;
    });
});