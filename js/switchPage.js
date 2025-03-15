async function loadContent(url, containerId) {
    try {
        // Fetch the content from the specified URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.statusText}`);
        }

        // Get the HTML content
        const html = await response.text();

        // Inject the HTML into the container
        const container = document.getElementById(containerId);
        container.innerHTML = html;

        // Find and execute all <script> tags in the loaded content
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                // If the script has a src attribute, load the external script
                newScript.src = script.src;
            } else {
                // If the script is inline, copy its content
                newScript.textContent = script.textContent;
            }
            document.body.appendChild(newScript);
        });
    } catch (error) {
        console.error('Error loading content:', error);
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