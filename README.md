# Web3 Polling App - PollChain

A decentralized web application built with modern technologies that enables users to create and manage polls on a blockchain. Users can vote on polls (one vote per poll), search and browse through polls, and delete them when needed. This project leverages both Web3 technologies and traditional web development practices to deliver a seamless and secure experience.

## Backend Repository

The backend for this project is managed separately. It provides all the necessary API endpoints and handles authentication, session management and file uploads.

Check out the backend repository here: https://github.com/namansharma3007/Poll-Chain-Backend


## Features

- **Blockchain Integration**:  
  Interact with smart contracts to create and manage polls using Web3.

- **Poll Management**:  
  Create new polls, cast votes (one per user per poll), search existing polls, browse through them, and delete polls as needed.

- **User Authentication**:  
  Secure authentication is implemented via JWT, with backend support handling token issuance and validation.

- **Avatar Upload**:  
  Users can upload and update their avatars using a combination of Multer and Cloudinary SaaS.

- **Responsive UI**:  
  Mobile-responsive design built with Tailwind CSS ensures optimal usability on all devices.

- **Real-time Notifications**:  
  Receive immediate feedback and alerts using react-hot-toast.

- **Routing and Icons**:  
  Navigate the app smoothly with react-router and enjoy a modern UI with lucide-react icons.

## Tech Stack

### Frontend

- **Vite.js** – Next generation frontend tooling for fast development and bundling.
- **React** – Component-based UI library.
- **ethers.js** – Library for interacting with the Ethereum blockchain.
- **lucide-react** – Beautiful, customizable icons.
- **react-router** – Declarative routing for React applications.
- **react-hot-toast** – Lightweight notification library.
- **Tailwind CSS** – Utility-first CSS framework for rapid UI development.

### Backend (for reference)

- **JWT** – JSON Web Tokens for authentication.
- **Multer** – Middleware for handling multipart/form-data (used for avatar uploads).
- **Cloudinary** – Cloud-based image management and delivery service.

## Installation

1. **Clone the Repository**

```bash
git clone https://github.com/namansharma3007/Poll-Chain-frontend.git
cd Poll-Chain-frontend
```

2. **Install Dependencies**

```bash
npm install
```

3. **Start the Development Server**

```bash
npm run dev
```

The app should now be running at http://localhost:3000 (or the port specified in your configuration).

## Environment Variables

Create a `.env` file in the root directory and configure the following variables as needed:

```bash
VITE_CONTRACT_ADDRESS=<contractaddress after deployment>
VITE_API_URL=<backendurl>
```

Adjust the variables to match your backend API and blockchain configuration.

## Usage

- **Creating Polls**:

  - Navigate to the "Create Poll" section to define a new poll by entering a question and a list of options.

- **Voting**:

  - Vote on polls directly from the poll listing. Each user can only cast one vote per poll.

- **Managing Polls**:

  - Search for polls by keywords, browse through existing polls, and delete polls if you have the necessary permissions.

- **User Authentication**:

  - Log in or register to access poll creation and management features. Authentication is secured with JWT. Session management is handled by the backend.

- **Avatar Upload**:

  - Upload an avatar for your profile. Avatars are stored in Cloudinary and managed by the backend.

- **Responsive UI**:
  - The app is designed to be responsive and adaptive, ensuring optimal usability on various devices.

## Contributing

Contributions are welcome! If you have any ideas or find bugs, feel free to fork the repository and open a pull request with your suggestions.

1. Fork the repository.
2. Create a new branch `git checkout -b feature/your-feature`.
3. Make your changes and commit them `git commit -m 'Add some feature'`.
4. Push to the branch `git push origin feature/your-feature`.
5. Open a pull request.
