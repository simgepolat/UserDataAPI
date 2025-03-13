const style = document.createElement('style');

style.textContent = `
    h1 {
        text-align: center;
        margin-bottom: 20px;
    }
    .ins-api-users {
        max-width: 1200px;
        margin: 20px auto;
        padding: 20px;
        font-family: Arial, sans-serif;
    }
    .user-card {
        background: #f5f5f5;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 15px;
        margin-bottom: 15px;
        position: relative;

        border: 1px solid #e0e0e0;
        
        background-color: #fff;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .user-card h3 {
        margin: 0 0 10px 0;
        color: #333;
    }
    .user-info {
        margin: 5px 0;
        color: #666;
    }
    .delete-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: #ff4444;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }
    .delete-btn:hover {
        background: #cc0000;
    }
    .error-message {
        background: #ffebee;
        color: #c62828;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 10px;
    }
`;
document.head.appendChild(style);

const container = document.querySelector('.ins-api-users');

function checkLocalStorage() {
    const stored = localStorage.getItem('users');
    const timestamp = localStorage.getItem('users_timestamp');
    
    if (stored && timestamp) {
        const now = new Date().getTime();
        const day = 24 * 60 * 60 * 1000;
        
        if (now - parseInt(timestamp) < day) {
            return JSON.parse(stored);
        }
    }
    return null;
}

function displayUsers(users) {
    container.innerHTML = '';
    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <h3>${user.name}</h3>
            <div class="user-info">Email: ${user.email}</div>
            <div class="user-info">Address: ${user.address.street}, ${user.address.city}</div>
            <button class="delete-btn" data-id="${user.id}">Delete</button>
        `;
        container.appendChild(userCard);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const userId = parseInt(this.getAttribute('data-id'));
            deleteUser(userId);
        });
    });
}

function deleteUser(userId) {
    let users = JSON.parse(localStorage.getItem('users'));
    users = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    displayUsers(users);
}

async function initializeUsers() {
    try {
        const storedUsers = checkLocalStorage();
        
        if (storedUsers) {
            displayUsers(storedUsers);
            return;
        }

        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const users = await response.json();
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('users_timestamp', new Date().getTime().toString());
        
        displayUsers(users);

    } catch (error) {
        container.innerHTML = `
            <div class="error-message">
                Error loading users: ${error.message}
            </div>
        `;
    }
}

initializeUsers(); 