// HTML checkboxes are left if they have javascript turned off. 
// This script replaces the select element with a multi-select dropdown of checkboxes.
// Turn the "Event" dropdown into a dropdown of checkboxes so users can pick multiple events
document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('event');
    if (!select) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'multi-select';

    // Button that opens/closes the list (keeps the id so the <label for="event"> still works)
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = select.id; // select is "select the event"
    toggle.className = 'multi-select-toggle'; // toggles open the multi-select dropdown
    toggle.setAttribute('aria-expanded', 'false'); // Not expanded by default

    // Make a container to hold the options that a user can select
    const panel = document.createElement('div');
    panel.className = 'multi-select-panel';
    panel.hidden = true;

    // Remove Placeholder option from the select element
    const placeholder = select.options[0].textContent.trim();

    // Build one checkbox per option, skipping the "Select an event" placeholder
    for (const option of select.options) {
        if (option.disabled || option.value === '') continue;

        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'event';
        checkbox.value = option.value;

        label.appendChild(checkbox);
        label.append(' ' + option.textContent.trim());
        panel.appendChild(label);
    }

    // Show what's been picked on the button
    function updateToggleText() {
        const checked = panel.querySelectorAll('input:checked');
        if (checked.length === 0) {
            toggle.textContent = placeholder;
        } else if (checked.length === 1) {
            toggle.textContent = checked[0].value;
        } else {
            toggle.textContent = checked.length + ' events selected';
        }
    }

    function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () {
        setOpen(panel.hidden);
    });

    panel.addEventListener('change', updateToggleText);

    // Close when clicking anywhere outside the dropdown
    document.addEventListener('click', function (e) {
        if (!wrapper.contains(e.target)) setOpen(false);
    });

    // Close with the Escape key
    wrapper.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            setOpen(false);
            toggle.focus();
        }
    });

    wrapper.appendChild(toggle);
    wrapper.appendChild(panel);
    select.replaceWith(wrapper);
    updateToggleText();
});

