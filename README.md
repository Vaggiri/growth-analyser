
# Growth Tracker - Startup Analytics Dashboard

A self-contained, responsive, front-end dashboard for tracking a startup's key growth metrics. This tool provides a clean interface for visualizing project earnings, client distribution, and overall revenue growth over time, all from a single HTML file.

*(Note: You should replace this with a screenshot of your own project)*

## ✨ Features

  - **📊 Interactive Dashboard:**

      - At-a-glance KPI cards for Total Earnings, Monthly Growth, Average Project Value, and Best Performing Month.
      - Time-based filtering to view data for the current week, month, year, or all time.
      - **Growth Curve Chart:** A cumulative line chart visualizing total revenue over time.
      - **Project Distribution Chart:** A bar chart showing monthly revenue from projects.
      - **Client Distribution Chart:** A doughnut chart breaking down revenue by top clients.

  - **🗂️ Project Management:**

      - A dedicated "Projects" page with a comprehensive table of all projects.
      - Functionality to **Create, Edit, and Delete** projects through an intuitive modal form.
      - Search and filter capabilities for easy project lookup (UI elements are in place).

  - **📱 Responsive Design:**

      - Fully responsive layout that works on desktop, tablet, and mobile devices.
      - Collapsible sidebar and mobile-friendly navigation.

  - **🔌 Data Handling:**

      - Currently operates using locally generated sample data for demonstration purposes.
      - Includes placeholder functions (`saveToGoogleSheets`) designed for easy integration with a backend like Google Sheets.

## 🛠️ Tech Stack

  - **Frontend:** HTML5, Vanilla JavaScript (ES6)
  - **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  - **Charts:** [Chart.js](https://www.chartjs.org/)
  - **Animations:** [Animate.css](https://animate.style/)

## 🚀 Getting Started

This project is designed to be extremely simple to set up and run, as it has no backend dependencies.

### Prerequisites

You only need a modern web browser (like Chrome, Firefox, or Edge).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/growth-tracker.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd growth-tracker
    ```

3.  **Open the file:**
    Simply open the `index.html` file in your web browser.

    > **Pro Tip:** For the best experience, you can use a simple live server. If you have VS Code, the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension is a great choice.

## ⚙️ How It Works

The application is built within a single `index.html` file.

  - **Data Initialization:** On page load, the `loadSampleData()` JavaScript function generates a set of 20 random projects to populate the dashboard.
  - **State Management:** All project data is stored in a JavaScript array (`let projects = []`). Any additions, edits, or deletions manipulate this array directly. **Note: Data will reset upon page refresh.**
  - **UI Rendering:** The UI is dynamically updated whenever the data changes. Functions like `updateDashboardMetrics()`, `updateProjectsTable()`, and `updateCharts()` are called to re-render the components with the latest data.
  - **Backend Placeholder:** The function `saveToGoogleSheets(action, id, data)` is a placeholder. In a real-world application, you would replace its `console.log` with an API call (e.g., using `gapi` for Google Sheets) to persist the data.

## 🎯 Future Improvements

This project serves as a great template. Here are some potential features to add:

  - [ ] **Google Sheets Integration:** Implement the `saveToGoogleSheets` function to create a truly persistent data source.
  - [ ] **User Authentication:** Add a login system to protect the data.
  - [ ] **Data Export:** Add a feature to export project data as a CSV file.
  - [ ] **Functional Filters:** Wire up the search and filter UI on the "Projects" page.
  - [ ] **Settings Page:** Build out the "Settings" page to allow users to customize their experience (e.g., set currency, targets).

## 🤝 Contributing

Contributions are welcome\! If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.