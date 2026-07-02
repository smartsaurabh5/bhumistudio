/* ==========================================================================
   BHUMI STUDIO - PORTFOLIO AND LIGHTBOX CONTROLLER
   ========================================================================== */

const Portfolio = {
    items: [],
    currentIndex: 0,
    activeFilter: "all",

    async init() {
        this.setupLightbox();
        await this.loadGallery();
    },

    async loadGallery() {
        try {
            this.items = await API.get("/api/portfolio");
            this.renderHighlights();
            this.renderGalleryGrid();
            this.renderAdminPortfolioList();
        } catch (error) {
            console.error("Failed to load portfolio items:", error);
        }
    },

    // Render highlights on the landing page (first 4 featured items)
    renderHighlights() {
        const container = document.getElementById("portfolio-highlights-container");
        if (!container) return;

        const featured = this.items.filter(item => item.is_featured === 1).slice(0, 4);
        
        if (featured.length === 0) {
            container.innerHTML = `<p class="paragraph text-center w-100">No highlights defined yet. Add items in the Admin Panel.</p>`;
            return;
        }

        container.innerHTML = featured.map(item => this.generateCardHTML(item, "highlight")).join("");
        this.bindCardClicks();
    },

    // Render full grid on portfolio page
    renderGalleryGrid() {
        const container = document.getElementById("portfolio-gallery-container");
        if (!container) return;

        const filtered = this.activeFilter === "all" 
            ? this.items 
            : this.items.filter(item => item.category === this.activeFilter);

        if (filtered.length === 0) {
            container.innerHTML = `<p class="paragraph text-center w-100">No portfolio items found in this category.</p>`;
            return;
        }

        container.innerHTML = filtered.map(item => this.generateCardHTML(item, "gallery")).join("");
        this.bindCardClicks();
    },

    // Card HTML Template
    generateCardHTML(item, context) {
        const mediaTag = item.media_type === "video" 
            ? `<div class="video-play-icon"><i class="fa-solid fa-play"></i></div>` 
            : "";
            
        const previewUrl = item.media_type === "video" ? (item.thumbnail || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80") : item.url;

        return `
            <div class="gallery-card" data-id="${item.id}" data-context="${context}">
                <img src="${previewUrl}" alt="${item.title}" loading="lazy">
                ${mediaTag}
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <span>${item.category.toUpperCase()}</span>
                        <h4>${item.title}</h4>
                    </div>
                </div>
            </div>
        `;
    },

    // Bind Lightbox clicks to dynamically generated cards
    bindCardClicks() {
        document.querySelectorAll(".gallery-card").forEach(card => {
            card.addEventListener("click", () => {
                const itemId = card.getAttribute("data-id");
                const context = card.getAttribute("data-context");
                this.openLightbox(itemId, context);
            });
        });
    },

    // Setup active filters tabs
    setFilter(category) {
        this.activeFilter = category;
        const tabs = document.querySelectorAll("#portfolio-filters-tabs .filter-tab");
        tabs.forEach(tab => {
            if (tab.getAttribute("data-filter") === category) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });
        this.renderGalleryGrid();
    },

    /* --------------------------------------------------------------------------
       LIGHTBOX COMPONENT
       -------------------------------------------------------------------------- */
    setupLightbox() {
        const modal = document.getElementById("lightbox-modal");
        if (!modal) return;

        const closeBtn = document.getElementById("lightbox-close-btn");
        const prevBtn = document.getElementById("lightbox-prev-btn");
        const nextBtn = document.getElementById("lightbox-next-btn");

        closeBtn.addEventListener("click", () => this.closeLightbox());
        prevBtn.addEventListener("click", () => this.navigateLightbox(-1));
        nextBtn.addEventListener("click", () => this.navigateLightbox(1));
        
        // Background click close
        modal.addEventListener("click", (e) => {
            if (e.target === modal || e.target.classList.contains("lightbox-content-holder")) {
                this.closeLightbox();
            }
        });

        // Key listeners
        document.addEventListener("keydown", (e) => {
            if (!modal.classList.contains("active")) return;
            if (e.key === "Escape") this.closeLightbox();
            if (e.key === "ArrowLeft") this.navigateLightbox(-1);
            if (e.key === "ArrowRight") this.navigateLightbox(1);
        });
    },

    activeSet: [], // List of items currently available in the active display set

    openLightbox(itemId, context) {
        // Find which list we are browsing
        if (context === "highlight") {
            this.activeSet = this.items.filter(item => item.is_featured === 1).slice(0, 4);
        } else {
            this.activeSet = this.activeFilter === "all" 
                ? this.items 
                : this.items.filter(item => item.category === this.activeFilter);
        }

        this.currentIndex = this.activeSet.findIndex(item => item.id === itemId);
        if (this.currentIndex === -1) return;

        document.getElementById("lightbox-modal").classList.add("active");
        this.showMedia(this.activeSet[this.currentIndex]);
    },

    showMedia(item) {
        const imgTag = document.getElementById("lightbox-img");
        const videoTag = document.getElementById("lightbox-video");
        const caption = document.getElementById("lightbox-caption-lbl");

        caption.textContent = item.title;

        // Reset display
        imgTag.classList.add("hidden");
        videoTag.classList.add("hidden");
        videoTag.pause();

        if (item.media_type === "video") {
            videoTag.src = item.url;
            videoTag.classList.remove("hidden");
            videoTag.load();
            videoTag.play();
        } else {
            imgTag.src = item.url;
            imgTag.classList.remove("hidden");
        }
    },

    closeLightbox() {
        const modal = document.getElementById("lightbox-modal");
        modal.classList.remove("active");
        
        // Stop any videos playing
        const videoTag = document.getElementById("lightbox-video");
        videoTag.pause();
        videoTag.src = "";
    },

    navigateLightbox(direction) {
        if (this.activeSet.length <= 1) return;
        this.currentIndex += direction;
        
        if (this.currentIndex < 0) {
            this.currentIndex = this.activeSet.length - 1;
        } else if (this.currentIndex >= this.activeSet.length) {
            this.currentIndex = 0;
        }

        this.showMedia(this.activeSet[this.currentIndex]);
    },

    /* --------------------------------------------------------------------------
       ADMIN PORTFOLIO MANAGER PANEL
       -------------------------------------------------------------------------- */
    renderAdminPortfolioList() {
        const container = document.getElementById("admin-portfolio-list-container");
        if (!container) return;

        if (this.items.length === 0) {
            container.innerHTML = `<p class="paragraph text-center">No portfolio assets loaded in database.</p>`;
            return;
        }

        container.innerHTML = this.items.map(item => `
            <div class="admin-portfolio-item">
                <img src="${item.media_type === 'video' ? (item.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=100&q=80') : item.url}" alt="${item.title}">
                <div class="admin-port-info">
                    <h5>${item.title}</h5>
                    <p>Category: <strong>${item.category}</strong> | Type: <strong>${item.media_type}</strong> ${item.is_featured === 1 ? ' | <span class="text-gold bold">★ Featured</span>' : ''}</p>
                </div>
                <button class="btn btn-outline-sm text-danger" onclick="Portfolio.deleteItem('${item.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `).join("");
    },

    async deleteItem(id) {
        if (!confirm("Are you sure you want to delete this portfolio item? This action is irreversible.")) return;

        try {
            await API.delete(`/api/portfolio/${id}`);
            app.showToast("Portfolio item deleted successfully!", "success");
            await this.loadGallery();
        } catch (error) {
            app.showToast(error.message, "error");
        }
    }
};
