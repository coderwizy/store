
// Static DigiWallet Application
class DigiWalletApp {
    constructor() {
        this.currentUser = null;
        this.currentView = 'wallet';
        this.balance = 2450.00;
        this.monthlyIncome = 3200.00;
        this.monthlyExpenses = 750.00;
        
        this.transactions = [
            { id: 1, type: 'income', amount: 2500, description: 'Freelance Project', category: 'freelance', date: new Date('2024-01-15') },
            { id: 2, type: 'expense', amount: 65, description: 'Grocery Shopping', category: 'food', date: new Date('2024-01-14') },
            { id: 3, type: 'income', amount: 700, description: 'Consulting Fee', category: 'freelance', date: new Date('2024-01-13') },
            { id: 4, type: 'expense', amount: 45, description: 'Gas Station', category: 'transport', date: new Date('2024-01-12') },
            { id: 5, type: 'expense', amount: 120, description: 'Electricity Bill', category: 'utilities', date: new Date('2024-01-11') }
        ];
        
        this.marketplaceProducts = [
            { id: 1, title: 'Premium Analytics Dashboard', description: 'Advanced analytics tools for business insights', price: 99.99, icon: 'fas fa-chart-line' },
            { id: 2, title: 'Mobile App Template', description: 'Ready-to-use mobile application template', price: 149.99, icon: 'fas fa-mobile-alt' },
            { id: 3, title: 'SEO Optimization Tool', description: 'Boost your website ranking with AI-powered SEO', price: 79.99, icon: 'fas fa-search' },
            { id: 4, title: 'Cloud Storage Pro', description: 'Unlimited cloud storage with advanced security', price: 19.99, icon: 'fas fa-cloud' },
            { id: 5, title: 'Digital Marketing Suite', description: 'Complete marketing automation platform', price: 199.99, icon: 'fas fa-bullhorn' },
            { id: 6, title: 'E-commerce Builder', description: 'Build your online store in minutes', price: 89.99, icon: 'fas fa-store' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateBalance();
        this.renderTransactions();
        this.renderMarketplace();
        
        // Check if user is already logged in (simulate with localStorage)
        const savedUser = localStorage.getItem('digiwallet_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
    }
    
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const view = item.getAttribute('data-view');
                this.switchView(view);
            });
        });
        
        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Transaction modal
        const addTransactionBtn = document.getElementById('add-transaction-btn');
        const transactionModal = document.getElementById('transaction-modal');
        const closeTransactionModal = document.getElementById('close-transaction-modal');
        const cancelTransaction = document.getElementById('cancel-transaction');
        const transactionForm = document.getElementById('transaction-form');
        
        addTransactionBtn.addEventListener('click', () => this.openModal('transaction-modal'));
        closeTransactionModal.addEventListener('click', () => this.closeModal('transaction-modal'));
        cancelTransaction.addEventListener('click', () => this.closeModal('transaction-modal'));
        transactionForm.addEventListener('submit', (e) => this.handleAddTransaction(e));
        
        // Download functionality
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.addEventListener('click', () => this.downloadProject());
        
        // Settings
        const darkModeToggle = document.getElementById('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => this.toggleDarkMode(e.target.checked));
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }
    
    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        // Simple authentication (in real app, this would be secure)
        if (username && password) {
            this.currentUser = { username, loginTime: new Date() };
            localStorage.setItem('digiwallet_user', JSON.stringify(this.currentUser));
            this.showDashboard();
        } else {
            alert('Please enter both username and password');
        }
    }
    
    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('digiwallet_user');
        this.showLogin();
    }
    
    showLogin() {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('dashboard-screen').style.display = 'none';
    }
    
    showDashboard() {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'flex';
    }
    
    switchView(viewName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${viewName}-view`).classList.add('active');
        
        this.currentView = viewName;
    }
    
    updateBalance() {
        document.getElementById('current-balance').textContent = `$${this.balance.toFixed(2)}`;
        document.getElementById('monthly-income').textContent = `+$${this.monthlyIncome.toFixed(2)}`;
        document.getElementById('monthly-expenses').textContent = `-$${this.monthlyExpenses.toFixed(2)}`;
    }
    
    renderTransactions() {
        const transactionsList = document.getElementById('transactions-list');
        transactionsList.innerHTML = '';
        
        // Sort transactions by date (most recent first)
        const sortedTransactions = [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedTransactions.slice(0, 5).forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction-item';
            
            const sign = transaction.type === 'income' ? '+' : '-';
            const amountClass = transaction.type === 'income' ? 'income' : 'expense';
            
            transactionElement.innerHTML = `
                <div class="transaction-info">
                    <div class="transaction-description">${transaction.description}</div>
                    <div class="transaction-category">${this.formatCategory(transaction.category)}</div>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${sign}$${transaction.amount.toFixed(2)}
                </div>
            `;
            
            transactionsList.appendChild(transactionElement);
        });
    }
    
    renderMarketplace() {
        const marketplaceGrid = document.getElementById('marketplace-grid');
        marketplaceGrid.innerHTML = '';
        
        this.marketplaceProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            
            productElement.innerHTML = `
                <div class="product-image">
                    <i class="${product.icon}"></i>
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price}</div>
                    <button class="primary-btn" onclick="digiWallet.purchaseProduct(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                        Purchase
                    </button>
                </div>
            `;
            
            marketplaceGrid.appendChild(productElement);
        });
    }
    
    handleAddTransaction(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newTransaction = {
            id: this.transactions.length + 1,
            type: formData.get('transaction-type'),
            amount: parseFloat(formData.get('transaction-amount')),
            description: formData.get('transaction-description'),
            category: formData.get('transaction-category'),
            date: new Date()
        };
        
        this.transactions.unshift(newTransaction);
        
        // Update balance
        if (newTransaction.type === 'income') {
            this.balance += newTransaction.amount;
            this.monthlyIncome += newTransaction.amount;
        } else {
            this.balance -= newTransaction.amount;
            this.monthlyExpenses += newTransaction.amount;
        }
        
        this.updateBalance();
        this.renderTransactions();
        this.closeModal('transaction-modal');
        
        // Reset form
        e.target.reset();
        
        // Show success message
        this.showNotification('Transaction added successfully!', 'success');
    }
    
    purchaseProduct(productId) {
        const product = this.marketplaceProducts.find(p => p.id === productId);
        if (product && this.balance >= product.price) {
            this.balance -= product.price;
            this.monthlyExpenses += product.price;
            
            // Add transaction
            const purchaseTransaction = {
                id: this.transactions.length + 1,
                type: 'expense',
                amount: product.price,
                description: `Purchased: ${product.title}`,
                category: 'shopping',
                date: new Date()
            };
            
            this.transactions.unshift(purchaseTransaction);
            
            this.updateBalance();
            this.renderTransactions();
            
            this.showNotification(`Successfully purchased ${product.title}!`, 'success');
        } else {
            this.showNotification('Insufficient balance for this purchase.', 'error');
        }
    }
    
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }
    
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
    
    formatCategory(category) {
        const categoryMap = {
            'food': 'Food & Dining',
            'transport': 'Transportation',
            'entertainment': 'Entertainment',
            'utilities': 'Utilities',
            'shopping': 'Shopping',
            'salary': 'Salary',
            'freelance': 'Freelance',
            'investment': 'Investment'
        };
        return categoryMap[category] || category;
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    toggleDarkMode(enabled) {
        // This would implement dark mode theme switching
        if (enabled) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('digiwallet_dark_mode', 'true');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('digiwallet_dark_mode', 'false');
        }
    }
    
    downloadProject() {
        // Create a simple text file with project info
        const projectInfo = `
DigiWallet Static App
====================

Current Balance: $${this.balance.toFixed(2)}
Monthly Income: $${this.monthlyIncome.toFixed(2)}
Monthly Expenses: $${this.monthlyExpenses.toFixed(2)}

Recent Transactions:
${this.transactions.slice(0, 10).map(t => 
    `- ${t.description}: ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)} (${this.formatCategory(t.category)})`
).join('\n')}

Marketplace Products:
${this.marketplaceProducts.map(p => 
    `- ${p.title}: $${p.price} - ${p.description}`
).join('\n')}

Generated: ${new Date().toLocaleString()}
        `.trim();
        
        const blob = new Blob([projectInfo], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `digiwallet-export-${new Date().toISOString().split('T')[0]}.txt`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Project data downloaded successfully!', 'success');
    }
    
    // Save data to localStorage periodically
    saveData() {
        const appData = {
            balance: this.balance,
            monthlyIncome: this.monthlyIncome,
            monthlyExpenses: this.monthlyExpenses,
            transactions: this.transactions
        };
        localStorage.setItem('digiwallet_data', JSON.stringify(appData));
    }
    
    // Load data from localStorage
    loadData() {
        const savedData = localStorage.getItem('digiwallet_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.balance = data.balance || this.balance;
            this.monthlyIncome = data.monthlyIncome || this.monthlyIncome;
            this.monthlyExpenses = data.monthlyExpenses || this.monthlyExpenses;
            this.transactions = data.transactions || this.transactions;
        }
    }
}

// Initialize the application
let digiWallet;

document.addEventListener('DOMContentLoaded', () => {
    digiWallet = new DigiWalletApp();
    
    // Auto-save data every 30 seconds
    setInterval(() => {
        if (digiWallet.currentUser) {
            digiWallet.saveData();
        }
    }, 30000);
    
    // Load saved data on startup
    digiWallet.loadData();
    digiWallet.updateBalance();
    digiWallet.renderTransactions();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (digiWallet && digiWallet.currentUser) {
        digiWallet.saveData();
    }
});
