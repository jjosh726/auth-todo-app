export async function fetchUserLists() {
    const response = await fetch('api/v1/list/?include=count', { credentials : 'include' });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error( data.message || 'An error occured. Please try again.');
    } 

    return data;
}

