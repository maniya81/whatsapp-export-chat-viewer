# WhatsApp Chat Viewer 💬

[![Deploy to GitHub Pages](https://github.com/maniya81/whatsapp-export-chat-viewer/actions/workflows/deploy.yml/badge.svg)](https://github.com/maniya81/whatsapp-export-chat-viewer/actions/workflows/deploy.yml)
[![CI/CD Pipeline](https://github.com/maniya81/whatsapp-export-chat-viewer/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/maniya81/whatsapp-export-chat-viewer/actions/workflows/ci-cd.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive web application for viewing WhatsApp chat exports with media support. Built with React, TypeScript, and styled-components.

## 🌐 Live Demo

**[View Live App](https://maniya81.github.io/whatsapp-export-chat-viewer/)**

## ✨ Features

- 📱 **Mobile-First Design** - Optimized for Samsung S24 Ultra and other high-DPI devices
- 📁 **Multiple Import Formats** - Support for both `.txt` and `.zip` exports
- 🖼️ **Advanced Media Viewing** - Full-screen image viewer with zoom, pan, and touch gestures
- 🎬 **Direct Video Playback** - Full-screen video player with mobile controls
- 🔄 **Switch Side Feature** - Toggle message alignment (left/right)
- ⏰ **Proper Timestamps** - 12-hour format with authentic positioning
- ✅ **Read Receipts** - Blue double ticks for delivered messages
- 📐 **Responsive Units** - Uses em units for consistent scaling across devices
- 🎯 **Touch-Optimized** - Large touch targets and mobile-friendly interactions
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🗄️ **Single Chat Mode** - One chat at a time for simplicity

## 🚀 How to Use

1. **Visit the Live App**: [https://maniya81.github.io/whatsapp-export-chat-viewer/](https://maniya81.github.io/whatsapp-export-chat-viewer/)

2. **Export Your WhatsApp Chat**:

   - Open WhatsApp on your phone
   - Go to the chat you want to export
   - Tap on chat name → More → Export Chat
   - Choose "Include Media" for images/videos or "Without Media" for text only

3. **Import to Viewer**:

   - Click "Import WhatsApp Chat" button
   - Select your exported `.txt` or `.zip` file
   - View your chat with the authentic WhatsApp interface!

4. **Switch Sides** (Optional):
   - Use the "Switch Side" button to change message alignment
   - Toggle between left and right alignment for different perspectives

## 📋 Supported File Types

- **Text Files** (`.txt`) - Basic chat exports without media
- **ZIP Files** (`.zip`) - Full exports with images, videos, audio, and documents
- **Media Types**: JPG, PNG, GIF, MP4, MOV, MP3, WAV, PDF, DOC, etc.

## 🛠️ Technical Features

- **React 19** with TypeScript for modern development
- **Styled Components** for authentic WhatsApp styling
- **IndexedDB** for efficient local storage
- **JSZip** for handling ZIP file exports
- **Date-fns** for proper timestamp formatting
- **Vite** for fast development and building

## 🔒 Privacy & Security

- **100% Client-Side** - All processing happens in your browser
- **No Data Upload** - Your chats never leave your device
- **No Server Storage** - Everything is stored locally in your browser
- **Open Source** - Full transparency of how your data is handled

## � Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the `main` branch.

### Automatic Deployment Process

1. **Push to Main Branch** - Any push to `main` triggers the deployment
2. **Build Process** - GitHub Actions runs:
   - Node.js setup (multiple versions tested)
   - Dependency installation
   - Code linting
   - Production build
   - Artifact upload
3. **Deploy to Pages** - Automatic deployment to GitHub Pages
4. **Live URL** - Instantly available at the live demo URL

### Manual Deployment (if needed)

```bash
# Build the project
npm run build

# The dist/ folder contains the built application
# GitHub Pages will serve from this folder automatically
```

### GitHub Actions Workflows

- **`deploy.yml`** - Simple deployment workflow for GitHub Pages
- **`ci-cd.yml`** - Comprehensive CI/CD pipeline with testing
- **`dependabot.yml`** - Automatic dependency updates

### Setting Up Your Own Deployment

1. Fork this repository
2. Go to your repository Settings → Pages
3. Set Source to "GitHub Actions"
4. Push any changes to `main` branch
5. Your app will be available at `https://yourusername.github.io/whatsapp-export-chat-viewer/`

## �💻 Local Development

```bash
# Clone the repository
git clone https://github.com/maniya81/whatsapp-export-chat-viewer.git

# Navigate to project directory
cd whatsapp-export-chat-viewer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🎨 Features Overview

### Import Interface

- Clean, intuitive file import
- Support for multiple file formats
- Real-time import status

### Chat Display

- Authentic WhatsApp green theme
- Proper message bubbles with tails
- Sender identification in group chats
- Date separators between days

### Media Handling

- Lazy loading for performance
- Fullscreen image viewing
- Video playback controls
- Document download links

### Responsive Design

- Mobile-friendly interface
- Touch-optimized interactions
- Adaptive layout for different screen sizes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- WhatsApp for the original design inspiration
- React community for excellent tooling
- All contributors who helped improve this project

---

**Made with ❤️ for the WhatsApp community**
