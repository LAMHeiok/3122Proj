/**
 * Asynchronously loads content from a URL into a specified container,
 * including proper handling of scripts and external JS files.
 * 
 * @param {string} url - The URL to load content from
 * @param {string} containerId - The ID of the container element where content will be inserted
 * @param {Object} options - Optional configuration
 * @param {boolean} options.showLoading - Whether to show a loading indicator (default: true)
 * @param {boolean} options.preserveScripts - Whether to preserve script tags in the original content (default: false)
 * @param {Function} options.onSuccess - Callback function when content loads successfully
 * @param {Function} options.onError - Callback function when content fails to load
 * @returns {Promise<void>}
 */
async function loadContent(url, containerId, options = {}) {
    const {
        showLoading = true,
        preserveScripts = false,
        onSuccess = null,
        onError = null
    } = options;

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container element with ID '${containerId}' not found`);
        return;
    }

    // Show loading state if enabled
    if (showLoading) {
        container.classList.add('loading');
        container.innerHTML = `
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Loading content...</p>
            </div>
        `;
    }

    try {
        // Fetch the content from the specified URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load content: ${response.statusText}`);
        }

        // Get the HTML content
        const html = await response.text();

        // Create a temporary element to parse the HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;

        // Track scripts to execute them in order
        const scriptsToExecute = [];

        // Find all script elements before removing them from the content
        if (!preserveScripts) {
            const scriptElements = tempContainer.querySelectorAll('script');
            scriptElements.forEach(originalScript => {
                // Store script information for later execution
                scriptsToExecute.push({
                    src: originalScript.src,
                    type: originalScript.type || 'text/javascript',
                    content: originalScript.textContent,
                    async: originalScript.async,
                    defer: originalScript.defer,
                    module: originalScript.type === 'module'
                });
                
                // Remove the script from the content (we'll execute it properly later)
                originalScript.remove();
            });
        }

        // Load any link tags for CSS
        const linkElements = tempContainer.querySelectorAll('link[rel="stylesheet"]');
        linkElements.forEach(link => {
            // Check if this stylesheet is already loaded
            const href = link.getAttribute('href');
            if (href && !document.querySelector(`link[href="${href}"]`)) {
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.href = href;
                document.head.appendChild(newLink);
            }
            // Remove the link from the content as we've handled it
            if (!preserveScripts) link.remove();
        });

        // Update the container with the new content
        container.innerHTML = tempContainer.innerHTML;
        if (showLoading) container.classList.remove('loading');

        // Helper function to create and load a script
        const loadScript = (scriptInfo) => {
            return new Promise((resolve, reject) => {
                // Skip empty scripts
                if (!scriptInfo.src && !scriptInfo.content) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                
                // Set script type
                script.type = scriptInfo.type;
                
                // Set load/error handlers
                script.onload = () => resolve();
                script.onerror = (err) => reject(new Error(`Failed to load script: ${scriptInfo.src}`));
                
                // Set async/defer if specified
                if (scriptInfo.async) script.async = true;
                if (scriptInfo.defer) script.defer = true;
                
                // Set module type if needed
                if (scriptInfo.module) script.type = 'module';

                // For external scripts, set the src attribute
                if (scriptInfo.src) {
                    // Prevent caching issues with a cache-busting URL parameter
                    const cacheBustUrl = scriptInfo.src.includes('?') 
                        ? `${scriptInfo.src}&_t=${Date.now()}` 
                        : `${scriptInfo.src}?_t=${Date.now()}`;
                    script.src = cacheBustUrl;
                    document.body.appendChild(script);
                } else {
                    // For inline scripts, set the content
                    script.textContent = scriptInfo.content;
                    document.body.appendChild(script);
                    // Inline scripts execute immediately, so resolve right away
                    resolve();
                }
            });
        };

        // Execute scripts sequentially to maintain order
        for (const scriptInfo of scriptsToExecute) {
            try {
                await loadScript(scriptInfo);
            } catch (error) {
                console.warn('Error loading script:', error);
                // Continue with other scripts even if one fails
            }
        }

        // Call success callback if provided
        if (typeof onSuccess === 'function') {
            onSuccess(container, url);
        }

        // Trigger a custom event for other parts of the application
        const contentLoadedEvent = new CustomEvent('contentLoaded', {
            detail: { containerId, url }
        });
        document.dispatchEvent(contentLoadedEvent);

    } catch (error) {
        console.error('Error loading content:', error);
        
        // Display error message to user
        container.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Content</h3>
                <p>${error.message}</p>
                <button onclick="loadContent('${url}', '${containerId}')">Try Again</button>
            </div>
        `;
        
        if (showLoading) container.classList.remove('loading');
        
        // Call error callback if provided
        if (typeof onError === 'function') {
            onError(error, container, url);
        }
    }
}

// Enhanced version for handling nav buttons
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('nav button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check for data-page attribute first, then fall back to onclick attribute
            const pageUrl = button.dataset.page || button.getAttribute('onclick')?.match(/loadContent\(['"](.+?)['"]/)?.[1];
            
            if (pageUrl) {
                // Get the target container if specified
                const container = button.dataset.container || 'content-container';
                
                // Set active state on the clicked button
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Load the content
                loadContent(pageUrl, container, {
                    showLoading: true,
                    onSuccess: (container) => {
                        // Scroll to top of container
                        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            }
        });
    });
    
    // Check for default page to load from URL hash
    const hashPage = window.location.hash.substring(1);
    if (hashPage) {
        const pageUrl = hashPage.includes('.html') ? hashPage : `${hashPage}.html`;
        loadContent(pageUrl, 'content-container');
        
        // Set active state on the corresponding button
        const matchingButton = Array.from(navButtons).find(btn => 
            btn.dataset.page === pageUrl || 
            btn.getAttribute('onclick')?.includes(pageUrl)
        );
        if (matchingButton) matchingButton.classList.add('active');
    }
});

// Function to dynamically load additional JavaScript file
function loadJavaScriptFile(url) {
    return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (document.querySelector(`script[src="${url}"]`)) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = (err) => reject(new Error(`Failed to load script: ${url}`));
        document.body.appendChild(script);
    });
}