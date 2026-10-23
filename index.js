// Description: Multi-select Dropdown for Event Selection
// Use: Replaces a standard <select> element with a multi-select dropdown of checkboxes
// Edge Case: HTML checkboxes are left if they have javascript turned off. 
//
// This script replaces the select element with a multi-select dropdown of checkboxes.
// Turn the "Event" dropdown into a dropdown of checkboxes so users can pick multiple events
//
document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('event');               // --- get the select element with id "event"
    if (!select) return;                                           // --- if the select element doesn't exist, exit

    const wrapper = document.createElement('div');                 // --- create a wrapper div for the multi-select
    wrapper.className = 'multi-select';                            // --- assign a class to the wrapper for styling

    // Button that opens/closes the list (keeps the id so the <label for="event"> still works)
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = select.id;                                         // select is "select the event"
    toggle.className = 'multi-select-toggle';                      // toggles open the multi-select dropdown
    toggle.setAttribute('aria-expanded', 'false');                 // Not expanded by default

    // Container to hold the options that a user can select
    const panel = document.createElement('div');                   // --- create a panel to hold the checkboxes
    panel.className = 'multi-select-panel';                        // --- assign a class to the panel for styling
    panel.hidden = true;                                           // --- hide the panel by default


    const placeholder = select.options[0].textContent.trim();      // --- Grab placeholder text from the first option
                                                                   // -- this will be used as button for toggling mult-select 
 
    // Build one checkbox per option, 
    // skipping the "Select an event" placeholder
    for (const option of select.options) {                         // --- for each of the select element's options
        if (option.disabled || option.value === '') continue;      // --- if it's disabled or empty (placeholder), skip it

        const label = document.createElement('label');             // --- create a label for each checkbox
        const checkbox = document.createElement('input');          // --- create a checkbox input for the option
        checkbox.type = 'checkbox';                                // --- set the input type to checkbox
        checkbox.name = 'event';                                   // --- set the name attribute for the checkbox
        checkbox.value = option.value;                             // --- set the value attribute for the checkbox
        label.appendChild(checkbox);                               // --- add the checkbox to the label
        label.append(' ' + option.textContent.trim());             // --- add the option text next to the checkbox
        panel.appendChild(label);                                  // --- add the label (with checkbox) to the panel
    }

    // Show what's been picked on the button
    function updateToggleText() {
        const checked = panel.querySelectorAll('input:checked');         // --- get all events that are checked
        if (checked.length === 0) {                                      // ---when nothing is checked
            toggle.textContent = placeholder;                            // --- show the placeholder text when no events are selected
        } else if (checked.length === 1) {                               // --- when exactly one event is checked
            toggle.textContent = checked[0].value;                       // --- show the value of the single selected event
        } else {                                                         // --- when more than one event is checked
            toggle.textContent = checked.length + ' events selected';    // --- show the number of selected events
        }
    }

    function setOpen(open) {
        panel.hidden = !open;                                    // --- hidden panel is not open
        toggle.setAttribute('aria-expanded', String(open));      // --- update the aria-expanded attribute on the toggle button
    }

    toggle.addEventListener('click', function () {               // --- Each click toggles to opposite state
        setOpen(panel.hidden);
    });

    panel.addEventListener('change', updateToggleText);          // --- update toggle text when the selection changes

    // Close when clicking anywhere outside the dropdown
    document.addEventListener('click', function (e) {            // --- when something is clicked,
        if (!wrapper.contains(e.target)) setOpen(false);         // --- if the wrapper does not contain what is clicked
    });                                                          // --- then close the dropdown!

    // Close with the Escape key
    wrapper.addEventListener('keydown', function (e) {           // --- something for the keybaord warriors 
        if (e.key === 'Escape') {                                // --- if the Escape key is pressed
            setOpen(false);                                      // --- close the dropdown by setting setOpen to false
            toggle.focus();                                      // --- move focus back to the toggle button after closing the dropdown
        }
    });

    // Assemble the new dropdown component
    wrapper.appendChild(toggle);          // --- add the toggle button to the wrapper
    wrapper.appendChild(panel);           // --- add the panel to the wrapper
    select.replaceWith(wrapper);          // --- replace the original select element with the wrapper
    updateToggleText();                   // --- initialize the toggle text based on the current selection
});

// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------

// Hamburger menu: on small screens, hide the nav links behind a ☰ button
document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.nav');                // --- assign the navigation element to the variable 'nav'
    if (!nav) return;

    const menu = nav.querySelector('ul');                      // --- assign the ul of nav links to var 'menu'
    menu.id = 'nav-menu';                                      // --- set the id of the menu to 'nav-menu'

    const menuButton = document.createElement('button');       // --- creates a button for nav bar on small screens
    menuButton.type = 'button';                                // --- set the type of the button to 'button' to prevent form submission if inside a form
    menuButton.className = 'nav-toggle';                       // --- set the class of the button to 'nav-toggle' for styling purposes
    menuButton.textContent = '☰';                             // --- icanhaz cheezeburger   
    // .setAttribute('aria-label', 'Open menu'); is for screen reader
    menuButton.setAttribute('aria-label', 'Open menu');        // --- set the aria-label for screen readers
    menuButton.setAttribute('aria-controls', 'nav-menu');      // --- associate the button with the menu it controls
    menuButton.setAttribute('aria-expanded', 'false');         // --- indicate that the menu is initially collapsed

    // Only collapse the links once JavaScript is running, so the nav still works without it
    nav.classList.add('nav-collapsible');

    // Add click event listener to the menu button and update its state based on whether the menu is open or closed
    menuButton.addEventListener('click', function () {         // --- toggle the menu open/closed when the button is clicked
        const isOpen = nav.classList.toggle('open');           // --- toggle the 'open' class on the nav to show/hide the menu
        menuButton.textContent = isOpen ? '✕' : '☰';          // --- change the button text based on whether the menu is open or closed
        menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');   // --- update the aria-label based on the menu state
        menuButton.setAttribute('aria-expanded', String(isOpen));                     // --- update the aria-expanded attribute based on the menu state
    });

    // Put the button between the logo and the links
    nav.insertBefore(menuButton, menu);
});

// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------
//
// Form validation for the inquiry form on the events page
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('inquiry-form');
    if (!form) return;

    const status = document.getElementById('form-status');

    // The required fields and the message to show for each kind of problem
    // fields is an array of objects. 
    const fields = [
        {
            input: document.getElementById('name'),
            missing: 'Please enter your name.',
            invalid: 'Your name must be at least 2 characters.'
        },
        {
            input: document.getElementById('email'),
            missing: 'Please enter your email address.',
            invalid: 'Please enter a valid email, e.g. name@example.com.'
        },
        {
            input: document.getElementById('phone'),
            missing: 'Please enter your phone number.',
            invalid: 'Please enter a valid phone number, e.g. (123) 456-7890.'
        },
        {
            input: document.getElementById('consent'),
            missing: 'Please check this box so we can contact you.'
        }
    ];

    // Check one field against its HTML rules (required, minlength, type="email", pattern)
    // Returns true if it's valid, and shows or clears its error message
    function validateField(field) {
        const input = field.input;
        const errorMessage = document.getElementById(input.id + '-error');
        let message = '';

        // For text fields, ignore spaces typed on their own
        if (input.type !== 'checkbox') {
            input.value = input.value.trim();
        }

        if (input.validity.valueMissing) {
            message = field.missing;
        } else if (!input.validity.valid || (input.minLength > 0 && input.value.length < input.minLength)) {
            message = field.invalid;
        }

        errorMessage.textContent = message;
        input.classList.toggle('invalid', message !== '');
        input.setAttribute('aria-invalid', String(message !== ''));
        return message === '';
    }

    // Check a field again when the user leaves it, and clear its error as soon as it's fixed
    fields.forEach(function (field) {
        field.input.addEventListener('blur', function () {
            validateField(field);
        });
        field.input.addEventListener('input', function () {
            if (field.input.classList.contains('invalid')) validateField(field);
        });
        field.input.addEventListener('change', function () {
            if (field.input.classList.contains('invalid')) validateField(field);
        });
    });

    form.addEventListener('submit', function (e) {
        // Stop the page from submitting so we can check the fields first
        e.preventDefault();

        let firstInvalid = null;
        fields.forEach(function (field) {
            if (!validateField(field) && !firstInvalid) firstInvalid = field.input;
        });

        if (firstInvalid) {
            status.textContent = 'Please fix the highlighted fields above.';
            status.className = 'form-status error';
            firstInvalid.focus(); // move the cursor to the first problem
            return;
        }

        // Everything is valid. There's no server to send to yet, so show a thank-you message.
        // (If you add one later, call form.submit() here instead.)
        const name = document.getElementById('name').value;
        status.textContent = 'Thank you, ' + name + '! Your inquiry has been received. We will be in touch soon.';
        status.className = 'form-status success';
        form.reset();

        // Reset the event dropdown's button text too, since its checkboxes were just cleared
        const eventPanel = document.querySelector('.multi-select-panel');
        if (eventPanel) eventPanel.dispatchEvent(new Event('change'));
    });
});

// Language switcher: remembers the user's choice with localStorage
document.addEventListener('DOMContentLoaded', function () {
    // The text for each language, looked up by the element's data-i18n name
    // Storing the translations in an object for easy lookup.
    const translations = {
        en: {
            'nav-home': 'Home',
            'nav-about': 'About',
            'nav-services': 'Services',
            'nav-events': 'Events',
            'welcome-title': 'Welcome to Riverbend Yoga Studio',
            'welcome-tagline': '~ Your journey to wellness begins here ~'
        },
        es: {
            'nav-home': 'Inicio',
            'nav-about': 'Nosotros',
            'nav-services': 'Servicios',
            'nav-events': 'Eventos',
            'welcome-title': 'Bienvenidos a Riverbend Yoga Studio',
            'welcome-tagline': '~ Tu camino hacia el bienestar comienza aquí ~'
        },
        fr: {
            'nav-home': 'Accueil',
            'nav-about': 'À propos',
            'nav-services': 'Services',
            'nav-events': 'Événements',
            'welcome-title': 'Bienvenue au studio Riverbend Yoga',
            'welcome-tagline': '~ Votre chemin vers le bien-être commence ici ~'
        },
        pl: {
            'nav-home': 'Strona główna',
            'nav-about': 'O nas',
            'nav-services': 'Usługi',
            'nav-events': 'Wydarzenia',
            'welcome-title': 'Witamy w studiu Riverbend Yoga',
            'welcome-tagline': '~ Twoja droga do dobrego samopoczucia zaczyna się tutaj ~'
        },
        de: {
            'nav-home': 'Startseite',
            'nav-about': 'Über uns',
            'nav-services': 'Angebote',
            'nav-events': 'Veranstaltungen',
            'welcome-title': 'Willkommen im Riverbend Yoga Studio',
            'welcome-tagline': '~ Ihr Weg zum Wohlbefinden beginnt hier ~'
        }
    };

    // Swap every marked element's text to the chosen language
    function applyLanguage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(function (element) {
            const key = element.dataset.i18n;
            if (translations[lang][key]) element.textContent = translations[lang][key]; // missing text stays as-is
        });
        document.documentElement.lang = lang; // updates <html lang="..."> for screen readers
    }

    // Read the saved choice; if there isn't one (or it's not a language we have), use English
    let savedLanguage = localStorage.getItem('language');
    if (!translations[savedLanguage]) savedLanguage = 'en';
    applyLanguage(savedLanguage);

    const picker = document.getElementById('language-picker');
    if (picker) {
        picker.value = savedLanguage; // show the saved choice in the dropdown
        picker.addEventListener('change', function () {
            localStorage.setItem('language', picker.value); // remember it for next time
            applyLanguage(picker.value);
        });
    }
});
