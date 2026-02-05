export async function fetchUserInfo() {
    try {
        const response = await fetch('/api/v1/auth/me', { 
            credentials : "include"
        });

        if (response.ok) {
            const data = await response.json();

            return data;
        } else {
            const error = await response.json();
            throw new Error( error.message || 'Not Logged In.');
        }
    } catch (error) {
        window.location.href = '/login.html';
        throw error;
    }
}

export async function registerUser(body) {
    const response = await fetch('/api/v1/auth/register',
        {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(body)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to register user');
    }

    return data;
}

export async function logout() {
    const response = await fetch('/api/v1/auth/logout', {
        credentials : 'include'
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to register user');
    }

    return data;
}