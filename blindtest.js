document.addEventListener('DOMContentLoaded', (event) => {
    const name = localStorage.getItem('userName') 
    if (name) {
        const nameDisplay = document.createElement('div');
        nameDisplay.textContent = `Welcome, ${name}!`;
        document.body.insertBefore(nameDisplay, document.body.firstChild);
    } 
});