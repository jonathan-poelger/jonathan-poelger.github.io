const output = document.getElementById('output');

// Create the popup element (hidden by default)
const popup = document.createElement('div');
popup.style.position = 'absolute';
popup.style.background = '#fff';
popup.style.border = '1px solid #aaa';
popup.style.borderRadius = '8px';
popup.style.padding = '10px';
popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
popup.style.display = 'none';
popup.style.zIndex = '1000';
document.body.appendChild(popup);

// Hide popup on outside click
document.addEventListener('click', (e) => {
  if (!popup.contains(e.target)) {
    popup.style.display = 'none';
  }
});

fetch('files/my-data.zip')
  .then(res => {
    if (!res.ok) throw new Error('Failed to fetch ZIP');
    return res.arrayBuffer();
  })
  .then(JSZip.loadAsync)
  .then(zip => {
    const entries = Object.values(zip.files).filter(file =>
      file.name.startsWith('assets/') &&
      /\.(png|jpe?g|webp)$/i.test(file.name)
    );

    entries.forEach(file => {
      file.async('blob').then(blob => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        img.style.position = 'absolute';
        img.style.maxWidth = '120px';
        img.style.cursor = 'pointer';
        img.style.transition = 'transform 0.2s';
        img.style.zIndex = '10';

        // Place randomly on the screen
        img.onload = () => {
          const x = Math.random() * (window.innerWidth - img.width);
          const y = Math.random() * (window.innerHeight - img.height);
          img.style.left = `${x}px`;
          img.style.top = `${y}px`;
        };

        // Click handler to show popup
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          popup.textContent = 'Your custom info here'; // ← Replace this per image if needed
          popup.style.left = `${e.pageX + 10}px`;
          popup.style.top = `${e.pageY + 10}px`;
          popup.style.display = 'block';
        });

        document.body.appendChild(img);
      });
    });
  })
  .catch(err => {
    output.textContent = 'Error: ' + err.message;
  });
