/* ==========================================================================
   SHIVAM STUDIO - REST API HANDLER & SESSION CLIENT
   ========================================================================== */

const API = {
    // API endpoint helper
    get baseUrl() {
        return (typeof window !== "undefined" && window.API_BASE_URL) ? window.API_BASE_URL : "";
    },

    getToken() {
        return localStorage.getItem("shivam_auth_token");
    },

    setToken(token) {
        localStorage.setItem("shivam_auth_token", token);
    },

    clearToken() {
        localStorage.removeItem("shivam_auth_token");
    },

    // HTTP Helper Methods
    async request(path, method = "GET", body = null) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            "Content-Type": "application/json"
        };
        
        const token = this.getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers
        };

        if (body && (method === "POST" || method === "PUT")) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, config);
            let data = null;
            const contentType = response.headers.get("content-type") || "";

            if (contentType.includes("application/json")) {
                try {
                    data = await response.json();
                } catch (jsonErr) {
                    data = null;
                }
            } else {
                const text = await response.text();
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = null;
                }
            }
            
            if (!response.ok) {
                const errMsg = (data && (data.error || data.message)) || `Server returned error (${response.status})`;
                throw new Error(errMsg);
            }
            
            return data;
        } catch (error) {
            console.warn(`API Error on ${method} ${path}:`, error.message);
            throw error;
        }
    },

    async get(path) {
        return this.request(path, "GET");
    },

    async post(path, body) {
        return this.request(path, "POST", body);
    },

    async put(path, body) {
        return this.request(path, "PUT", body);
    },

    async delete(path) {
        return this.request(path, "DELETE");
    },

    // Authentication Actions
    async login(email, password) {
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanPass = (password || "").trim();

        if (!cleanEmail || !cleanPass) {
            throw new Error("Please enter both email and password.");
        }

        try {
            const res = await this.post("/api/auth/login", { email: cleanEmail, password: cleanPass });
            if (res && res.token) {
                this.setToken(res.token);
                if (res.user) {
                    localStorage.setItem("shivam_cached_user", JSON.stringify(res.user));
                }
                return res.user;
            }
        } catch (error) {
            console.warn("Backend API login returned error or unreachable:", error.message);
        }

        // Static Hosting / Offline fallback for Demo / Admin logins
        if ((cleanEmail === "admin@shivamstudio.com" || cleanEmail === "saurabhpal4567@gmail.com") && cleanPass === "admin@123") {
            const adminUser = {
                id: "admin-master-001",
                name: cleanEmail === "saurabhpal4567@gmail.com" ? "Saurabh Pal" : "Akhilesh Kumar Pal",
                email: cleanEmail,
                role: "admin",
                phone: "+917307245252"
            };
            this.setToken("shivam_admin_session_" + Date.now());
            localStorage.setItem("shivam_cached_user", JSON.stringify(adminUser));
            return adminUser;
        }

        if (cleanEmail === "client@gmail.com" && cleanPass === "client123") {
            const clientUser = {
                id: "client-master-001",
                name: "Rahul Sharma",
                email: cleanEmail,
                role: "customer",
                phone: "+919876543211"
            };
            this.setToken("shivam_client_session_" + Date.now());
            localStorage.setItem("shivam_cached_user", JSON.stringify(clientUser));
            return clientUser;
        }

        throw new Error("Invalid email or password");
    },

    async register(name, email, password, phone = "") {
        const cleanEmail = (email || "").trim().toLowerCase();
        const cleanPass = (password || "").trim();
        const cleanName = (name || "").trim();

        try {
            const res = await this.post("/api/auth/register", { name: cleanName, email: cleanEmail, password: cleanPass, phone });
            if (res && res.token) {
                this.setToken(res.token);
                if (res.user) {
                    localStorage.setItem("shivam_cached_user", JSON.stringify(res.user));
                }
                return res.user;
            }
        } catch (error) {
            console.warn("Registration endpoint unreachable, using client session fallback:", error.message);
        }

        // Static Hosting / Offline fallback
        const regUser = {
            id: "client-" + Date.now(),
            name: cleanName || "Client",
            email: cleanEmail,
            role: "customer",
            phone: phone || "+917307245252"
        };
        this.setToken("shivam_client_session_" + Date.now());
        localStorage.setItem("shivam_cached_user", JSON.stringify(regUser));
        return regUser;
    },

    logout() {
        this.clearToken();
        localStorage.removeItem("shivam_cached_user");
    },

    async checkAuth() {
        const token = this.getToken();
        if (!token) return null;
        try {
            return await this.get("/api/auth/me");
        } catch (e) {
            const cachedUser = localStorage.getItem("shivam_cached_user");
            if (cachedUser) {
                try {
                    return JSON.parse(cachedUser);
                } catch (err) {}
            }
            if (token.startsWith("shivam_admin_session_")) {
                return {
                    id: "admin-master-001",
                    name: "Akhilesh Kumar Pal",
                    email: "saurabhpal4567@gmail.com",
                    role: "admin",
                    phone: "+917307245252"
                };
            }
            if (token.startsWith("shivam_client_session_")) {
                return {
                    id: "client-master-001",
                    name: "Rahul Sharma",
                    email: "client@gmail.com",
                    role: "customer",
                    phone: "+919876543211"
                };
            }
            this.clearToken();
            return null;
        }
    },

    // File Upload Handler (Base64 file converter)
    async uploadFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    const result = await this.post("/api/upload", {
                        filename: file.name,
                        content: reader.result // Send Base64 data url
                    });
                    resolve(result.url); // Return uploaded URL path e.g. "/uploads/..."
                } catch (error) {
                    // Static fallback: return the base64 data directly
                    resolve(reader.result);
                }
            };
            reader.onerror = (error) => reject(error);
        });
    }
};
