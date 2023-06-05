document.addEventListener('DOMContentLoaded', function () {
    const linkForm = document.getElementById('linkForm');
    const linkInput = document.getElementById('linkInput');
    const noteInput = document.getElementById('noteInput');
    const linkTable = document.getElementById('linkTable');
    const linkList = document.getElementById('linkList');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const editLinkInput = document.getElementById('editLinkInput');
    const editNoteInput = document.getElementById('editNoteInput');
    const saveButton = document.getElementById('saveButton');
    const deleteButton = document.getElementById('deleteButton');
    const closeButton = document.getElementById('closeButton');
    const deleteAllButton = document.getElementById('deleteAllButton');
    const prevPageButton = document.getElementById('prevPageButton');
    const nextPageButton = document.getElementById('nextPageButton');


    let links = JSON.parse(localStorage.getItem('links')) || [];
    const itemsPerPage = 10; // Số lượng dòng link mỗi trang
    let currentPage = 1; // Trang hiện tại

    function saveLinksToLocalStorage() {
        localStorage.setItem('links', JSON.stringify(links));
    }

    function getTotalPages() {
        return Math.ceil(links.length / itemsPerPage);
    }

    function renderPageLinks() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageLinks = links.slice(startIndex, endIndex);

        linkList.innerHTML = '';
        pageLinks.forEach(function (link, index) {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td class="px-4 py-2 text-center font-semibold">${startIndex + index + 1}</td>
            <td class="px-4 py-2 text-center hover:text-blue-500"><a href="${link.link}" target="_blank">${link.link}</a></td>
            <td class="px-4 py-2 text-center">${link.note}</td>
            <td class="px-4 py-2 text-center">
              <button data-index="${startIndex + index}" class="edit-button rounded-lg bg-blue-500 px-4 py-1 font-semibold mx-4 p-1.5 text-white">Sửa</button>
              <button data-index="${startIndex + index}" class="delete-button rounded-lg bg-red-500 px-4 py-1 font-semibold mx-4 p-1.5 text-white">Xóa</button>
            </td>
        `;
            linkList.appendChild(row);
        });
    }

    function renderLinks() {
        renderPageLinks();
        updatePagination();
    }

    function showModal(title, link, note, index) {
        modalTitle.textContent = title;
        editLinkInput.value = link;
        editNoteInput.value = note;
        saveButton.dataset.index = index;
        deleteButton.dataset.index = index;
        modal.classList.remove('hidden');
    }

    function hideModal() {
        modal.classList.add('hidden');
    }

    function updatePagination() {
        const totalPages = getTotalPages();

        if (totalPages > 1) {
            nextPageButton.style.display = currentPage < totalPages ? 'block' : 'none';
            prevPageButton.style.display = currentPage > 1 ? 'block' : 'none';
        } else {
            nextPageButton.style.display = 'none';
            prevPageButton.style.display = 'none';
        }
    }

    linkForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const link = linkInput.value.trim();
        const note = noteInput.value.trim();

        if (link === '') {
            return;
        }

        links.push({ link, note });
        saveLinksToLocalStorage();
        renderLinks();

        linkInput.value = '';
        noteInput.value = '';
    });

    linkList.addEventListener('click', function (event) {
        const target = event.target;

        if (target.classList.contains('edit-button')) {
            const index = target.dataset.index;
            const { link, note } = links[index];
            showModal('Sửa link và ghi chú', link, note, index);
        } else if (target.classList.contains('delete-button')) {
            const index = target.dataset.index;
            links.splice(index, 1);
            saveLinksToLocalStorage();
            renderLinks();
        }
    });

    saveButton.addEventListener('click', function () {
        const index = saveButton.dataset.index;
        const link = editLinkInput.value.trim();
        const note = editNoteInput.value.trim();

        if (link === '') {
            return;
        }

        links[index].link = link;
        links[index].note = note;
        saveLinksToLocalStorage();
        renderLinks();
        hideModal();
    });

    deleteButton.addEventListener('click', function () {
        const index = deleteButton.dataset.index;
        links.splice(index, 1);
        saveLinksToLocalStorage();
        renderLinks();
        hideModal();
    });

    closeButton.addEventListener('click', function () {
        hideModal();
    });

    prevPageButton.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            renderPageLinks();
            updatePagination();
        }
    });

    nextPageButton.addEventListener('click', function () {
        const totalPages = getTotalPages();

        if (currentPage < totalPages) {
            currentPage++;
            renderPageLinks();
            updatePagination();
        }
    });

    let deleteConfirmed = false; // Cờ xác định xem người dùng đã xác nhận xóa hay chưa

    // Hàm xóa tất cả liên kết
    function deleteAllLinks() {
        if (confirmDeleteCheckbox.checked) {
            links = [];
            saveLinksToLocalStorage();
            renderLinks();
            deleteAllModal.style.display = 'none';
        } else {
            alert('Vui lòng xác nhận xóa tất cả liên kết');
        }
        deleteAllModal.style.display = 'none';
    }

    // Sự kiện "click" của nút xóa tất cả
    deleteAllButton.addEventListener('click', function () {
        deleteConfirmed = false; // Đặt lại cờ xác nhận thành false
        deleteAllModal.style.display = 'block';
    });

    // Sự kiện "click" của nút xác nhận xóa tất cả
    confirmDeleteAllButton.addEventListener('click', function () {
        deleteConfirmed = true; // Đánh dấu là người dùng đã xác nhận xóa
        deleteAllLinks();
    });

    // Sự kiện "click" của nút hủy xóa tất cả
    cancelDeleteAllButton.addEventListener('click', function () {
        deleteAllModal.style.display = 'none';
    });

    renderLinks();
});

// Lấy thẻ body
const body = document.body;

// Lấy thẻ toggle theme
const themeToggle = document.getElementById('theme-toggle');

// Xử lý sự kiện khi nhấp vào toggle theme
themeToggle.addEventListener('click', () => {
    // Toggle chế độ light và dark theme
    body.classList.toggle('light');
    body.classList.toggle('dark');

    // Cập nhật biểu tượng theme
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.classList.toggle('fa-sun');
    themeIcon.classList.toggle('fa-moon');
});

// Kiểm tra nếu đã lưu trạng thái theme trước đó
if (localStorage.getItem('theme') === 'dark') {
    // Nếu đã lưu trạng thái dark theme trước đó, thì áp dụng dark theme
    body.classList.add('dark');
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.classList.add('fa-sun');
} else {
    // Nếu chưa lưu trạng thái hoặc đã lưu trạng thái light theme, áp dụng light theme
    body.classList.add('light');
    const themeIcon = document.getElementById('theme-icon');
    themeIcon.classList.add('fa-moon');
}

// Lưu trạng thái theme vào localStorage khi chuyển đổi theme
themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
});