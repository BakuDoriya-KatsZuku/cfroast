async function roastAndShowUser() {
    const roastElement = document.getElementById("roast");
    roastElement.innerText = "Loading...";
    
    const handle = document.getElementById("handle").value;
    
    try {
        const response = await fetch('/api/roast', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ handle })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate roast');
        }
        
        const data = await response.json();
        roastElement.innerText = data.roast;
    } catch (error) {
        console.error("Error:", error);
        roastElement.innerText = `${handle} is non-existent or there was an error generating the roast.`;
    }
} 