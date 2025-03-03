function generateHistogram() {

    const text = document.getElementById('textInput').value;
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const wordCounts = {};

    words.forEach(word => {
      word = word.toLowerCase(); 
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
    const histogramDiv = document.getElementById('histogram');
    histogramDiv.innerHTML = '';


    const maxCount = wordCounts[sortedWords[0]];

    sortedWords.forEach(word => {
      const count = wordCounts[word];
      const barDiv = document.createElement('div');
      barDiv.className = 'bar';

      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.textContent = word;
      barDiv.appendChild(wordSpan);
    
      const barGraphDiv = document.createElement('div');
      barGraphDiv.className = 'bar-graph';
      barGraphDiv.style.width = `${count * 1000 / maxCount}px`; // Scale the bar width
      barDiv.appendChild(barGraphDiv);

      const countSpan = document.createElement('span');
      countSpan.textContent = ` (${count})`;
      barDiv.appendChild(countSpan);

      histogramDiv.appendChild(barDiv);
    });
  }

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;
  
    const textInput = document.getElementById('textInput');
    textInput.value = 'Extracting text...';
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContent = e.target.result;
  
      if (file.type === 'text/plain') {
        textInput.value = fileContent;
      } else if (file.type === 'application/pdf') {
        extractTextFromPDF(fileContent).then(text => {
            textInput.value = text;
        });
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
        extractTextFromDocx(fileContent).then(text => {
            textInput.value = text;
        });
      } else {
        textInput.value = 'Unsupported file type.';
      }
    };
  
    reader.readAsArrayBuffer(file);
  });
  
function extractTextFromPDF(data) {
    return pdfjsLib.getDocument({ data }).promise.then(pdf => {
      let text = '';
      const numPages = pdf.numPages;
      const promises = [];
  
      for (let i = 1; i <= numPages; i++) {
        promises.push(
          pdf.getPage(i).then(page => {
            return page.getTextContent().then(textContent => {
              textContent.items.forEach(item => {
                text += item.str + ' ';
              });
            });
          })
        );
      }
  
      return Promise.all(promises).then(() => text);
    });
  }
  

function extractTextFromDocx(data) {
    return mammoth.extractRawText({ arrayBuffer: data }).then(result => {
      return result.value; // Extracted text
    });
  }