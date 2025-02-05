pages_templates = {
    "BlindTest": `
    <html>
    <head>
        <title>New Page</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; margin: 20px; }
            h1 { color: #007bff; }
        </style>
    </head>
    <body>
        <h1>Welcome to the New Page</h1>
        <p>This page was dynamically created.</p>
        <button onclick="window.close()">Close Page</button>
    </body>
    </html>`
}

function createPage(page_model) {
    let newTab = window.open();
    newTab.document.write(pages_templates[page_model]);
    newTab.document.close();
}
