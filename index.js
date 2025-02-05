document.querySelector('.subrow a').addEventListener('click', function(event) {
    event.preventDefault();
    let name = document.querySelector('.subrow input').value;
    if (!name){
        name = 'Guest' + Math.floor(Math.random() * 1000)
    }
    localStorage.setItem('userName', name);
    window.location.href = this.href;
});