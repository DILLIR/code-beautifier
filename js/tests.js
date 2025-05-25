(function() {
    console.log("Running Unit Tests...");
    let testsPassed = 0;
    let testsFailed = 0;

    function assert(condition, message) {
        if (condition) {
            testsPassed++;
            console.log(`%cPASS: ${message}`, "color: green;");
        } else {
            testsFailed++;
            console.error(`FAIL: ${message}`);
        }
    }

    // --- Test Cases ---

    // Mock prettier and prettierPlugins for testing getPrettierParserOptions
    // In a real scenario, these would be loaded from the Prettier CDN.
    // For isolated testing of getPrettierParserOptions, we define them if not present.
    if (typeof window.prettier === 'undefined') {
        window.prettier = { format: () => {} }; // Mock a dummy format function
        console.warn("Mocking 'prettier' global object for testing purposes.");
    }
    if (typeof window.prettierPlugins === 'undefined') {
        window.prettierPlugins = { // Mock structure based on what Prettier expects
            babel: { parsers: { babel: {} } },
            html: { parsers: { html: {} } },
            css: { parsers: { css: {} } },
            // typescript: { parsers: { typescript: {} } } // If testing typescript
        };
        console.warn("Mocking 'prettierPlugins' global object for testing purposes.");
    }


    // Test Suite: getPrettierParserOptions
    console.log("--- Testing getPrettierParserOptions ---");

    // Test 1: JavaScript
    let optionsJS = getPrettierParserOptions("javascript");
    assert(optionsJS && optionsJS.parser === "babel" && !optionsJS.error, "Prettier parser for JS should be babel");

    // Test 2: JSON (uses babel parser)
    let optionsJSON = getPrettierParserOptions("json");
    assert(optionsJSON && optionsJSON.parser === "babel" && !optionsJSON.error, "Prettier parser for JSON should be babel");

    // Test 3: XML (HTML)
    let optionsXML = getPrettierParserOptions("xml");
    assert(optionsXML && optionsXML.parser === "html" && !optionsXML.error, "Prettier parser for XML/HTML should be html");

    // Test 4: CSS
    let optionsCSS = getPrettierParserOptions("css");
    assert(optionsCSS && optionsCSS.parser === "css" && !optionsCSS.error, "Prettier parser for CSS should be css");

    // Test 5: Plaintext (Unsupported)
    let optionsPlain = getPrettierParserOptions("plaintext");
    assert(optionsPlain && optionsPlain.error && optionsPlain.error.includes("Unsupported language"), "Prettier should return error for plaintext");

    // Test 6: Auto (Unsupported)
    let optionsAuto = getPrettierParserOptions("auto");
    assert(optionsAuto && optionsAuto.error && optionsAuto.error.includes("Unsupported language"), "Prettier should return error for 'auto'");
    
    // Test 7: Unknown language (e.g., "pascal") - should fallback
    let optionsPascal = getPrettierParserOptions("pascal");
    assert(optionsPascal && optionsPascal.parser === "babel" && optionsPascal.isFallback === true, "Prettier should fallback to babel for unknown 'pascal'");

    // Test 8: Null language
    let optionsNull = getPrettierParserOptions(null);
    assert(optionsNull && optionsNull.error && optionsNull.error.includes("Unsupported language"), "Prettier should return error for null language");

    // Test 9: Undefined language
    let optionsUndefined = getPrettierParserOptions(undefined);
    assert(optionsUndefined && optionsUndefined.error && optionsUndefined.error.includes("Unsupported language"), "Prettier should return error for undefined language");


    // --- Summary ---
    console.log("--- Test Summary ---");
    console.log(`Total Tests: ${testsPassed + testsFailed}`);
    console.log(`Passed: ${testsPassed}`);
    console.log(`Failed: ${testsFailed}`);

    if (testsFailed === 0 && (testsPassed + testsFailed) > 0) {
        console.log("%cAll tests passed!", "color: green; font-weight: bold;");
    } else if (testsFailed > 0) {
        console.error("%cSome tests failed.", "color: red; font-weight: bold;");
    } else {
        console.log("%cNo tests were run (or all were skipped).", "color: orange;");
    }
})();
