# Byte Quiz Client

![Byte Quiz Banner](/public/byte-og-image.png)

A modern, AI-powered quiz generator built with Next.js. Byte Quiz consumes the Byte Server API to generate intelligent coding quizzes in real-time, supporting multiple languages, difficulty levels, and streaming responses.

## 🚀 Features

- **AI-Powered Generation**: Create quizzes on any programming topic using advanced LLMs.
- **Real-time Streaming**: Watch questions being generated live.
- **Interactive Quiz Mode**: Take quizzes with instant feedback and scoring.
- **Multi-language Support**: Generate content in various programming languages.
- **Modern UI**: Sleek and responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod
- **Testing**: Jest
- **Linting**: ESLint + Prettier

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [Byte Server API](https://github.com/abdulsalamcodes/byte-server) (or your own compatible backend)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/abdulsalamcodes/byte-client.git
   cd byte-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**

   Copy the example environment file:

   ```bash
   cp .env.local.example .env.local
   ```

   Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local` if your API is not running on `http://localhost:8000`.

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

We welcome contributions! Please follow these steps to contribute:

1. **Fork the Project**
2. **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Run linter
- `npm run test`: Run unit tests

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Abdul Salam - [@abdulsalamcodes](https://github.com/abdulsalamcodes)

Project Link: [https://github.com/abdulsalamcodes/byte-client](https://github.com/abdulsalamcodes/byte-client)
