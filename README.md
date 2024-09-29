# NoteNexus

**NoteNexus** is a  note-taking application* built using **Node.js, Express, MongoDB, and EJS**, with additional support for guest access, authentication, and a clean user interface. 

## Table of Contents
- [NoteNexus](#notenexus)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
    - [Local Development](#local-development)
  - [Environment Variables](#environment-variables)
  - [Project Structure](#project-structure)
  - [Improvements](#improvements)
  - [License](#license)
  - [Connect Mith Me](#connect-mith-me)

---

## Features
- **User Registration & Login**: Secure authentication using **JWT** with bcrypt password hashing.
- **Guest Access**: Allows temporary guest users to explore the app.
- **CRUD Operations**: Users can create, view, edit, and delete notes.
- **Search & Filtering**: Full-text search based on note title.
- **Notes Management**: Archive, delete, and restore notes.
- **Responsive UI**: Built with **Tailwind CSS** for a mobile-first design.
- **Error Handling**: Comprehensive error handling with proper HTTP status codes.
- **Secure Cookies**: Tokens are stored in cookies with secure attributes in production.

---

## Technologies Used
- **Backend**: Node.js, Express.js, MongoDB, JWT, bcrypt
- **Templating**: EJS
- **Frontend**: Tailwind CSS
- **Validation**: Zod
- **Session Management**: Cookies, JWT
- **Other**: nanoid for unique slug generation, dotenv for environment configuration

---

## Setup

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+)
- **MongoDB**

### Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/mk-manishkumar/NoteNexus.git
    cd note-taking-app
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    - Create a `.env` file in the root directory, or copy from `.env.sample`:
      ```bash
      cp .env.sample .env
      ```
    - Fill in the required environment variables (see [Environment Variables](#environment-variables)).

4. Start the development server:
    ```bash
    npm run dev
    ```

---

## Usage

### Local Development
1. Run MongoDB on your machine (or use MongoDB Atlas).
2. Use the following commands to start the app:
    ```bash
    npm run dev
    ```
3. Open your browser and go to `http://localhost:3000`.

---

## Environment Variables

| Variable           | Description                          | Example Value                 |
| ------------------ | ------------------------------------ | ----------------------------- |
| `JWT_SECRET`       | Secret for user JWT tokens           | `yourJWTSecret`               |
| `GUEST_JWT_SECRET` | Secret for guest JWT tokens          | `yourGuestJWTSecret`          |
| `MONGO_URI`        | MongoDB connection string            | `mongodb://localhost/noteApp` |
| `NODE_ENV`         | Environment (development/production) | `development`                 |
| `PORT`             | Port for running the application     | `3000`                        |


---

## Project Structure

```
├── config/                # Configuration files
├── controllers/           # Controllers for handling routes
├── middleware/            # Custom middleware functions
├── models/                # Mongoose schemas and models
├── public/                # Static files (CSS, JS, images)
├── routes/                # Route definitions
├── src/                   # Tailwind build 
├── utils/                 # Utility functions and helpers
├── views/                 # EJS templates
├── .env.sample            # Environment variables example
└── server.js              # Main server file

```

---

## Improvements

While this application is fully functional, some possible future enhancements include:
- Adding a **Rich Text Editor** for note creation.
- Integrating **OAuth** for social login options.
- Expanding the **guest functionality** to retain notes temporarily.

---

## License

This project is open source and available under the [MIT License](https://github.com/mk-manishkumar/NoteNexus/blob/main/LICENSE).

---

## Connect Mith Me
- **Twitter** - [Manish Kumar](https://twitter.com/_manishmk)
- **Email** - [manish.login01@gmail.com](mailto:manish.login01@gmail.com)

