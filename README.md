
# DigiWallet Static App

A fully static version of the DigiWallet application built with vanilla HTML, CSS, and JavaScript. This version can be easily hosted on GitHub Pages, Netlify, Vercel, or any static hosting service.

## Features

- **Wallet Management**: Track balance, income, and expenses
- **Transaction History**: Add and view financial transactions
- **Business Dashboard**: Monitor business metrics
- **Marketplace**: Browse and purchase digital products
- **Analytics**: View financial data visualization
- **Settings**: Customize user preferences
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: Data persistence using browser localStorage
- **Download Functionality**: Export wallet data

## File Structure

```
static/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Getting Started

### Local Development

1. Clone or download the files
2. Open `index.html` in a web browser
3. Login with any username and password
4. Start using the wallet features

### Hosting on GitHub Pages

1. Create a new repository on GitHub
2. Upload these files to the repository
3. Go to repository Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your app will be available at `https://yourusername.github.io/repository-name`

### Hosting on Netlify

1. Drag and drop the `static` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your app will be instantly deployed

### Hosting on Vercel

1. Upload files to a GitHub repository
2. Connect the repository to Vercel
3. Deploy with default settings

## Usage

### Authentication
- Use any username and password to login
- Session is maintained using localStorage

### Wallet Features
- View current balance and monthly statistics
- Add income/expense transactions
- Browse transaction history
- Categories include: Food, Transportation, Entertainment, Utilities, Shopping, Salary, Freelance, Investment

### Business Dashboard
- View business revenue and profit metrics
- Track active clients

### Marketplace
- Browse digital products
- Purchase items (deducted from wallet balance)
- Products include analytics tools, templates, and software

### Analytics
- Placeholder for financial charts and insights

### Settings
- Update profile information
- Toggle preferences
- Dark mode support (implementation ready)

## Technical Details

### Data Storage
- Uses browser localStorage for data persistence
- Automatic data saving every 30 seconds
- Data export functionality included

### Responsive Design
- Mobile-first CSS approach
- Breakpoints: 768px (tablet), 480px (mobile)
- Touch-friendly navigation on mobile

### Browser Support
- Modern browsers with ES6+ support
- localStorage API required
- CSS Grid and Flexbox support needed

## Customization

### Styling
Edit `styles.css` to customize:
- Color scheme (CSS custom properties in `:root`)
- Typography and spacing
- Component styling
- Responsive breakpoints

### Functionality
Edit `script.js` to modify:
- Transaction categories
- Marketplace products
- Business metrics
- Data structure

### Content
Edit `index.html` to change:
- Page title and meta tags
- Text content
- Form fields
- Navigation items

## Security Considerations

This is a client-side only application suitable for:
- Personal finance tracking
- Demonstration purposes
- Educational projects

For production use with real financial data:
- Implement proper authentication
- Use HTTPS encryption
- Add server-side validation
- Consider using a secure backend

## License

MIT License - Feel free to use and modify for personal or commercial projects.
