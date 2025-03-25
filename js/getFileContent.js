async function getFileContent(filePath) {
    try {
        const response = await fetch(`http://localhost:3000/retrieve-file?filePath=${encodeURIComponent(filePath)}`);
        
        if (!response.ok) {
            // Handle HTTP errors
            const errorData = await response.json();
            throw new Error(`Error: ${errorData.error}`);
        }
        
        const data = await response.json();
        return data.content; // Return the file content
    } catch (error) {
        console.error('Failed to fetch file content:', error);
        throw error; // Re-throw the error for further handling
    }
}