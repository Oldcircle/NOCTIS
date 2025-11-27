# NOCTIS // EIDON PORTFOLIO

**[EN]**  
A high-end, immersive creative developer portfolio built with React, TypeScript, and WebGL. It features a "Post-Modern Cyberpunk" aesthetic, interactive "Dual Reality" backgrounds, and a fully functional AI Terminal Assistant powered by Google Gemini (with support for OpenAI, DeepSeek, Claude, and more).

**[ZH]**  
一个基于 React、TypeScript 和 WebGL 构建的高端沉浸式创意开发者作品集网站。它具有“后现代赛博朋克”美学，交互式“双重现实”背景，以及由 Google Gemini 驱动的全功能 AI 终端助手（支持 OpenAI、DeepSeek、Claude 等多种模型）。

---

## 🌌 Features // 功能特性

### 1. Dual Reality Background // 双重现实背景
- **System Layer (Surface)**: A minimalist, dark grid representing the digital void.
- **City Layer (Deep)**: A vibrant Cyberpunk City revealed only by the "Flashlight" cursor effect.
- **Interaction**:
  - **Hover**: The cursor cuts through the system layer to reveal the city.
  - **Click**: Toggles the reality, expanding the city view to full screen.

### 2. AI Terminal Assistant // AI 终端助手
- **Persona**: "Noctis System" - A helpful but mysterious cyberpunk AI.
- **Capabilities**: Can answer questions about Eidon's projects (Xiangqi, Neon Survivor, etc.), skills, and contact info.
- **Multi-Provider Support**:
  - **Built-in**: Google Gemini, OpenAI, Anthropic (Claude), DeepSeek, Moonshot (Kimi), Alibaba Qwen, Ollama (Local).
  - **Configuration**: Users can configure their own API keys and endpoints via the GUI Settings Modal.
  - **Privacy**: API Keys are stored securely in the browser's `localStorage`.

### 3. Immersive UI // 沉浸式 UI
- **Custom Cursor**: Magnetic, responsive custom cursor with state awareness.
- **Glitch Effects**: Text and visual glitch animations on interaction.
- **3D Tilt Cards**: Project cards respond to mouse movement with 3D perspective transformations.
- **Sound Design (Visual)**: UI elements mimic a HUD (Heads-Up Display) experience.

### 4. Bilingual Support // 双语支持
- Full support for **English** and **Chinese (Simplified)**.
- Instant toggling via the navigation bar.

---

## 🛠️ Tech Stack // 技术栈

- **Core**: React 18, TypeScript, Vite (or Create React App)
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **AI Integration**: `@google/genai` SDK, Native `fetch` for OpenAI-compatible APIs.
- **Icons**: Lucide React
- **Typography**: Space Grotesk, Syncopate, JetBrains Mono, Noto Sans SC.

---

## 🚀 Installation & Setup // 安装与设置

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/noctis-portfolio.git
    cd noctis-portfolio
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm start
    ```

4.  **Build for Production**
    ```bash
    npm run build
    ```

---

## ⚙️ AI Configuration // AI 配置指南

The site comes with a default configuration using Google Gemini. Users can add their own models via the UI.

1.  Click the **Chat Bubble** in the bottom right corner.
2.  Click the **Settings (Gear)** icon in the chat header.
3.  **To add a new provider**:
    - Click **New / 新建**.
    - Select a provider (e.g., DeepSeek, OpenAI).
    - Enter your **API Key**.
    - The **Base URL** and **Model Name** will auto-fill with defaults, but you can customize them (e.g., for local Ollama setup).
    - Click **Save**.

**Note**: API Keys are never sent to a backend server. They are used directly from the client-side to call the respective AI APIs.

---

## 📂 Project Structure // 项目结构

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # React Components
│   │   ├── AIChat.tsx          # Chat Terminal & Logic
│   │   ├── AIConfigModal.tsx   # Settings Modal
│   │   ├── ArtistCard.tsx      # Project/Work Card
│   │   ├── FluidBackground.tsx # Interactive Background
│   │   ├── GlitchText.tsx      # Typography Effects
│   │   └── ...
│   ├── services/
│   │   └── geminiService.ts    # AI API Handlers (Gemini, OpenAI, etc.)
│   ├── types.ts         # TypeScript Definitions
│   ├── App.tsx          # Main Application Entry
│   └── index.tsx        # Render Root
├── package.json
└── README.md
```

---

## 📜 License

© 2025 EIDON NOCTIS. All Rights Reserved.
