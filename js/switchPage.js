async function loadContent(url, targetElementId) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const html = await response.text();

        const targetElement = document.getElementById(targetElementId);

        if (targetElement) {
            targetElement.innerHTML = html; // Insert the fetched HTML
        } else {
            console.error(`Target element with ID "${targetElementId}" not found.`);
        }

    } catch (error) {
        console.error("Error loading content:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('nav button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pageUrl = button.dataset.page; // Get the 'data-page' attribute value
            if (pageUrl) {
                loadContent(pageUrl, 'content-container');
            }
        });
    });
});