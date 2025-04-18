const output = document.getElementById('output');

fetch('files/my-data.zip')
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch ZIP');
    return res.arrayBuffer();
  })
  .then(JSZip.loadAsync)
  .then(zip => {
    output.innerHTML = `<p>Images in ZIP:</p>`;
    const imageContainer = document.createElement('div');
    imageContainer.style.display = 'flex';
    imageContainer.style.flexWrap = 'wrap';
    imageContainer.style.gap = '10px';

    const entries = Object.values(zip.files).filter(file =>
      file.name.startsWith('assets/') &&
      /\.(png|jpe?g|webp)$/i.test(file.name)
    );

    entries.forEach(file => {
      file.async('blob').then(blob => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        img.alt = file.name;
        img.style.maxWidth = '200px';
        img.style.height = 'auto';
        img.style.border = '1px solid #ccc';
        img.title = file.name;
        imageContainer.appendChild(img);
      });
    });

    output.appendChild(imageContainer);
  })
  .catch(err => {
    output.textContent = 'Error: ' + err.message;
  });
