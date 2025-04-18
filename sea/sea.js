const output = document.getElementById('output');

fetch('files/assets.zip')
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch ZIP');
    return res.arrayBuffer();
  })
  .then(JSZip.loadAsync)
  .then(zip => {
    output.innerHTML = `<p>Files in ZIP:</p><ul>`;
    Object.keys(zip.files).forEach(filename => {
      output.innerHTML += `<li>${filename}</li>`;
    });
    output.innerHTML += `</ul>`;
  })
  .catch(err => {
    output.textContent = 'Error: ' + err.message;
  });
