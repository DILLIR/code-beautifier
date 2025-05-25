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
        console.error('Prettier or its plugins are not loaded. Cannot format code.');
        // In a test environment, prettier/prettierPlugins might be undefined.
        // For tests, we might mock them or ensure tests run where they are loaded.
        // For now, let's assume they are loaded if the function is called by the app.
        // The test script will need to handle this.
        return { error: "Prettier library not loaded." };
    }

    switch (language) {
        case 'javascript':
        case 'json': // Babel parser handles JSON
            return { parser: 'babel', plugins: prettierPlugins, printWidth: 80 };
        case 'xml': // HTML parser for XML/HTML
            return { parser: 'html', plugins: prettierPlugins, printWidth: 80 };
        case 'css':
            return { parser: 'css', plugins: prettierPlugins, printWidth: 80 };
        // Add cases for other languages like typescript if parser is available
        // case 'typescript':
        //     return { parser: 'typescript', plugins: prettierPlugins, printWidth: 80 };
        default:
            if (language && language !== 'auto' && language !== 'plaintext') {
                // Attempting babel as a fallback for unrecognized but potentially similar languages
                console.warn(`No specific Prettier parser for language "${language}". Attempting with Babel as a fallback.`);
                return { parser: 'babel', plugins: prettierPlugins, printWidth: 80, isFallback: true };
            }
            console.warn(`Prettier formatting is not supported for language: "${language}". Select a specific, supported language.`);
            return { error: `Unsupported language for Prettier: ${language}` };
    }
}

function formatCodeWithPrettier() {
    if (!codeInput || !languageSelect) return;

    const code = codeInput.value;
    const selectedLanguage = languageSelect.value;
    const prettierOptionsResult = getPrettierParserOptions(selectedLanguage);

    if (prettierOptionsResult && prettierOptionsResult.error) {
        alert(prettierOptionsResult.error); // Or handle error more gracefully
        return;
    }
    
    if (!prettierOptionsResult) { // Should not happen if error is always returned as object
        alert("Could not determine Prettier parser options.");
        return; 
    }

    try {
        // Ensure prettier is available (it's checked in getPrettierParserOptions but good practice)
        if (typeof prettier === 'undefined') {
            alert('Prettier library not loaded. Cannot format code.');
            return;
        }
        const formattedCode = prettier.format(code, prettierOptionsResult);
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

const fontSizeInput = document.getElementById('font-size-input');
const fontFamilySelect = document.getElementById('font-family-select');
// codeOutput is already defined (the <code> element)

// Function to apply saved font size
function applySavedFontSize() {
    const savedFontSize = localStorage.getItem('codeFontSize');
    if (savedFontSize && codeOutput) {
        codeOutput.style.fontSize = savedFontSize + 'px';
        if (fontSizeInput) {
            fontSizeInput.value = savedFontSize;
        }
    } else if (fontSizeInput && codeOutput) {
        // Apply default from input if no saved value
        codeOutput.style.fontSize = fontSizeInput.value + 'px';
    }
}

// Function to change font size and save preference
function changeFontSize() {
    if (fontSizeInput && codeOutput) {
        const selectedSize = fontSizeInput.value;
        codeOutput.style.fontSize = selectedSize + 'px';
        localStorage.setItem('codeFontSize', selectedSize);
    }
}

// Function to apply saved font family
function applySavedFontFamily() {
    const savedFontFamily = localStorage.getItem('codeFontFamily');
    if (savedFontFamily && codeOutput) {
        codeOutput.style.fontFamily = savedFontFamily;
        if (fontFamilySelect) {
            fontFamilySelect.value = savedFontFamily;
        }
    } else if (fontFamilySelect && codeOutput) {
        // Apply default from select if no saved value
        codeOutput.style.fontFamily = fontFamilySelect.value;
    }
}

// Function to change font family and save preference
function changeFontFamily() {
    if (fontFamilySelect && codeOutput) {
        const selectedFamily = fontFamilySelect.value;
        codeOutput.style.fontFamily = selectedFamily;
        localStorage.setItem('codeFontFamily', selectedFamily);
    }
}

if (fontSizeInput) {
    fontSizeInput.addEventListener('input', changeFontSize);
}

if (fontFamilySelect) {
    fontFamilySelect.addEventListener('change', changeFontFamily);
}

const exportPngButton = document.getElementById('export-png-button');
const pngScaleInput = document.getElementById('png-scale-input');
// codePreviewContainer is already defined

// Function to export code block as PNG
function exportAsPng() {
    if (!codePreviewContainer || !pngScaleInput || typeof html2canvas === 'undefined') {
        console.error('Required elements or html2canvas library not found for PNG export.');
        alert('Could not export as PNG. Ensure html2canvas is loaded.');
        return;
    }

    const scaleValue = parseFloat(pngScaleInput.value) || 2; // Default to 2 if input is invalid

    // Options for html2canvas
    const options = {
        scale: scaleValue,
        useCORS: true, // Helpful if any external resources were used (e.g. font files if not embedded by browser)
        allowTaint: true, // Similar to useCORS
        logging: false, // Can be true for debugging
        // Ensure background is captured if the element itself has no explicit background
        // but its parents do. Our code-preview-container has a background.
        // backgroundColor: null, // Use null to capture transparent backgrounds, or specify a color
    };

    // Show a temporary loading indicator (optional)
    // For example, change button text
    const originalButtonText = exportPngButton.textContent;
    exportPngButton.textContent = 'Exporting...';
    exportPngButton.disabled = true;

    html2canvas(codePreviewContainer, options).then(canvas => {
        const imageDataUrl = canvas.toDataURL('image/png');

        const downloadLink = document.createElement('a');
        downloadLink.href = imageDataUrl;
        downloadLink.download = 'code_snapshot.png'; // Filename for the download

        document.body.appendChild(downloadLink); // Required for Firefox
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Restore button
        exportPngButton.textContent = originalButtonText;
        exportPngButton.disabled = false;

    }).catch(error => {
        console.error('Error exporting to PNG with html2canvas:', error);
        alert('An error occurred while exporting to PNG. Please check the console for details.');
        // Restore button
        exportPngButton.textContent = originalButtonText;
        exportPngButton.disabled = false;
    });
}

if (exportPngButton) {
    exportPngButton.addEventListener('click', exportAsPng);
}

// Initial highlighting and theme application on load
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme(); // Website theme (dark/light)
    applySavedSyntaxTheme(); // Syntax highlighting theme
    applySavedCodeBgColor(); // Code block background color
    applySavedCodePadding(); // Code block padding
    applySavedShadowPreference(); // Code block shadow
    applySavedFontSize(); // Code block font size
    applySavedFontFamily(); // Code block font family
    highlightCode(); // Highlight any initial code
});
