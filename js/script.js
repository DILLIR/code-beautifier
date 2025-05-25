console.log("script.js loaded");

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to apply the saved theme preference
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode'); // Default to light
    }
}

// Function to toggle theme and save preference
function toggleTheme() {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Event listener for the theme toggle button
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Apply saved theme on initial page load
document.addEventListener('DOMContentLoaded', applySavedTheme);

// Code input and preview functionality
const codeInput = document.getElementById('code-input');
const codeOutput = document.getElementById('code-output');
const languageSelect = document.getElementById('language-select');

function highlightCode() {
    if (codeInput && codeOutput && languageSelect && window.hljs) {
        const code = codeInput.value;
        const selectedLanguage = languageSelect.value;

        // Set the raw code first to clear previous highlighting structure
        codeOutput.textContent = code;
        // Reset classes
        codeOutput.className = '';

        if (selectedLanguage === 'plaintext') {
            codeOutput.classList.add('language-plaintext');
            // No JS highlighting needed for plaintext, browser will render text.
            // Ensure it still looks like a code block, if desired, via CSS.
        } else if (selectedLanguage === 'auto') {
            if (code.trim().length > 0) {
                const highlighted = hljs.highlightAuto(code);
                codeOutput.innerHTML = highlighted.value;
                codeOutput.classList.add('hljs'); // Base class for styling
                // Optionally add the detected language class:
                // if (highlighted.language) {
                //     codeOutput.classList.add(`language-${highlighted.language}`);
                // }
            } else {
                // Empty code, treat as plaintext
                codeOutput.classList.add('language-plaintext');
            }
        } else {
            // Specific language selected
            codeOutput.classList.add(`language-${selectedLanguage}`);
            codeOutput.classList.add('hljs'); // Base class for styling
            hljs.highlightElement(codeOutput);
        }
    }
}

if (codeInput) {
    codeInput.addEventListener('input', highlightCode);
}

if (languageSelect) {
    languageSelect.addEventListener('change', highlightCode);
}

const syntaxThemeSelect = document.getElementById('syntax-theme-select');
const highlightThemeLink = document.getElementById('highlight-theme-link');
const HIGHLIGHT_JS_BASE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/';

// Function to apply saved syntax theme
function applySavedSyntaxTheme() {
    const savedSyntaxTheme = localStorage.getItem('syntaxTheme');
    if (savedSyntaxTheme && highlightThemeLink) {
        highlightThemeLink.href = HIGHLIGHT_JS_BASE_URL + savedSyntaxTheme;
        if (syntaxThemeSelect) {
            syntaxThemeSelect.value = savedSyntaxTheme;
        }
    }
}

// Function to change syntax theme and save preference
function changeSyntaxTheme() {
    if (syntaxThemeSelect && highlightThemeLink) {
        const selectedTheme = syntaxThemeSelect.value;
        highlightThemeLink.href = HIGHLIGHT_JS_BASE_URL + selectedTheme;
        localStorage.setItem('syntaxTheme', selectedTheme);
        highlightCode(); // Re-apply highlighting
    }
}

if (syntaxThemeSelect) {
    syntaxThemeSelect.addEventListener('change', changeSyntaxTheme);
}

const codeBgColorPicker = document.getElementById('code-bg-color-picker');
const codePreviewContainer = document.getElementById('code-preview-container');

// Function to apply saved code block background color
function applySavedCodeBgColor() {
    const savedColor = localStorage.getItem('codeBgColor');
    if (savedColor && codePreviewContainer) {
        codePreviewContainer.style.backgroundColor = savedColor;
        if (codeBgColorPicker) {
            codeBgColorPicker.value = savedColor;
        }
    } else if (codePreviewContainer && codeBgColorPicker) {
        // If no saved color, set the preview to the picker's default value
        // This ensures consistency if the default value of the picker is changed in HTML
        codePreviewContainer.style.backgroundColor = codeBgColorPicker.value;
    }
}

// Function to change code block background color and save preference
function changeCodeBgColor() {
    if (codeBgColorPicker && codePreviewContainer) {
        const selectedColor = codeBgColorPicker.value;
        codePreviewContainer.style.backgroundColor = selectedColor;
        localStorage.setItem('codeBgColor', selectedColor);
    }
}

if (codeBgColorPicker) {
    codeBgColorPicker.addEventListener('input', changeCodeBgColor);
}

const codePaddingInput = document.getElementById('code-padding-input');
// codePreviewContainer is already defined from previous step

// Function to apply saved code block padding
function applySavedCodePadding() {
    const savedPadding = localStorage.getItem('codePadding');
    if (savedPadding && codePreviewContainer) {
        codePreviewContainer.style.padding = savedPadding + 'px';
        if (codePaddingInput) {
            codePaddingInput.value = savedPadding;
        }
    } else if (codePreviewContainer && codePaddingInput) {
        // If no saved padding, set the preview to the input's default value
        codePreviewContainer.style.padding = codePaddingInput.value + 'px';
    }
}

// Function to change code block padding and save preference
function changeCodePadding() {
    if (codePaddingInput && codePreviewContainer) {
        const selectedPadding = codePaddingInput.value;
        codePreviewContainer.style.padding = selectedPadding + 'px';
        localStorage.setItem('codePadding', selectedPadding);
    }
}

if (codePaddingInput) {
    codePaddingInput.addEventListener('input', changeCodePadding);
}

const prettifyCodeButton = document.getElementById('prettify-code-button');

// Prettier Formatting
function getPrettierParserOptions(language) {
    // Ensure prettier and prettierPlugins are loaded
    if (typeof prettier === 'undefined' || typeof prettierPlugins === 'undefined') {
        console.error('Prettier or its plugins are not loaded.');
        alert('Prettier library not loaded. Cannot format code.');
        return null;
    }

    switch (language) {
        case 'javascript':
        case 'json': // Babel parser handles JSON
            return { parser: 'babel', plugins: prettierPlugins };
        case 'xml': // HTML parser for XML/HTML
            return { parser: 'html', plugins: prettierPlugins };
        case 'css':
            return { parser: 'css', plugins: prettierPlugins };
        // Add cases for other languages and their specific Prettier parsers if more are added
        // e.g., 'typescript' might need 'babel-ts' or a specific typescript parser
        default:
            // Try a common default or indicate unsupported
            // For many things, babel might work, but it's safer to be explicit.
            // If 'auto' or 'plaintext' is selected, Prettier might not be suitable
            // or a best-effort attempt can be made.
            if (language !== 'auto' && language !== 'plaintext') {
                // Attempting babel as a fallback for unrecognized but potentially similar languages
                console.warn(`No specific Prettier parser for language "${language}". Attempting with Babel.`);
                return { parser: 'babel', plugins: prettierPlugins, printWidth: 80 };
            }
            alert(`Prettier does not support formatting for language: ${language}. Or select a specific language instead of 'auto' or 'plaintext'.`);
            return null;
    }
}

function formatCodeWithPrettier() {
    if (!codeInput || !languageSelect) return;

    const code = codeInput.value;
    const selectedLanguage = languageSelect.value;
    const prettierOptions = getPrettierParserOptions(selectedLanguage);

    if (!prettierOptions) {
        return; // Parser not available or language not supported
    }

    try {
        const formattedCode = prettier.format(code, prettierOptions);
        codeInput.value = formattedCode;
        // Trigger input event to update preview and highlighting
        codeInput.dispatchEvent(new Event('input', { bubbles: true }));
    } catch (error) {
        console.error('Prettier formatting error:', error);
        alert(`Error formatting code: ${error.message}\n\nPlease check your code for syntax errors or select a different language.`);
    }
}

if (prettifyCodeButton) {
    prettifyCodeButton.addEventListener('click', formatCodeWithPrettier);
}

const shadowToggle = document.getElementById('shadow-toggle');
// codePreviewContainer is already defined

// Function to apply saved shadow preference
function applySavedShadowPreference() {
    const savedShadowPreference = localStorage.getItem('codeShadowEnabled');
    if (shadowToggle && codePreviewContainer) {
        const shadowEnabled = savedShadowPreference === 'true';
        shadowToggle.checked = shadowEnabled;
        if (shadowEnabled) {
            codePreviewContainer.classList.add('code-preview-shadow');
        } else {
            codePreviewContainer.classList.remove('code-preview-shadow');
        }
    }
}

// Function to toggle shadow and save preference
function toggleShadow() {
    if (shadowToggle && codePreviewContainer) {
        if (shadowToggle.checked) {
            codePreviewContainer.classList.add('code-preview-shadow');
            localStorage.setItem('codeShadowEnabled', 'true');
        } else {
            codePreviewContainer.classList.remove('code-preview-shadow');
            localStorage.setItem('codeShadowEnabled', 'false');
        }
    }
}

if (shadowToggle) {
    shadowToggle.addEventListener('change', toggleShadow);
}

// Initial highlighting and theme application on load
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme(); // Website theme (dark/light)
    applySavedSyntaxTheme(); // Syntax highlighting theme
    applySavedCodeBgColor(); // Code block background color
    applySavedCodePadding(); // Code block padding
    applySavedShadowPreference(); // Code block shadow
    highlightCode(); // Highlight any initial code
});
