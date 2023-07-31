const fileSelector = document.getElementById('fileSelector');
let jsonFile = null;
let resultDiv = document.getElementById('result');

window.onload = () => {
    resultDiv.style.display = 'none';

    // Add onClick event to options inputs
    const inputs = document.getElementsByTagName('input');
    for (const input of inputs) {
        if (input.type === 'checkbox') {
            input.addEventListener('click', (event) => generate());
        }
    }

    // Add change event to file selector
    fileSelector.addEventListener('change', (event) => getAndGenerate());

    // When reloading page
    getAndGenerate();
}

function getAndGenerate() {
    getFile();
    generate();
}

function getFile() {
    if (fileSelector.files.length === 0) {
        return;
    }

    jsonFile = fileSelector.files[0];
}

function generate() {
    if (jsonFile === null) {
        return;
    }

    resultDiv.style.display = 'none';
    resultDiv.innerHTML = '';

    // OPTIONS
    const PARAGRAPH_MARGIN = document.getElementById('paragraphMargin').checked;
    const TRANSLATE_MARKDOWN = document.getElementById('translateMarkdown').checked;
    const REMOVE_ASTERISKS = document.getElementById('removeAsterisks').checked;

    const HEADER_AUTHOR = document.getElementById('messageHeaderAuthor').checked;
    const HEADER_DATE = document.getElementById('messageHeaderDate').checked;
    const HEADER_MARGIN = document.getElementById('messageHeaderMargin').checked;

    const LIGHT_MODE = document.getElementById('lightMode').checked;

    // GENERATE
    const reader = new FileReader();
    reader.readAsText(jsonFile, "UTF-8");

    reader.onload = function (event) {
        const jsonMessages = JSON.parse(event.target.result);

        for (const message of jsonMessages) {
            if (HEADER_AUTHOR || HEADER_DATE) {
                let headerElement = document.createElement('p');
                headerElement.classList.add('messageHeader')

                if (HEADER_MARGIN) {
                    headerElement.classList.add('headerMargin');
                } else {
                    headerElement.classList.add('noMP');
                }

                if (HEADER_AUTHOR) {
                    headerElement.innerHTML += `<span class="authorName">${message.author.name}</span>`;
                }

                if (HEADER_DATE) {
                    let parsedDate = new Date(Date.parse(message.date)).toLocaleString('fr-FR');

                    let classes = 'date';

                    if (HEADER_AUTHOR && HEADER_DATE) {
                        classes += ' dateMargin';
                    }

                    headerElement.innerHTML += `<span class="${classes}">${parsedDate}</span>`;
                }

                resultDiv.appendChild(headerElement);
            }

            let messageElement = document.createElement('p');

            if (!PARAGRAPH_MARGIN) {
                messageElement.classList.add('noMP');
            }

            let messageContent = message.content.replaceAll('\n', '<br>');

            if (REMOVE_ASTERISKS) {
                messageContent = messageContent.replaceAll('*', '');
            }

            if (TRANSLATE_MARKDOWN) {
                messageContent = new showdown.Converter().makeHtml(messageContent).replaceAll('<p>', '').replaceAll('</p>', '');
            }

            messageElement.innerHTML = messageContent;

            resultDiv.appendChild(messageElement);
        }

        if (LIGHT_MODE) {
            resultDiv.style.color = 'black';
            resultDiv.style.backgroundColor = 'white';
        } else {
            resultDiv.style.color = 'white';
            resultDiv.style.background = 'none';
        }

        resultDiv.style.display = 'block';
    }

    reader.onerror = function (evt) {
        resultDiv.innerHTML = "<b>Error while loading file</b>";
    }
}