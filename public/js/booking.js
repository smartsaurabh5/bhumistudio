/* ==========================================================================
   BHUMI STUDIO - ONLINE BOOKING & TRACKING CONTROLLER
   ========================================================================== */

const Booking = {
    currentStep: 1,
    selectedService: null,
    selectedPackage: null,
    selectedPrice: 0,
    referenceImageUrl: "",

    // Master Packages Configuration
    packages: {
        "Wedding Photography": [
            { name: "Silver", price: 80000, features: ["1 Photographer", "1 Day coverage", "100 Edited digital photos", "Online delivery"] },
            { name: "Gold", price: 150000, features: ["2 Photographers", "2 Days coverage", "250 Edited digital photos", "Bespoke Printed Album (40 pages)", "Drone photography included"] },
            { name: "Platinum", price: 250000, features: ["Lead Photographer + 2 assistants", "Full wedding coverage (up to 4 days)", "Unlimited photos edited", "Premium leather album & gift cases", "Drone + candid sessions"] }
        ],
        "Wedding Videography": [
            { name: "Silver", price: 90000, features: ["1 Videographer", "1 Day coverage", "30-min Edited video summary", "Full HD quality"] },
            { name: "Gold", price: 160000, features: ["2 Videographers", "2 Days coverage", "5-min Cinematic Trailer", "60-min Edited film", "Drone videography included"] },
            { name: "Platinum", price: 280000, features: ["3 Videographers (incl. candid specialist)", "Up to 4 days coverage", "10-min Cinematic Film Trailer", "2-hour Wedding Movie", "4K HDR & drone coverage"] }
        ],
        "Pre-Wedding Shoot": [
            { name: "Silver", price: 30000, features: ["4-hour session", "1 Location", "30 Edited photos", "1 Outfit change"] },
            { name: "Gold", price: 55000, features: ["Full-day session (8 hours)", "2 Locations", "60 Edited photos", "2-min Cinematic teaser video", "3 Outfit changes"] },
            { name: "Platinum", price: 90000, features: ["2 Days shoot", "Multiple locations", "100 Edited photos", "5-min Cinematic pre-wedding video", "Unlimited outfits", "Drone visual captures"] }
        ],
        "Maternity Shoot": [
            { name: "Silver", price: 15000, features: ["2-hour session", "Studio backdrop", "15 Edited photos"] },
            { name: "Gold", price: 25000, features: ["3-hour session", "Studio + Outdoor garden", "35 Edited photos", "Props provided"] },
            { name: "Platinum", price: 40000, features: ["Full-day shoot", "Luxury milk-bath or custom setups", "60 Edited photos", "Gowns and makeup artist included"] }
        ],
        "Baby Shoot": [
            { name: "Silver", price: 12000, features: ["2-hour session", "2 Prop themes", "15 Edited photos"] },
            { name: "Gold", price: 20000, features: ["3-hour session", "4 Prop themes", "30 Edited photos", "Family portrait session included"] },
            { name: "Platinum", price: 35000, features: ["Home/Studio setup", "Unlimited props", "50 Edited photos", "1-min mini video film"] }
        ],
        "Birthday Events": [
            { name: "Silver", price: 15000, features: ["3-hour coverage", "1 candid photographer", "100 digital files"] },
            { name: "Gold", price: 28000, features: ["5-hour coverage", "1 Photographer + 1 Videographer", "Full event video edit", "200 Edited photos"] },
            { name: "Platinum", price: 45000, features: ["Full event coverage", "2 Photographers + 1 Videographer", "Cinematic birthday movie", "Photobooth setup included"] }
        ],
        "Corporate Events": [
            { name: "Silver", price: 35000, features: ["4-hour coverage", "1 Photographer", "High-res business headshots included"] },
            { name: "Gold", price: 65000, features: ["Full-day coverage", "2 Photographers", "Highlight event summary video"] },
            { name: "Platinum", price: 110000, features: ["Multi-day coverage", "3 Crew members", "Promotional marketing video wrap", "Full panel interviews documented"] }
        ],
        "Product Photography": [
            { name: "Silver", price: 20000, features: ["15 Studio product catalog shots", "White background", "High-end retouching"] },
            { name: "Gold", price: 45000, features: ["40 Creative lifestyle product shots", "Prop styling & custom lighting", "Commercial use license"] },
            { name: "Platinum", price: 80000, features: ["100 Product catalog + lifestyle shots", "Infographic overlays", "15-second product commercial video"] }
        ],
        "Drone Shoots": [
            { name: "Silver", price: 25000, features: ["2 hours aerial coverage", "Raw footage delivery", "4K Resolution"] },
            { name: "Gold", price: 40000, features: ["Half-day coverage (4 hours)", "Edited 3-min highlight visual compilation"] },
            { name: "Platinum", price: 70000, features: ["Full-day visual flight mapping", "Raw files + Edited promotional movie", "8K capabilities"] }
        ],
        "Cinematic Video Production": [
            { name: "Silver", price: 50000, features: ["1 Videographer", "Half-day shoot", "1-min promotional advertisement film"] },
            { name: "Gold", price: 95000, features: ["Full-day shoot", "Director + camera operator", "3-min Corporate profile/commercial film"] },
            { name: "Platinum", price: 180000, features: ["2 Days cinema camera package", "Storyboard direction, actors casting support", "Custom color grading & licensed audio"] }
        ],
        "Video Editing & Mixing": [
            { name: "Silver", price: 15000, features: ["Editing up to 30 mins footage", "Titles and standard transitions"] },
            { name: "Gold", price: 30000, features: ["Editing up to 2 hours raw footage", "Custom audio mixing & standard color grading"] },
            { name: "Platinum", price: 60000, features: ["Full feature cinema documentary edit", "VFX, advanced color grading, multirig sync"] }
        ],
        "Album Designing": [
            { name: "Silver", price: 10000, features: ["Standard design layout", "30 Pages", "Hardcover print"] },
            { name: "Gold", price: 18000, features: ["Bespoke design theme", "50 Pages", "Premium leather wrap cover"] },
            { name: "Platinum", price: 30000, features: ["Custom box case", "80 pages luxury metallic print paper", "Digital interactive replica copy"] }
        ],
        "Live Streaming Services": [
            { name: "Silver", price: 25000, features: ["Single camera setup", "YouTube/FB private link stream", "Raw capture file"] },
            { name: "Gold", price: 45000, features: ["Dual camera switcher setup", "Overlay designs, logos & titles", "High fidelity audio stream"] },
            { name: "Platinum", price: 80000, features: ["3-camera rig layout", "Local cellular bonded backup router", "Simulcast to multiple platforms", "Live chat support display"] }
        ]
    },

    init() {
        this.bindEvents();
        this.setInitialDates();
    },

    setInitialDates() {
        const dateInput = document.getElementById("booking-date");
        if (!dateInput) return;
        
        // Prevent booking dates in the past
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    },

    bindEvents() {
        // Step navigation
        const next1 = document.getElementById("wizard-next-1");
        const next2 = document.getElementById("wizard-next-2");
        const next3 = document.getElementById("wizard-next-3");
        
        const prev2 = document.getElementById("wizard-prev-2");
        const prev3 = document.getElementById("wizard-prev-3");
        const prev4 = document.getElementById("wizard-prev-4");

        if (next1) next1.addEventListener("click", () => this.goToStep(2));
        if (next2) next2.addEventListener("click", () => this.goToStep(3));
        if (next3) next3.addEventListener("click", () => this.goToStep(4));
        
        if (prev2) prev2.addEventListener("click", () => this.goToStep(1));
        if (prev3) prev3.addEventListener("click", () => this.goToStep(2));
        if (prev4) prev4.addEventListener("click", () => this.goToStep(3));

        // Submit Booking
        const submitBtn = document.getElementById("wizard-submit-btn");
        if (submitBtn) submitBtn.addEventListener("click", () => this.submitBooking());

        // File Reference Upload
        const fileInput = document.getElementById("booking-reference-image");
        if (fileInput) fileInput.addEventListener("change", (e) => this.handleReferenceUpload(e));

        const removeRefImg = document.getElementById("btn-remove-ref-img");
        if (removeRefImg) removeRefImg.addEventListener("click", () => this.clearUploadedImage());

        // Anonymous Tracking
        const trackBtn = document.getElementById("track-booking-btn");
        if (trackBtn) trackBtn.addEventListener("click", () => this.trackBooking());
    },

    // Step navigation controller
    async goToStep(step) {
        if (step > this.currentStep) {
            // Validation checks when moving forward
            if (this.currentStep === 1) {
                const service = document.getElementById("booking-service").value;
                const date = document.getElementById("booking-date").value;
                const time = document.getElementById("booking-time").value;
                
                if (!service || !date || !time) {
                    app.showToast("Please fill service name, event date, and time.", "error");
                    return;
                }
                
                this.selectedService = service;
                this.renderPackagesGrid(service);
            }
            else if (this.currentStep === 2) {
                const checkedRadio = document.querySelector('input[name="selected-pkg-radio"]:checked');
                if (!checkedRadio) {
                    app.showToast("Please select a package pricing tier.", "error");
                    return;
                }
                this.selectedPackage = checkedRadio.value;
                this.selectedPrice = parseFloat(checkedRadio.getAttribute("data-price"));
                
                // Pre-fill user profile fields if logged in
                if (app.currentUser) {
                    document.getElementById("booking-client-name").value = app.currentUser.name;
                    document.getElementById("booking-client-email").value = app.currentUser.email;
                    document.getElementById("booking-client-phone").value = app.currentUser.phone || "";
                }
            }
            else if (this.currentStep === 3) {
                const name = document.getElementById("booking-client-name").value;
                const email = document.getElementById("booking-client-email").value;
                const phone = document.getElementById("booking-client-phone").value;
                
                if (!name || !email || !phone) {
                    app.showToast("Please complete your contact details.", "error");
                    return;
                }
                
                this.updateConfirmationSummary();
            }
        }

        // Toggle UI panels
        document.getElementById(`panel-step-${this.currentStep}`).classList.remove("active");
        document.getElementById(`indicator-step-${this.currentStep}`).classList.remove("active");
        
        this.currentStep = step;
        
        document.getElementById(`panel-step-${this.currentStep}`).classList.add("active");
        document.getElementById(`indicator-step-${this.currentStep}`).classList.add("active");
    },

    // Generate Package Grid
    renderPackagesGrid(service) {
        const container = document.getElementById("package-options-grid");
        const serviceLabel = document.getElementById("selected-service-label");
        
        if (!container) return;
        serviceLabel.textContent = `Selected: ${service}`;

        const pkgs = this.packages[service] || [];
        container.innerHTML = pkgs.map((pkg, idx) => `
            <div class="package-option-card ${idx === 1 ? 'selected' : ''}" onclick="Booking.selectPackageCard(this)">
                <input type="radio" name="selected-pkg-radio" value="${pkg.name}" data-price="${pkg.price}" ${idx === 1 ? 'checked' : ''}>
                <h4>${pkg.name} Package</h4>
                <div class="pkg-price">₹${pkg.price.toLocaleString()}</div>
                <ul>
                    ${pkg.features.map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join("")}
                </ul>
            </div>
        `).join("");
    },

    selectPackageCard(cardElement) {
        document.querySelectorAll(".package-option-card").forEach(c => c.classList.remove("selected"));
        cardElement.classList.add("selected");
        cardElement.querySelector('input[type="radio"]').checked = true;
    },

    // Handle reference visual uploads immediately
    async handleReferenceUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            app.showToast("File is too large. Choose an image under 5MB.", "error");
            e.target.value = "";
            return;
        }

        try {
            app.showLoader();
            const uploadUrl = await API.uploadFile(file);
            this.referenceImageUrl = uploadUrl;
            
            // Show preview
            document.getElementById("booking-ref-img-tag").src = uploadUrl;
            document.getElementById("booking-ref-preview").classList.remove("hidden");
            
            app.showToast("Reference file uploaded successfully!", "success");
        } catch (error) {
            app.showToast(error.message, "error");
            e.target.value = "";
        } finally {
            app.hideLoader();
        }
    },

    clearUploadedImage() {
        this.referenceImageUrl = "";
        document.getElementById("booking-reference-image").value = "";
        document.getElementById("booking-ref-preview").classList.add("hidden");
        document.getElementById("booking-ref-img-tag").src = "";
    },

    updateConfirmationSummary() {
        document.getElementById("summary-service").textContent = this.selectedService;
        document.getElementById("summary-date").textContent = document.getElementById("booking-date").value;
        document.getElementById("summary-time").textContent = document.getElementById("booking-time").value;
        document.getElementById("summary-package").textContent = `${this.selectedPackage} Package`;
        document.getElementById("summary-price").textContent = `₹${this.selectedPrice.toLocaleString()}`;
        document.getElementById("summary-client-name").textContent = document.getElementById("booking-client-name").value;
        document.getElementById("summary-client-email").textContent = document.getElementById("booking-client-email").value;
        document.getElementById("summary-client-phone").textContent = document.getElementById("booking-client-phone").value;
    },

    async submitBooking() {
        const bookingPayload = {
            service_name: this.selectedService,
            event_date: document.getElementById("booking-date").value,
            event_time: document.getElementById("booking-time").value,
            package_name: this.selectedPackage,
            client_name: document.getElementById("booking-client-name").value,
            client_email: document.getElementById("booking-client-email").value,
            client_phone: document.getElementById("booking-client-phone").value,
            special_requirements: document.getElementById("booking-requirements").value,
            reference_image: this.referenceImageUrl,
            price: this.selectedPrice
        };

        try {
            app.showLoader();
            const res = await API.post("/api/bookings", bookingPayload);
            
            // Clean Form
            this.resetWizard();
            
            // Show Success Notification Modal
            alert(`Booking Request Submitted Successfully!\n\nYour Booking Tracking ID is: ${res.booking_id}\n\nPlease save this ID to track your status on the Booking Page.`);
            
            // Redirect to dashboard or home
            if (app.currentUser) {
                app.navigateTo("dashboard");
            } else {
                app.navigateTo("home");
            }
        } catch (error) {
            app.showToast(error.message, "error");
        } finally {
            app.hideLoader();
        }
    },

    resetWizard() {
        document.getElementById("booking-form").reset();
        this.clearUploadedImage();
        this.currentStep = 1;
        this.selectedService = null;
        this.selectedPackage = null;
        this.selectedPrice = 0;
        
        document.querySelectorAll(".wizard-step-panel").forEach(p => p.classList.remove("active"));
        document.querySelectorAll(".step-indicator").forEach(i => i.classList.remove("active"));
        
        document.getElementById("panel-step-1").classList.add("active");
        document.getElementById("indicator-step-1").classList.add("active");
    },

    /* --------------------------------------------------------------------------
       ANONYMOUS BOOKING TRACKER
       -------------------------------------------------------------------------- */
    async trackBooking() {
        const idInput = document.getElementById("track-booking-id");
        const resultContainer = document.getElementById("booking-track-result");
        
        if (!idInput || !idInput.value.trim()) {
            app.showToast("Please enter a valid Booking ID.", "error");
            return;
        }

        try {
            app.showLoader();
            const booking = await API.get(`/api/bookings/track/${idInput.value.trim()}`);
            
            let statusBadge = "";
            if (booking.status === "pending") statusBadge = `<span class="badge badge-pending">Pending Review</span>`;
            else if (booking.status === "confirmed") statusBadge = `<span class="badge badge-gold">Confirmed</span>`;
            else if (booking.status === "completed") statusBadge = `<span class="badge badge-success">Completed</span>`;
            else statusBadge = `<span class="badge badge-danger">Cancelled</span>`;

            resultContainer.innerHTML = `
                <p><strong>Service:</strong> ${booking.service_name} (${booking.package_name} Package)</p>
                <p><strong>Event Date:</strong> ${booking.event_date} at ${booking.event_time}</p>
                <p><strong>Tracking Status:</strong> ${statusBadge}</p>
                <p><strong>Quote Total:</strong> ₹${booking.price.toLocaleString()}</p>
                <p class="help-text mt-2"><i class="fa-solid fa-circle-exclamation"></i> For adjustments, contact support with this tracking ID.</p>
            `;
            resultContainer.classList.remove("hidden");
            app.showToast("Booking record located!", "success");
        } catch (error) {
            resultContainer.innerHTML = `<p class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> No booking found matching that tracking ID.</p>`;
            resultContainer.classList.remove("hidden");
            app.showToast("Record not found.", "error");
        } finally {
            app.hideLoader();
        }
    }
};
