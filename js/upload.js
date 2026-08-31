let pdfModal = null;

function isImageType(type) {
    return type.indexOf('image/') === 0;
}

function isAllowedType(type) {
    if (type === 'application/pdf') {
        return true;
    }
    if (isImageType(type)) {
        return true;
    }
    if (/text|word|officedocument|excel|spreadsheet|presentation|json|xml/.test(type)) {
        return true;
    }
    return false;
}

function fileIconClass(type) {
    if (type === 'application/pdf') {
        return 'ti-file-pdf';
    }
    if (isImageType(type)) {
        return 'ti-photo';
    }
    if (/excel|spreadsheet/.test(type)) {
        return 'ti-file-spreadsheet';
    }
    if (/powerpoint|presentation/.test(type)) {
        return 'ti-presentation';
    }
    if (/word|officedocument/.test(type)) {
        return 'ti-file-text';
    }
    return 'ti-file';
}

function openPdf(name, url, type) {
    const titleEl = document.getElementById('pdfTitle');
    const frame = document.getElementById('pdfFrame');
    const img = document.getElementById('fileImg');
    const openLink = document.getElementById('pdfOpen');
    titleEl.textContent = name;
    openLink.href = url;
    if (isImageType(type)) {
        frame.style.display = 'none';
        img.style.display = 'block';
        img.src = url;
    } else {
        img.style.display = 'none';
        frame.style.display = 'block';
        frame.src = url;
    }
    pdfModal.classList.add('open');
}

function closePdf() {
    pdfModal.classList.remove('open');
    setTimeout(function() {
        document.getElementById('pdfFrame').src = '';
        document.getElementById('fileImg').src = '';
    }, 300);
}

window.openPdf = openPdf;
window.closePdf = closePdf;

function initUpload() {
    pdfModal = document.getElementById('pdfModal');
    window.pdfModal = pdfModal;

    const pendingFiles = {};

    const uploadConfig = {
        activities: { label: 'Activity' },
        quizzes: { label: 'Quiz' },
        laboratory: { label: 'Lab' },
        exams: { label: 'Exam' }
    };

    function updatePill(key, count) {
        const pill = document.getElementById(key + 'Pill');
        if (!pill) {
            return;
        }
        pill.textContent = count + ' uploaded';
    }

    function storeFiles(key, files) {
        if (!pendingFiles[key]) {
            pendingFiles[key] = [];
        }
        for (const file of files) {
            if (!isAllowedType(file.type)) {
                continue;
            }
            pendingFiles[key].push({
                name: file.name,
                url: URL.createObjectURL(file),
                type: file.type
            });
        }
    }

    function wireMulti(input, key) {
        input.addEventListener('change', function() {
            if (!input.files || input.files.length === 0) {
                return;
            }
            storeFiles(key, Array.from(input.files));
            renderUpload(key);
        });
    }

    function buildEmpty(key) {
        const label = document.createElement('label');
        label.className = 'up-drop';
        label.innerHTML =
            '<span class="ti ti-cloud-upload up-drop-icon"></span>' +
            '<span class="up-drop-title">No PDF uploaded yet</span>' +
            '<span class="up-drop-sub">Click to upload your files here</span>' +
            '<input type="file" accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" multiple>';
        wireMulti(label.querySelector('input'), key);
        return label;
    }

    function buildList(key) {
        const files = pendingFiles[key];
        const list = document.createElement('div');
        list.className = 'up-list';

        files.forEach(function(item, index) {
            const row = document.createElement('div');
            row.className = 'up-item';

            const fileBtn = document.createElement('button');
            fileBtn.type = 'button';
            fileBtn.className = 'up-item-file';
            fileBtn.title = 'Click to view ' + item.name;
            fileBtn.innerHTML = '<span class="ti ' + fileIconClass(item.type) + ' up-item-icon"></span><span class="up-item-name"></span>';
            fileBtn.querySelector('.up-item-name').textContent = item.name;
            fileBtn.addEventListener('click', function() {
                openPdf(item.name, item.url, item.type);
            });

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'up-item-del';
            delBtn.title = 'Remove';
            delBtn.innerHTML = '<span class="ti ti-x"></span>';
            delBtn.addEventListener('click', function() {
                pendingFiles[key].splice(index, 1);
                renderUpload(key);
            });

            row.appendChild(fileBtn);
            row.appendChild(delBtn);
            list.appendChild(row);
        });

        return list;
    }

    function buildMoreBtn(key) {
        const label = document.createElement('label');
        label.className = 'up-more';
        label.innerHTML =
            '<span class="ti ti-cloud-upload up-more-icon"></span>' +
            '<span class="up-more-text">Upload More</span>' +
            '<input type="file" accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" multiple>';
        wireMulti(label.querySelector('input'), key);
        return label;
    }

    function buildUploadSection(key) {
        const container = document.getElementById(key + 'Upload');
        if (!container) {
            return;
        }
        const files = pendingFiles[key] || [];

        container.innerHTML = '';

        if (files.length === 0) {
            container.appendChild(buildEmpty(key));
        } else {
            container.appendChild(buildList(key));
            container.appendChild(buildMoreBtn(key));
        }

        updatePill(key, files.length);
    }

    function renderUpload(key) {
        buildUploadSection(key);
    }

    for (const key in uploadConfig) {
        buildUploadSection(key);
    }

    document.getElementById('closePdfBtn').addEventListener('click', closePdf);

    pdfModal.addEventListener('click', function(e) {
        if (e.target === pdfModal) {
            closePdf();
        }
    });
}
window.initUpload = initUpload;
