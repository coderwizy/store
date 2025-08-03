// SandyVault Digital Marketplace - Main JavaScript File

class SandyVault {
    constructor() {
        this.currentUser = null;
        this.cart = [];
        this.wishlist = [];
        this.products = this.initializeProducts();
        this.filteredProducts = [...this.products];
        this.darkTheme = false;
        this.debounceTimer = null;
        
        this.init();
        this.initTheme();
    }

    init() {
        // Check if user is logged in
        this.checkAuthStatus();
        
        // Initialize page-specific functionality
        if (document.body.classList.contains('login-page')) {
            this.initLoginPage();
        } else if (document.body.classList.contains('dashboard-page')) {
            this.initDashboardPage();
        } else if (document.body.classList.contains('admin-page')) {
            this.initAdminPage();
        }
    }

    // Authentication Methods
    checkAuthStatus() {
        const user = localStorage.getItem('sandyVaultUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                if (this.currentUser.isAdmin) {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }
        } else if (document.body.classList.contains('dashboard-page') || document.body.classList.contains('admin-page')) {
            window.location.href = 'index.html';
        }
    }

    login(username, password) {
        // Check for admin credentials
        if (username === 'sandy' && password === '098123456') {
            this.currentUser = {
                username: username,
                loginTime: new Date().toISOString(),
                isAdmin: true
            };
            localStorage.setItem('sandyVaultUser', JSON.stringify(this.currentUser));
            return 'admin';
        }
        // Accept any other username/password combination
        else if (username.trim() && password.trim()) {
            this.currentUser = {
                username: username,
                loginTime: new Date().toISOString(),
                isAdmin: false
            };
            localStorage.setItem('sandyVaultUser', JSON.stringify(this.currentUser));
            return 'user';
        }
        return false;
    }

    logout() {
        this.currentUser = null;
        this.cart = [];
        localStorage.removeItem('sandyVaultUser');
        localStorage.removeItem('sandyVaultCart');
        window.location.href = 'index.html';
    }

    // Login Page Methods
    initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Add input animations
        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginBtn = document.getElementById('loginBtn');
        
        // Clear previous errors
        this.clearErrors();
        
        // Validate inputs
        if (!this.validateLoginForm(username, password)) {
            return;
        }
        
        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            const loginResult = this.login(username, password);
            if (loginResult) {
                // Success animation
                loginBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                loginBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                setTimeout(() => {
                    if (loginResult === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                // Error handling
                this.showError('password', 'Please enter both username and password');
                loginBtn.classList.remove('loading');
                loginBtn.disabled = false;
            }
        }, 1000);
    }

    validateLoginForm(username, password) {
        let isValid = true;
        
        if (!username) {
            this.showError('username', 'Username is required');
            isValid = false;
        }
        
        if (!password) {
            this.showError('password', 'Password is required');
            isValid = false;
        }
        
        return isValid;
    }

    showError(fieldId, message) {
        const errorElement = document.getElementById(fieldId + 'Error');
        const inputElement = document.getElementById(fieldId);
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        if (inputElement) {
            inputElement.style.borderColor = 'var(--danger-color)';
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.form-input');
        
        errorElements.forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
        
        inputElements.forEach(element => {
            element.style.borderColor = 'var(--border-color)';
        });
    }

    // Dashboard Page Methods
    initDashboardPage() {
        this.loadCart();
        this.loadWishlist();
        this.displayUserInfo();
        this.renderProducts();
        this.initEventListeners();
        this.updateProductCount();
        this.initLiveAnalytics();
        this.initNotificationSystem();
        this.initAdvancedFeatures();
    }

    displayUserInfo() {
        const usernameElement = document.getElementById('username');
        if (usernameElement && this.currentUser) {
            usernameElement.textContent = this.currentUser.username;
        }
    }

    loadCart() {
        const savedCart = localStorage.getItem('sandyVaultCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
            this.updateCartDisplay();
        }
    }

    saveCart() {
        localStorage.setItem('sandyVaultCart', JSON.stringify(this.cart));
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            if (totalItems > 0) {
                cartCount.style.display = 'block';
            } else {
                cartCount.style.display = 'none';
            }
        }
    }

    updateProductCount() {
        const totalProductsElement = document.getElementById('totalProducts');
        if (totalProductsElement) {
            totalProductsElement.textContent = this.products.length;
        }
    }

    initEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        // Navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Search and filters with debouncing
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const ratingFilter = document.getElementById('ratingFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.debouncedSearch(e.target.value));
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.applyFilters());
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => this.applyFilters());
        }

        if (ratingFilter) {
            ratingFilter.addEventListener('change', (e) => this.applyFilters());
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => this.applyFilters());
        }

        // Modal
        const modalOverlay = document.getElementById('modalOverlay');
        const modalClose = document.getElementById('modalClose');

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        e.currentTarget.parentElement.classList.add('active');
        
        // Show the appropriate section
        this.showSection(section);
        
        // Update analytics section visibility
        this.updateAnalyticsVisibility(section);
    }

    showSection(sectionName) {
        // Hide all sections first
        const allSections = document.querySelectorAll('.dashboard-summary, .analytics-section, .controls-section, .products-section, .product-category, .portfolio-section, .tools-section');
        allSections.forEach(section => {
            section.style.display = 'none';
        });

        if (sectionName === 'home') {
            // Show home sections
            const homeElements = document.querySelectorAll('.dashboard-summary, .analytics-section, .controls-section, .products-section');
            homeElements.forEach(element => {
                element.style.display = 'block';
            });
        } else if (sectionName === 'portfolio') {
            // Show portfolio section
            const portfolioSection = document.getElementById('portfolio-section');
            if (portfolioSection) {
                portfolioSection.style.display = 'block';
            }
        } else if (sectionName === 'tools') {
            // Show tools section
            const toolsSection = document.getElementById('tools-section');
            if (toolsSection) {
                toolsSection.style.display = 'block';
            }
        } else {
            // Show specific product category section
            const targetSection = document.getElementById(`${sectionName}-section`);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        }

        // Update page title based on section
        const sectionTitles = {
            'home': 'Dashboard',
            'portfolio': 'Portfolio',
            'tools': 'Tools Collection',
            'courses': 'Courses',
            'ebooks': 'Ebooks', 
            'bundles': 'Bundles',
            'projects': 'Projects'
        };
        
        document.title = `${sectionTitles[sectionName] || 'Dashboard'} - SandyVault`;
    }

    updateAnalyticsVisibility(section) {
        const analyticsSection = document.querySelector('.analytics-section');
        if (analyticsSection) {
            // Only show analytics on home page
            if (section === 'home') {
                analyticsSection.style.display = 'block';
            } else {
                analyticsSection.style.display = 'none';
            }
        }
    }

    handleSearch(query) {
        this.filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        this.renderProducts();
    }

    handleCategoryFilter(category) {
        if (category === 'all') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => product.category === category);
        }
        this.renderProducts();
    }

    handleSort(sortBy) {
        switch (sortBy) {
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
        }
        this.renderProducts();
    }

    renderProducts() {
        const categories = ['courses', 'ebooks', 'bundles', 'projects'];
        
        categories.forEach(category => {
            const grid = document.getElementById(`${category}Grid`);
            if (grid) {
                const categoryProducts = this.filteredProducts.filter(p => p.category === category);
                grid.innerHTML = categoryProducts.map(product => this.createProductCard(product)).join('');
            }
        });
        
        // Update wishlist buttons after rendering
        setTimeout(() => this.updateWishlistButtons(), 100);
    }

    createProductCard(product) {
        const categoryIcons = {
            'courses': 'fa-graduation-cap',
            'ebooks': 'fa-book',
            'bundles': 'fa-box',
            'projects': 'fa-code'
        };
        
        return `
            <div class="product-card fade-in" data-product-id="${product.id}">
                <button class="wishlist-toggle" data-product-id="${product.id}" onclick="app.toggleWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="product-image">
                    <i class="fas ${categoryIcons[product.category] || 'fa-file'}"></i>
                </div>
                <div class="product-content">
                    <div class="product-header">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">$${product.price}</div>
                    </div>
                    <div class="product-rating">
                        <div class="rating-stars">${this.generateStars(product.rating)}</div>
                        <span class="rating-text">(${product.rating})</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn btn-outline" onclick="app.showProductModal(${product.id})">
                            <i class="fas fa-eye"></i>
                            View Details
                        </button>
                        <button class="btn btn-primary" onclick="app.addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalImage = document.getElementById('modalImage');
        const modalPrice = document.getElementById('modalPrice');
        const modalRating = document.getElementById('modalRating');
        const modalDescription = document.getElementById('modalDescription');
        const modalFeatures = document.getElementById('modalFeatures');
        const addToCartModal = document.getElementById('addToCartModal');

        const categoryIcons = {
            'courses': 'fa-graduation-cap',
            'ebooks': 'fa-book',
            'bundles': 'fa-box',
            'projects': 'fa-code'
        };
        
        modalTitle.textContent = product.name;
        modalImage.style.display = 'none';
        modalImage.parentElement.innerHTML = `
            <div class="modal-image-placeholder">
                <i class="fas ${categoryIcons[product.category] || 'fa-file'}"></i>
            </div>
        `;
        modalPrice.textContent = `$${product.price}`;
        modalRating.innerHTML = `
            <div class="rating-stars">${this.generateStars(product.rating)}</div>
            <span class="rating-text">(${product.rating} rating)</span>
        `;
        modalDescription.textContent = product.fullDescription || product.description;
        
        if (product.features) {
            modalFeatures.innerHTML = `
                <h4>What's Included:</h4>
                <ul>
                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            `;
        }

        addToCartModal.onclick = () => {
            this.addToCart(productId);
            this.closeModal();
        };

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    toggleMobileMenu() {
        const nav = document.getElementById('mainNav');
        nav.classList.toggle('mobile-open');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-color)' : 'var(--primary-color)'};
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Initialize hardcoded product data
    initializeProducts() {
        return [
            // Courses
            {
                id: 1,
                name: "Complete Web Development Bootcamp",
                category: "courses",
                price: 89.99,
                rating: 4.8,
                image: "",
                description: "Master full-stack development with HTML, CSS, JavaScript, React, Node.js, and MongoDB.",
                fullDescription: "This comprehensive bootcamp covers everything you need to become a full-stack web developer. From front-end technologies like HTML5, CSS3, and modern JavaScript to back-end development with Node.js and database management with MongoDB.",
                features: [
                    "50+ hours of video content",
                    "Real-world projects portfolio",
                    "Certificate of completion",
                    "Lifetime access to updates",
                    "Community support forum"
                ]
            },
            {
                id: 2,
                name: "Advanced React & Redux Mastery",
                category: "courses",
                price: 69.99,
                rating: 4.9,
                image: "",
                description: "Deep dive into React ecosystem with hooks, context, Redux, and modern patterns.",
                fullDescription: "Take your React skills to the next level with advanced concepts, state management, performance optimization, and modern development patterns.",
                features: [
                    "Advanced React patterns",
                    "Redux Toolkit mastery",
                    "Performance optimization",
                    "Testing strategies",
                    "Production deployment"
                ]
            },
            {
                id: 3,
                name: "Python Data Science & Machine Learning",
                category: "courses",
                price: 94.99,
                rating: 4.7,
                image: "",
                description: "Learn data analysis, visualization, and machine learning with Python, Pandas, and Scikit-learn.",
                fullDescription: "Comprehensive course covering data science fundamentals, statistical analysis, machine learning algorithms, and real-world applications using Python.",
                features: [
                    "Python fundamentals",
                    "Data manipulation with Pandas",
                    "Visualization with Matplotlib",
                    "Machine learning algorithms",
                    "Real datasets and projects"
                ]
            },

            // Ebooks
            {
                id: 4,
                name: "Clean Code: Best Practices Guide",
                category: "ebooks",
                price: 24.99,
                rating: 4.9,
                image: "",
                description: "Essential guide to writing maintainable, readable, and efficient code.",
                fullDescription: "Learn the principles and practices of writing clean, maintainable code that your future self and teammates will thank you for.",
                features: [
                    "300+ pages of content",
                    "Code examples in multiple languages",
                    "Refactoring techniques",
                    "Industry best practices",
                    "Downloadable PDF & EPUB"
                ]
            },
            {
                id: 5,
                name: "JavaScript: The Definitive Guide",
                category: "ebooks",
                price: 34.99,
                rating: 4.8,
                image: "",
                description: "Complete reference for modern JavaScript development and ES6+ features.",
                fullDescription: "Comprehensive guide covering all aspects of JavaScript from basic syntax to advanced concepts including async programming, modules, and latest ES features.",
                features: [
                    "500+ pages comprehensive guide",
                    "ES6+ modern features",
                    "Async programming patterns",
                    "DOM manipulation techniques",
                    "Multiple format downloads"
                ]
            },
            {
                id: 6,
                name: "System Design Interview Prep",
                category: "ebooks",
                price: 29.99,
                rating: 4.7,
                image: "",
                description: "Master system design concepts for technical interviews and real-world applications.",
                fullDescription: "Prepare for system design interviews with detailed explanations of scalable architectures, database design, caching strategies, and distributed systems.",
                features: [
                    "Real interview questions",
                    "Step-by-step solutions",
                    "Scalability patterns",
                    "Database design principles",
                    "Case study examples"
                ]
            },

            // Bundles
            {
                id: 7,
                name: "Full-Stack Developer Ultimate Bundle",
                category: "bundles",
                price: 199.99,
                rating: 4.9,
                image: "",
                description: "Complete package with courses, ebooks, and project templates for full-stack development.",
                fullDescription: "Everything you need to become a professional full-stack developer including courses, reference materials, project templates, and exclusive bonuses.",
                features: [
                    "5 comprehensive courses",
                    "10 reference ebooks",
                    "Project starter templates",
                    "Code review sessions",
                    "1-year mentorship access"
                ]
            },
            {
                id: 8,
                name: "Data Science Master Collection",
                category: "bundles",
                price: 149.99,
                rating: 4.8,
                image: "",
                description: "Complete data science learning path with Python, R, and machine learning resources.",
                fullDescription: "Master data science with this comprehensive bundle including courses, datasets, project templates, and industry-standard tools and libraries.",
                features: [
                    "Python & R courses",
                    "Machine learning algorithms",
                    "Real-world datasets",
                    "Jupyter notebook templates",
                    "Industry case studies"
                ]
            },

            // Projects
            {
                id: 9,
                name: "E-commerce React Application",
                category: "projects",
                price: 49.99,
                rating: 4.8,
                image: "",
                description: "Complete e-commerce application built with React, Redux, and modern tools.",
                fullDescription: "Production-ready e-commerce application with user authentication, shopping cart, payment integration, and admin dashboard.",
                features: [
                    "Complete source code",
                    "Setup documentation",
                    "Database schemas",
                    "API documentation",
                    "Deployment guides"
                ]
            },
            {
                id: 10,
                name: "Social Media Dashboard",
                category: "projects",
                price: 39.99,
                rating: 4.7,
                image: "",
                description: "Analytics dashboard with data visualization and real-time updates.",
                fullDescription: "Modern dashboard application with interactive charts, real-time data updates, user management, and responsive design.",
                features: [
                    "React + TypeScript",
                    "Chart.js integration",
                    "Real-time WebSocket updates",
                    "Responsive design",
                    "Testing suite included"
                ]
            },
            {
                id: 11,
                name: "Task Management App",
                category: "projects",
                price: 34.99,
                rating: 4.6,
                image: "",
                description: "Full-featured task management application with team collaboration features.",
                fullDescription: "Comprehensive project management tool with drag-and-drop functionality, team collaboration, file sharing, and progress tracking.",
                features: [
                    "Drag & drop interface",
                    "Team collaboration",
                    "File upload system",
                    "Progress tracking",
                    "Email notifications"
                ]
            },
            {
                id: 12,
                name: "Cryptocurrency Portfolio Tracker",
                category: "projects",
                price: 44.99,
                rating: 4.5,
                image: "",
                description: "Track cryptocurrency investments with real-time prices and portfolio analytics.",
                fullDescription: "Professional crypto portfolio tracker with real-time price data, profit/loss calculations, portfolio analytics, and price alerts.",
                features: [
                    "Real-time price feeds",
                    "Portfolio analytics",
                    "Price alerts system",
                    "Historical data charts",
                    "Export functionality"
                ]
            }
        ];
    }

    // Admin Page Methods
    initAdminPage() {
        this.displayAdminInfo();
        this.initAdminEventListeners();
        this.loadAdminData();
        this.populateActivityFeed();
    }

    displayAdminInfo() {
        const adminUsernameElement = document.getElementById('adminUsername');
        if (adminUsernameElement && this.currentUser) {
            adminUsernameElement.textContent = this.currentUser.username;
        }
    }

    initAdminEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    loadAdminData() {
        // Update total products count
        const totalProductsElement = document.getElementById('totalProducts');
        if (totalProductsElement) {
            totalProductsElement.textContent = this.products.length;
        }
    }

    populateActivityFeed() {
        const activityFeed = document.getElementById('activityFeed');
        if (!activityFeed) return;

        const activities = [
            {
                icon: 'fa-user-plus',
                title: 'New user registered',
                time: '2 minutes ago'
            },
            {
                icon: 'fa-shopping-cart',
                title: 'Order #1234 completed',
                time: '15 minutes ago'
            },
            {
                icon: 'fa-star',
                title: 'New product review (5 stars)',
                time: '1 hour ago'
            },
            {
                icon: 'fa-download',
                title: 'Digital product downloaded',
                time: '2 hours ago'
            },
            {
                icon: 'fa-credit-card',
                title: 'Payment processed successfully',
                time: '3 hours ago'
            }
        ];

        activityFeed.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }

    // Live Analytics System
    initLiveAnalytics() {
        this.analyticsData = {
            visitors: 128,
            downloads: 47,
            revenue: 1247,
            rating: 4.9
        };
        
        // Update analytics every 5 seconds
        setInterval(() => {
            this.updateAnalytics();
        }, 5000);
    }

    updateAnalytics() {
        // Simulate live data updates
        const visitors = document.getElementById('liveVisitors');
        const downloads = document.getElementById('todayDownloads');
        const revenue = document.getElementById('todayRevenue');
        const rating = document.getElementById('avgRating');

        if (visitors) {
            this.analyticsData.visitors += Math.floor(Math.random() * 3);
            visitors.textContent = this.analyticsData.visitors;
        }

        if (downloads) {
            if (Math.random() > 0.7) {
                this.analyticsData.downloads += 1;
                downloads.textContent = this.analyticsData.downloads;
                this.showNotification('New download completed!', 'success');
            }
        }

        if (revenue) {
            if (Math.random() > 0.8) {
                const newRevenue = Math.floor(Math.random() * 100) + 20;
                this.analyticsData.revenue += newRevenue;
                revenue.textContent = `$${this.analyticsData.revenue.toLocaleString()}`;
                this.showNotification(`+$${newRevenue} revenue generated!`, 'success');
            }
        }
    }

    // Notification System
    initNotificationSystem() {
        // Show welcome notification
        setTimeout(() => {
            this.showNotification('Welcome to SandyVault! Explore our digital marketplace.', 'info');
        }, 2000);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Enhanced Cart System
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            this.showNotification(`Updated ${product.name} quantity in cart`, 'success');
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1
            });
            this.showNotification(`${product.name} added to cart!`, 'success');
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }

    // Enhanced Theme System
    initTheme() {
        const savedTheme = localStorage.getItem('sandyVaultTheme');
        if (savedTheme === 'dark') {
            this.enableDarkTheme();
        }
    }

    toggleTheme() {
        if (this.darkTheme) {
            this.disableDarkTheme();
        } else {
            this.enableDarkTheme();
        }
    }

    enableDarkTheme() {
        document.documentElement.classList.add('dark-theme');
        this.darkTheme = true;
        localStorage.setItem('sandyVaultTheme', 'dark');
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    disableDarkTheme() {
        document.documentElement.classList.remove('dark-theme');
        this.darkTheme = false;
        localStorage.setItem('sandyVaultTheme', 'light');
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    // Advanced Features Initialization
    initAdvancedFeatures() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Cart modal
        const cartBtn = document.getElementById('cartBtn');
        const cartModal = document.getElementById('cartModal');
        const cartModalClose = document.getElementById('cartModalClose');

        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.showCartModal());
        }

        if (cartModalClose) {
            cartModalClose.addEventListener('click', () => this.closeModal('cartModal'));
        }

        // Wishlist modal
        const wishlistBtn = document.getElementById('wishlistBtn');
        const wishlistModal = document.getElementById('wishlistModal');
        const wishlistModalClose = document.getElementById('wishlistModalClose');

        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => this.showWishlistModal());
        }

        if (wishlistModalClose) {
            wishlistModalClose.addEventListener('click', () => this.closeModal('wishlistModal'));
        }

        // Account modal
        const accountBtn = document.getElementById('accountBtn');
        const accountModal = document.getElementById('accountModal');
        const accountModalClose = document.getElementById('accountModalClose');

        if (accountBtn) {
            accountBtn.addEventListener('click', () => this.showAccountModal());
        }

        if (accountModalClose) {
            accountModalClose.addEventListener('click', () => this.closeModal('accountModal'));
        }

        // Checkout functionality
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.processCheckout());
        }

        // Close modals on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                e.target.style.display = 'none';
            }
        });
    }

    // Advanced Search with Debouncing
    debouncedSearch(query) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }

    // Enhanced Filtering System
    applyFilters() {
        const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('categoryFilter')?.value || 'all';
        const priceFilter = document.getElementById('priceFilter')?.value || 'all';
        const ratingFilter = document.getElementById('ratingFilter')?.value || 'all';
        const sortFilter = document.getElementById('sortFilter')?.value || 'name';

        // Start with all products
        let filtered = [...this.products];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchQuery) ||
                product.description.toLowerCase().includes(searchQuery) ||
                product.tags?.some(tag => tag.toLowerCase().includes(searchQuery))
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }

        // Apply price filter
        if (priceFilter !== 'all') {
            const [min, max] = this.parsePriceRange(priceFilter);
            filtered = filtered.filter(product => {
                const price = product.price;
                if (max === null) return price >= min;
                return price >= min && price <= max;
            });
        }

        // Apply rating filter
        if (ratingFilter !== 'all') {
            const minRating = parseFloat(ratingFilter.replace('+', ''));
            filtered = filtered.filter(product => product.rating >= minRating);
        }

        // Apply sorting
        filtered = this.sortProducts(filtered, sortFilter);

        this.filteredProducts = filtered;
        this.renderProducts();
        this.showFilterResults(filtered.length);
    }

    parsePriceRange(range) {
        switch (range) {
            case '0-25': return [0, 25];
            case '25-50': return [25, 50];
            case '50-100': return [50, 100];
            case '100+': return [100, null];
            default: return [0, null];
        }
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'newest':
                return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            case 'popularity':
                return sorted.sort((a, b) => b.salesCount - a.salesCount);
            default:
                return sorted;
        }
    }

    showFilterResults(count) {
        this.showToast(`Found ${count} products`, 'info');
    }

    // Wishlist System
    loadWishlist() {
        const savedWishlist = localStorage.getItem('sandyVaultWishlist');
        if (savedWishlist) {
            this.wishlist = JSON.parse(savedWishlist);
            this.updateWishlistDisplay();
        }
    }

    saveWishlist() {
        localStorage.setItem('sandyVaultWishlist', JSON.stringify(this.wishlist));
        this.updateWishlistDisplay();
    }

    toggleWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingIndex = this.wishlist.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            this.wishlist.splice(existingIndex, 1);
            this.showToast(`${product.name} removed from wishlist`, 'info');
        } else {
            this.wishlist.push({
                id: productId,
                name: product.name,
                price: product.price,
                addedDate: new Date().toISOString()
            });
            this.showToast(`${product.name} added to wishlist!`, 'success');
        }
        
        this.saveWishlist();
        this.updateWishlistButtons();
    }

    updateWishlistDisplay() {
        const wishlistCount = document.getElementById('wishlistCount');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
            wishlistCount.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    updateWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.wishlist-toggle');
        wishlistButtons.forEach(button => {
            const productId = parseInt(button.dataset.productId);
            const isWishlisted = this.wishlist.some(item => item.id === productId);
            button.classList.toggle('active', isWishlisted);
        });
    }

    // Enhanced Modal System
    showCartModal() {
        this.renderCartModal();
        this.showModal('cartModal');
    }

    showWishlistModal() {
        this.renderWishlistModal();
        this.showModal('wishlistModal');
    }

    showAccountModal() {
        this.renderAccountModal();
        this.showModal('accountModal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Cart Modal Rendering
    renderCartModal() {
        const cartContent = document.getElementById('cartContent');
        const cartTotal = document.getElementById('cartTotal');
        
        if (!cartContent || !cartTotal) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = '<div class="empty-cart"><p>Your cart is empty</p></div>';
            cartTotal.textContent = '0.00';
            return;
        }

        const cartHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="app.updateCartQuantity(${item.id}, ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="quantity-btn" onclick="app.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        cartContent.innerHTML = cartHTML;
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    // Wishlist Modal Rendering
    renderWishlistModal() {
        const wishlistContent = document.getElementById('wishlistContent');
        if (!wishlistContent) return;

        if (this.wishlist.length === 0) {
            wishlistContent.innerHTML = '<div class="empty-wishlist"><p>Your wishlist is empty</p></div>';
            return;
        }

        const wishlistHTML = this.wishlist.map(item => {
            const product = this.products.find(p => p.id === item.id);
            return `
                <div class="wishlist-item">
                    <div class="cart-item-image">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                    </div>
                    <div style="display: flex; gap: var(--spacing-sm);">
                        <button class="btn btn-primary btn-sm" onclick="app.addToCart(${item.id})">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="app.toggleWishlist(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        wishlistContent.innerHTML = wishlistHTML;
    }

    // Account Modal Rendering
    renderAccountModal() {
        const profileUsername = document.getElementById('profileUsername');
        const profileEmail = document.getElementById('profileEmail');
        const memberSince = document.getElementById('memberSince');

        if (profileUsername && this.currentUser) {
            profileUsername.textContent = this.currentUser.username;
        }

        if (profileEmail && this.currentUser) {
            profileEmail.textContent = `${this.currentUser.username.toLowerCase()}@sandyvault.com`;
        }

        if (memberSince && this.currentUser) {
            const joinDate = new Date(this.currentUser.loginTime);
            memberSince.textContent = joinDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            });
        }
    }

    // Enhanced Cart Operations
    updateCartQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
            return;
        }

        const cartItem = this.cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity = newQuantity;
            this.saveCart();
            this.renderCartModal();
            this.updateCartDisplay();
        }
    }

    removeFromCart(productId) {
        const product = this.products.find(p => p.id === productId);
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartModal();
        this.updateCartDisplay();
        
        if (product) {
            this.showToast(`${product.name} removed from cart`, 'info');
        }
    }

    // Checkout Process
    processCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty!', 'error');
            return;
        }

        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Simulate checkout process
        this.showToast('Processing payment...', 'info');
        
        setTimeout(() => {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            this.closeModal('cartModal');
            this.showToast(`Payment successful! Total: $${total.toFixed(2)}`, 'success');
        }, 2000);
    }

    // Enhanced Toast System
    showToast(message, type = 'info', duration = 4000) {
        // Remove existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <i class="toast-icon ${iconMap[type]}"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// CSS for notifications
const notificationStyles = `
@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOutRight {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

.notification-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-weight: 500;
}
`;

// Add notification styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Admin Panel Actions
class AdminActions {
    static viewProducts() {
        app.showNotification('Products management panel would open here', 'info');
    }

    static addProduct() {
        app.showNotification('Add new product modal would open here', 'info');
    }

    static viewUsers() {
        app.showNotification('User management panel would open here', 'info');
    }

    static userAnalytics() {
        app.showNotification('User analytics dashboard would open here', 'info');
    }

    static viewSales() {
        app.showNotification('Sales report would open here', 'info');
    }

    static exportData() {
        app.showNotification('Data export started', 'success');
    }

    static systemSettings() {
        app.showNotification('System settings panel would open here', 'info');
    }

    static systemHealth() {
        app.showNotification('System health monitor would open here', 'info');
    }

    static goToDashboard() {
        window.location.href = 'dashboard.html';
    }

    static backupData() {
        app.showNotification('Database backup initiated', 'success');
    }

    static maintainanceMode() {
        app.showNotification('Maintenance mode toggled', 'info');
    }

    static sendNotification() {
        app.showNotification('User notification sent', 'success');
    }
}

// Make admin actions globally available
window.adminApp = AdminActions;

// Initialize the application
const app = new SandyVault();

// Global functions for inline event handlers
window.app = app;

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to elements
    const animatedElements = document.querySelectorAll('.product-card, .summary-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});
