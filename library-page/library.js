document.addEventListener('DOMContentLoaded', () => {
    // --- Selectors ---
    const searchInput = document.getElementById('searchInput');
    const levelFilter = document.getElementById('levelFilter');
    const tabs = document.querySelectorAll('.tab');
    const cards = document.querySelectorAll('.book-card');
    const emptyState = document.getElementById('emptyState');
    const modal = document.getElementById('bookModal');
    const closeModal = document.getElementById('closeModal');

    // --- Filtering Logic ---
    function runAllFilters() {
        const query = searchInput.value.toLowerCase().trim();
        const level = levelFilter.value.toLowerCase();
        const activeTab = document.querySelector('.tab.active').dataset.category.toLowerCase();
        
        let foundAny = false;

        cards.forEach(card => {
            const title = card.dataset.title.toLowerCase();
            const subject = card.dataset.subject.toLowerCase();
            const cardLevel = card.dataset.level.toLowerCase();

            const matchesSearch = title.includes(query) || subject.includes(query);
            const matchesTab = (activeTab === 'all' || subject === activeTab);
            const matchesLevel = (level === 'all' || cardLevel === level);

            if (matchesSearch && matchesTab && matchesLevel) {
                card.classList.remove('hidden');
                foundAny = true;
            } else {
                card.classList.add('hidden');
            }
        });

        emptyState.className = foundAny ? 'hidden' : '';
    }

    // --- Modal Logic ---
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if the download button was clicked
            if (e.target.closest('.dl-btn')) return;

            const title = card.dataset.title;
            const subject = card.dataset.subject;
            const coverColorClass = card.querySelector('.book-cover').classList[1];
            const iconHtml = card.querySelector('i').outerHTML;

            // Fill Modal content
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalSubject').innerText = subject.toUpperCase();
            const modalPreview = document.getElementById('modalCover');
            modalPreview.className = `modal-preview ${coverColorClass}`;
            modalPreview.innerHTML = iconHtml;

            // Show Modal
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    // --- Event Listeners ---
    searchInput.addEventListener('input', runAllFilters);
    levelFilter.addEventListener('change', runAllFilters);
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            runAllFilters();
        });
    });
});

// Download simulation logic
function downloadLogic(btn, file) {
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Preparing...`;

    setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Started!`;
        btn.style.color = "#10b981";
        setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            btn.style.color = "";
        }, 2000);
    }, 1200);
}
