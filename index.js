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
