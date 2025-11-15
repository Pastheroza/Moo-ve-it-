# Moo-ve It! - Autonomous Herd Management Simulation

TO TRY IT PRESS THIS LINK! - moo-ve-it.vercel.app

A premium, modern, and minimalist web application to monitor and manage a herd of cattle using an autonomous shepherd drone. Named "Moo-ve It!", it features a real-time map visualization of the farm, drone, and cattle, all running as a dynamic, client-side simulation.

---

## 📜 About The Project

Moo-ve It! is a sophisticated front-end application that simulates an autonomous drone managing a herd of cattle on a farm. The entire simulation—from the drone's AI and battery management to the complex behavior of the cattle—is rendered in real-time in the browser.

The project is built with a focus on modern web technologies, clean architecture, and a highly interactive user experience. It demonstrates how complex systems can be visualized effectively on the web.

## ✨ Key Features

-   **🤖 Real-time Simulation:** The positions and statuses of the drone and 30+ cows are updated multiple times per second, creating a fluid and live simulation.
-   **🛰️ Interactive SVG Map:** A fully interactive map allows users to click anywhere on the pasture to send the drone to a specific location, overriding its autonomous behavior.
-   **🧠 Autonomous Drone AI:** The drone operates on its own, patrolling the farm, returning to its base to charge when the battery is low, and automatically going idle when fully charged.
-   **🐄 Complex Herd Behavior:** Cows are not just random dots. They have distinct behaviors (`leader`, `follower`, `loner`) and are influenced by multiple forces, including herd cohesion, separation from each other, repulsion from the drone, and a general tendency to wander.
-   **🕹️ Drone Command & Control:** Users can issue specific commands to the drone, such as "Return to Base," "Herd Isolated Cows," or "Initiate Full Scan," via a dedicated control panel.
-   **📊 Dynamic Dashboard:** The UI includes several data-rich cards that display real-time information about field status (weather), drone status (battery, current action), and herd analysis (cohesion graph, AI-generated reports).
-   **Geofencing:** The simulation checks if cows have escaped the main pasture area and updates their status accordingly, which is reflected visually on the map.

## 🛠️ Tech Stack

This project leverages a modern, **build-less** frontend setup, relying on native browser features for optimal performance and simplicity.

-   **[React](https://react.dev/)**: For building the user interface with a component-based architecture.
-   **[TypeScript](https://www.typescriptlang.org/)**: For type safety and improved developer experience.
-   **[Tailwind CSS (via CDN)](https://tailwindcss.com/)**: For rapid, utility-first styling.
-   **SVG (Scalable Vector Graphics)**: For rendering the interactive map, farm areas, drone, and cattle.
-   **ES Modules & `importmap`**: The project uses native browser ES modules and an `importmap` in `index.html` to handle dependencies like React without needing a bundler (like Webpack or Vite) or a `node_modules` folder.

## 🚀 Getting Started / Running Locally

Because this project uses ES modules (`importmap`), you **cannot** simply open the `index.html` file directly in your browser from the filesystem (`file://...`). You must serve it from a local web server.

Follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/moo-ve-it.git
    cd moo-ve-it
    ```

2.  **Serve the project with a local server.**
    You can use any simple static file server. Here are a few popular options:

    -   **Using Python's built-in server (if you have Python installed):**
        ```bash
        # For Python 3
        python -m http.server 8000
        ```

    -   **Using the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code:**
        -   Install the extension from the VS Code Marketplace.
        -   Right-click on the `index.html` file in your editor and select "Open with Live Server".

    -   **Using Node.js `serve` package:**
        ```bash
        # Install serve globally (if you haven't already)
        npm install -g serve
        # Run the server
        serve .
        ```

3.  **Open the application in your browser:**
    Navigate to the address provided by your local server (e.g., `http://localhost:8000`).

## 📂 Codebase Overview

The project structure is designed to be clean and maintainable.

-   `index.html`: The main entry point. It includes the `importmap` for dependencies and loads the main script.
-   `index.tsx`: The React application's root, where the `App` component is mounted to the DOM.
-   `App.tsx`: The core component that manages the entire application state and simulation logic.
-   `components/`: Contains all the reusable React components.
    -   `MapSection.tsx`: The most complex component, responsible for rendering the SVG map and its interactive elements.
    -   `Header.tsx`, `Footer.tsx`, `HeroSection.tsx`, etc.: Presentational components that form the landing page structure.
    -   `DroneStatusCard.tsx`, `AnalysisCard.tsx`: Dashboard components for displaying real-time data.
-   `constants.ts`: Stores all the initial configuration and static data for the simulation (e.g., map dimensions, number of cows, drone base location).
-   `types.ts`: Defines all the TypeScript types and interfaces used across the application for data consistency.
-   `metadata.json`: Provides basic metadata about the application.
