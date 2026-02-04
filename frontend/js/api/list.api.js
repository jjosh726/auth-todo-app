export async function fetchUserLists() {
    const response = await fetch('api/v1/list/?include=count', { credentials : 'include' });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error( data.message || 'An error occured. Please try again.');
    } 

    return data;
}

export async function fetchList(listId) {
    const response = await fetch(`api/v1/list/${listId}`, { credentials : "include" });

    const data = await response.json();

    if (!response.ok) {
        throw new Error( data.message || 'Failed to fetch List' );
    }

    return data;
}

export async function fetchListWithTaskCount(listId) {
    const response = await fetch(`api/v1/list/${listId}/?include=count`, { credentials : "include" });

    const data = await response.json();

    if (!response.ok) {
        throw new Error( data.message || 'Failed to fetch List' );
    }

    return data;
}

export async function fetchDeleteList(listId) {
    const response = await fetch(`api/v1/list/${listId}/`, 
        {
            method : "DELETE",
            credentials : "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error( data.message || 'Failed to delete List' );
    }

    return data;
}

export async function fetchCreateList(body) {
    const response = await fetch('api/v1/list/',
        {
            method : "POST",
            credentials : "include",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(body)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error( data.message || 'Failed to create List' );
    }

    return data;
}

export async function fetchUpdateList(listId, body) {
    const response = await fetch(`api/v1/list/${listId}`,
        {
            method : "PUT",
            credentials : "include",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(body)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error( data.message || 'Failed to create List' );
    }

    return data;
}