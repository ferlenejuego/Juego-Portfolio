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

function openStaticFile(filePath, fileName) {
    const modal = document.getElementById('pdfModal');
    const modalBody = document.getElementById('modal-body');
    const titleEl = document.getElementById('pdfTitle');
    titleEl.textContent = fileName;

    const ext = fileName.split('.').pop().toLowerCase();

    modalBody.innerHTML = '';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].indexOf(ext) !== -1) {
        modalBody.innerHTML = '<img src="' + filePath + '" alt="' + fileName + '" class="modal-img">';
    } else if (ext === 'pdf') {
        modalBody.innerHTML = '<iframe src="' + filePath + '" class="modal-frame" title="' + fileName + '"></iframe>';
    } else {
        modalBody.innerHTML =
            '<div class="modal-fallback">' +
                '<p>Preview not available for this file type.</p>' +
                '<a href="' + filePath + '" download class="view-btn">Download ' + fileName + '</a>' +
            '</div>';
    }

    modal.classList.add('open');
}

function closePdf() {
    pdfModal.classList.remove('open');
    setTimeout(function() {
        document.getElementById('modal-body').innerHTML = '';
    }, 300);
}

window.openStaticFile = openStaticFile;
window.closePdf = closePdf;

function initUpload() {
    pdfModal = document.getElementById('pdfModal');
    window.pdfModal = pdfModal;

    const pendingFiles = {};
    const STORAGE_KEY = 'juegoUploads';

    function persistFiles() {
        const out = {};
        for (const key in pendingFiles) {
            out[key] = (pendingFiles[key] || []).map(function(item) {
                return { name: item.name, type: item.type, data: item.data };
            });
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(out));
        } catch (e) {
            console.warn('Storage full: ' + e.message);
        }
    }

    function loadPersistedFiles() {
        let stored = null;
        try {
            stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (e) {
            stored = null;
        }
        if (!stored) {
            return;
        }
        for (const key in stored) {
            pendingFiles[key] = (stored[key] || []).map(function(item) {
                const bin = atob(item.data);
                const bytes = new Uint8Array(bin.length);
                for (let i = 0; i < bin.length; i++) {
                    bytes[i] = bin.charCodeAt(i);
                }
                const blob = new Blob([bytes], { type: item.type });
                return {
                    name: item.name,
                    type: item.type,
                    data: item.data,
                    url: URL.createObjectURL(blob)
                };
            });
        }
    }

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
        const fileList = Array.from(files).filter(function(file) {
            return isAllowedType(file.type);
        });
        if (fileList.length === 0) {
            return;
        }
        let remaining = fileList.length;
        fileList.forEach(function(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const data = e.target.result.split(',')[1];
                if (!pendingFiles[key]) {
                    pendingFiles[key] = [];
                }
                pendingFiles[key].push({
                    name: file.name,
                    type: file.type,
                    data: data,
                    url: URL.createObjectURL(file)
                });
                remaining--;
                if (remaining === 0) {
                    persistFiles();
                    renderUpload(key);
                }
            };
            reader.readAsDataURL(file);
        });
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
                openStaticFile(item.url, item.name);
            });

            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'up-item-del';
            delBtn.title = 'Remove';
            delBtn.innerHTML = '<span class="ti ti-x"></span>';
            delBtn.addEventListener('click', function() {
                pendingFiles[key].splice(index, 1);
                persistFiles();
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

    loadPersistedFiles();

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
