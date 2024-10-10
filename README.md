# Instagram Unfollow Chrome Extension

This Chrome extension helps you automatically unfollow Instagram users who don't follow you back. It scrapes your following list and unfollows users based on specific conditions, with added human-like delays to avoid getting banned by Instagram.

## Features
- Scrapes your Instagram following list and stores it in a MongoDB database.
- Unfollows users who are not following you back.
- Rate limiting and delay mechanisms to mimic human activity.
- API for user info storage and configuration to avoid infinite loops.

## Technologies Used
- **Chrome Extension API** for interacting with Instagram's UI.
- **Node.js** for running the backend API.
- **MongoDB** for storing following data.
- **JavaScript** for logic implementation.

## Installation

### Prerequisites
1. **Node.js** and **npm** installed on your machine.
2. **MongoDB** instance to store scraped data.
3. Chrome browser to install and use the extension.

### Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/MarsToPluto/IG-Unfollow.git
   ```

2. Navigate to the API folder and start the API server:
   ```bash
   cd IG-Unfollow/API
   npm install
   npm start
   ```

3. Open Chrome and go to the extensions page (`chrome://extensions/`).

4. Enable **Developer mode**.

5. Click on **Load unpacked** and select the `IG-Unfollow` folder to load the extension.

6. Go to your Instagram profile page, then load the extension. Once the page is refreshed, the scraping process will start.

## How to Use

### 1. Scraping the Following List
- Open your Instagram profile page.
- Start the extension and refresh the page.
- The extension will scrape your **following list** and store the data in your MongoDB database.

### 2. Unfollowing Users
- After scraping, comment out the `getFollowingList()` function in `content.js`.
- Uncomment the `main()` function in `content.js`.
- Refresh the extension by reloading it in the Chrome extensions page.
- The extension will now start unfollowing users who don't follow you back. You can track the stats in your MongoDB following collection.

### 3. Important Configurations
- **Start the API**: Ensure the API server is running from the `/API` folder to store scraped data.
- **Change username**: Update the line `const myUsername = "YourUsername";` in the script to your actual Instagram username.

### 4. Next Steps
- Add a UI for easier configuration to switch between scraping and unfollowing modes without editing `content.js`.
- Add rate limiting and further delays to prevent getting blocked by Instagram.
  
## Notes
- This extension is for educational purposes only. Use at your own risk to avoid violating Instagram’s terms of service.
