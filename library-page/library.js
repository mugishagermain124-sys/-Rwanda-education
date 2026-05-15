 
        const searchInput = document.getElementById('searchInput');
        const levelFilter = document.getElementById('levelFilter');
        const tabs = document.querySelectorAll('.tab');
        const bookCards = document.querySelectorAll('.book-card');
        const emptyState = document.getElementById('emptyState');
        const reader = document.getElementById('reader');
        const pdfFrame = document.getElementById('pdfFrame');
        const readerTitle = document.getElementById('readerTitle');

        // --- FILTER LOGIC ---
        function filterBooks() {
            const query = searchInput.value.toLowerCase();
            const level = levelFilter.value.toLowerCase();
            const activeTab = document.querySelector('.tab.active').dataset.category;
            
            let visibleCount = 0;

            bookCards.forEach(card => {
                const title = card.dataset.title.toLowerCase();
                const category = card.dataset.category;
                const cardLevel = card.dataset.level;

                const matchesSearch = title.includes(query);
                const matchesTab = activeTab === 'all' || category === activeTab;
                const matchesLevel = level === 'all' || cardLevel === level;

                if (matchesSearch && matchesTab && matchesLevel) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // --- READER LOGIC ---
        function openBook(path, title) {
            readerTitle.innerText = title;
            pdfFrame.src = path;
            reader.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }

        function closeBook() {
            reader.style.display = 'none';
            pdfFrame.src = ""; // Stops the PDF to save performance
            document.body.style.overflow = 'auto';
        }

        // Event Listeners
        searchInput.addEventListener('input', filterBooks);
        levelFilter.addEventListener('change', filterBooks);
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                filterBooks();
            });
        });
    