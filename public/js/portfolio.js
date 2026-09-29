/* ==========================================================================
   SHIVAM STUDIO - PORTFOLIO AND LIGHTBOX CONTROLLER
   ========================================================================== */

const Portfolio = {
    items: [],
    currentIndex: 0,
    activeFilter: "all",

    async init() {
        this.setupLightbox();
        this.bindFilterClicks();
        await this.loadGallery();
    },

    bindFilterClicks() {
        const tabs = document.querySelectorAll("#portfolio-filters-tabs .filter-tab");
        tabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const category = tab.getAttribute("data-filter");
                this.setFilter(category);
            });
        });
    },

    defaultItems: [
        {
            id: "port-wed-001",
            title: "Royal Indian Wedding Ceremony",
            category: "wedding",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-01 10:00:00"
        },
        {
            id: "port-wed-002",
            title: "Bride & Groom Royal Portraits",
            category: "wedding",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-02 11:00:00"
        },
        {
            id: "port-wed-003",
            title: "Traditional Varmala & Mandap Moments",
            category: "wedding",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-03 12:00:00"
        },
        {
            id: "port-wed-004",
            title: "Cinematic Wedding Film Trailer",
            category: "wedding",
            media_type: "video",
            url: "https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-kissing-under-the-veil-44365-large.mp4",
            thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
            is_featured: 1,
            created_at: "2026-09-04 14:00:00"
        },
        {
            id: "port-pre-001",
            title: "Romantic Sunset Pre-Wedding Glow",
            category: "pre-wedding",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1519225495810-7517c24a2ed7?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-05 15:00:00"
        },
        {
            id: "port-pre-002",
            title: "Heritage Palace Couple Story",
            category: "pre-wedding",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 0,
            created_at: "2026-09-06 16:00:00"
        },
        {
            id: "port-pre-003",
            title: "Pre-Wedding Romantic Teaser Film",
            category: "pre-wedding",
            media_type: "video",
            url: "https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-a-forest-43223-large.mp4",
            thumbnail: "https://images.unsplash.com/photo-1519225495810-7517c24a2ed7?auto=format&fit=crop&w=600&q=80",
            is_featured: 1,
            created_at: "2026-09-07 17:00:00"
        },
        {
            id: "port-mat-001",
            title: "Maternity Golden Glow",
            category: "maternity",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-08 18:00:00"
        },
        {
            id: "port-mat-002",
            title: "Floral Studio Maternity Portrait",
            category: "maternity",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 0,
            created_at: "2026-09-09 19:00:00"
        },
        {
            id: "port-baby-001",
            title: "Newborn Sweet Dreams & Props",
            category: "baby",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1519689680058-324335c77ebe?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-10 20:00:00"
        },
        {
            id: "port-baby-002",
            title: "1st Birthday Cake Smash Celebration",
            category: "baby",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 0,
            created_at: "2026-09-11 21:00:00"
        },
        {
            id: "port-eve-001",
            title: "Grand Haldi & Sangeet Celebration",
            category: "event",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-12 22:00:00"
        },
        {
            id: "port-eve-002",
            title: "Corporate Gala & Leadership Summit",
            category: "event",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 0,
            created_at: "2026-09-13 23:00:00"
        },
        {
            id: "port-drn-001",
            title: "Aerial View of Royal Wedding Venue",
            category: "drone",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-14 10:00:00"
        },
        {
            id: "port-drn-002",
            title: "Aerial Beach Resort Drone Shoot",
            category: "drone",
            media_type: "video",
            url: "https://assets.mixkit.co/videos/preview/mixkit-top-aerial-view-of-a-sandy-beach-with-sea-waves-44161-large.mp4",
            thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
            is_featured: 1,
            created_at: "2026-09-15 11:00:00"
        },
        {
            id: "port-prd-001",
            title: "Luxury Perfume & Brand Commercial",
            category: "product",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 1,
            created_at: "2026-09-16 12:00:00"
        },
        {
            id: "port-prd-002",
            title: "Gourmet Culinary Commercial Shoot",
            category: "product",
            media_type: "image",
            url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
            thumbnail: "",
            is_featured: 0,
            created_at: "2026-09-17 13:00:00"
        }
    ],

    async loadGallery() {
        try {
            // 1. Fetch from Firebase Realtime Cloud Database (Global sync across all devices)
            let cloudItems = [];
            try {
                cloudItems = (await API.cloud.getPortfolio()) || [];
            } catch (err) {
                console.warn("Cloud DB portfolio fetch note:", err.message);
            }

            // 2. Fetch from backend API if available
            let apiItems = [];
            try {
                apiItems = (await API.get("/api/portfolio")) || [];
            } catch (e) {}

            // 3. Fetch from localStorage cache
            let localItems = [];
            try {
                localItems = JSON.parse(localStorage.getItem("shivam_portfolio_items") || "[]");
            } catch (e) {}

            // Merge items: Default items -> local -> API -> Cloud (cloud takes priority)
            const map = new Map();
            if (this.defaultItems) {
                this.defaultItems.forEach(item => item && item.id && map.set(item.id, item));
            }
            localItems.forEach(item => item && item.id && map.set(item.id, item));
            apiItems.forEach(item => item && item.id && map.set(item.id, item));
            cloudItems.forEach(item => item && item.id && map.set(item.id, item));

            this.items = Array.from(map.values()).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

            if (this.items.length === 0 && this.defaultItems) {
                this.items = this.defaultItems;
            }

            // Cache to local storage
            try {
                localStorage.setItem("shivam_portfolio_items", JSON.stringify(this.items));
            } catch (e) {}

            this.renderHighlights();
            this.renderGalleryGrid();
            this.renderAdminPortfolioList();
        } catch (error) {
            console.error("Failed to load portfolio items:", error);
            if (this.defaultItems && this.defaultItems.length > 0) {
                this.items = this.defaultItems;
                this.renderHighlights();
                this.renderGalleryGrid();
                this.renderAdminPortfolioList();
            }
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
        if (!confirm("Are you sure you want to delete this portfolio item? This action will remove it from all devices.")) return;

        try {
            app.showLoader();
            // 1. Delete from Firebase Cloud DB
            await API.cloud.deletePortfolioItem(id);

            // 2. Try backend API
            try {
                await API.delete(`/api/portfolio/${id}`);
            } catch (error) {}

            // 3. Remove from local storage
            try {
                let localItems = JSON.parse(localStorage.getItem("shivam_portfolio_items") || "[]");
                localItems = localItems.filter(item => item.id !== id);
                localStorage.setItem("shivam_portfolio_items", JSON.stringify(localItems));
            } catch (e) {}

            app.showToast("Portfolio item deleted successfully across all devices!", "success");
            await this.loadGallery();
        } catch (error) {
            app.showToast(error.message, "error");
        } finally {
            app.hideLoader();
        }
    }
};
