// Your Instagram username
const myUsername = "an0rn";
// Helper function to delay actions
const delay = (time) => new Promise(resolve => setTimeout(resolve, time));
// Error handling function
const handleError = (error, user) => {
   console.error(`Error visiting ${user.username}:`, error.message);
   user.error = error.message; // Log the error in the user object for later review
};
async function fetchUnvisitedUser() {
   try {
      const response = await fetch('http://localhost:3005/user/unvisited');
      // Check if the request was successful
      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error);
      }
      const user = await response.json();
      console.log('Unvisited user:', user);
      // Updating to visiting
      const updateResponse = await fetch(`http://localhost:3005/user/username/${user.username}/visiting`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            visiting: true
         }) // Set visiting to true
      });
      // Check if the update was successful
      if (!updateResponse.ok) {
         const updateErrorData = await updateResponse.json();
         throw new Error(updateErrorData.error);
      }
      const updatedUser = await updateResponse.json();
      console.log('Updated user (visiting set to true):', updatedUser);
      // console.log("EXITED SUCCESSFlly");
      // Redirect to the user's Instagram profile using the 'href' property
      if (updatedUser.href) {
         window.location.href = updatedUser.href;
      } else {
         console.error('No href found for the user');
      }
      // You can now display this user on your UI
   } catch (error) {
      console.error('Error fetching unvisited user:', error.message);
      // Handle the error (show error message on the UI)
   }
}
async function fetchVisitingUnvisitedUser() {
   try {
      const response = await fetch('http://localhost:3005/user/visiting-unvisited');
      // Check if the request was successful
      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error);
      }
      const user = await response.json();
      console.log('Visiting unvisited user:', user);
      // Return the user data to be used later
      return user;
   } catch (error) {
      console.error('Error fetching visiting unvisited user:', error.message);
      // Handle the error (show error message on the UI)
   }
}
// Function to get the current user from the URL
function getCurrentUserFromUrl() {
   const currentUrl = window.location.href; // Get the current URL
   const url = new URL(currentUrl);
   // Assuming the Instagram username is the last part of the path (e.g., '/kritiilama__04/')
   const pathname = url.pathname;
   const username = pathname.split('/').filter(Boolean)[0]; // Filter to remove empty elements
   return username; // Return the extracted username
}
async function checkInitialization() {
   try {
      const response = await fetch('http://localhost:3005/init');
      // Check if the response was successful
      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.error);
      }
      // Assuming the response is a boolean indicating initialization state
      const data = await response.json();
      return data.initState === true; // Return true if isTrue is true
   } catch (error) {
      console.error('Error during initialization check:', error.message);
      // Handle the error (show error message on the UI)
      return false; // Return false in case of error
   }
}

function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}
// Function to create and append the notification system
function createNotificationSystem() {
   // Create a style element for CSS
   const style = document.createElement('style');
   style.textContent = `
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .notification {
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: center;
            width: 300px;
            animation: fadeIn 0.5s ease;
        }

        .hidden {
            display: none;
        }

        .message-container {
            margin-top: 20px;
        }

        .message {
            font-size: 18px;
            color: #333;
            margin: 10px 0;
            animation: fadeIn 0.5s ease forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
   document.head.appendChild(style); // Append styles to head
   // Create the notification container
   const notification = document.createElement('div');
   notification.id = 'notification';
   notification.className = 'notification hidden'; // Initially hidden
   // Create a heading
   const heading = document.createElement('h1');
   heading.textContent = 'Switching Users';
   notification.appendChild(heading); // Append heading to notification
   // Create a message container
   const messageContainer = document.createElement('div');
   messageContainer.id = 'messageContainer';
   messageContainer.className = 'message-container';
   notification.appendChild(messageContainer); // Append message container to notification
   // Append notification to body
   document.body.appendChild(notification);
   return messageContainer; // Return the message container for later use
}
// Function to show messages dynamically
async function showMessages(messageContainer) {
   const messages = ['Moving to the next user in 5 seconds...', 'Preparing to refresh the page...', 'You will be redirected shortly...', 'Hang tight, switching to the next user...'];
   // Show the notification div
   const notification = document.getElementById('notification');
   notification.classList.remove('hidden');
   for (const message of messages) {
      const messageElement = document.createElement('div');
      messageElement.className = 'message';
      messageElement.textContent = message;
      messageContainer.appendChild(messageElement);
      await sleep(1000); // Display each message for 1 second
   }
   await sleep(5000); // Wait an additional 5 seconds before the refresh
   // window.location.reload(); // Refresh the page to move to the next user
}

function extractUserInfo(domElement) {
   try {
      return {
         username: domElement.querySelector(`a[href^="/${myUsername}/"] span`).innerText.trim(),
         profilePicture: domElement.querySelector(`a[href^="/${myUsername}/"] img`).src,
         name: domElement.querySelector('span[dir="auto"]').innerText.trim()
      };
   } catch (e) {
      // statements
      console.log("extractUserInfo", e);
      console.log("extractUserInfo", e);
      console.log("extractUserInfo", e);
      console.log("extractUserInfo", e);
   }
   return {}
}
// Main function to fetch user and compare
async function main() {
   const unvisitedUser = await fetchVisitingUnvisitedUser(); // Await the fetch result
   const currentUser = getCurrentUserFromUrl(); // Grab the current user from the URL
   const isInitialized = await checkInitialization() || myUsername == currentUser; // Check the initialization state
   if (isInitialized) return await fetchUnvisitedUser();
   if (unvisitedUser && unvisitedUser.username === currentUser) {
      // console.log('Proceeding to unfollow steps for:', unvisitedUser ? unvisitedUser.username : 'unknown user');
      // TODO -- IMPORTANT
      await sleep(3000); // Simulate 5 seconds of work
      // Prepare the data to update user status
      // Create the notification system and show messages
      //oponing folowing list
      //oponing folowing list
      //oponing folowing list
      let isOpenAble = false
      //oponing folowing list
      //opening following list of target 
      //opening following list of target 
      try {
         document.querySelectorAll('a.x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x5n08af.x9n4tj2._a6hd[role="link"]')[1].click()
         isOpenAble = true
      } catch (e) {
         // statements
         console.log(e);
      }
      //opening following list of target
      //opening following list of target 
      await sleep(5000);
      // first ser info extracting
      // first ser info extracting
      let domElement = null
      try {
         if (isOpenAble) {
            domElement = document.querySelector('div.xyi19xy.x1ccrb07.xtf3nb5.x1pc53ja.x1lliihq.x1iyjqo2.xs83m0k.xz65tgg.x1rife3k.x1n2onr6>div>div')
         }
      } catch (e) {
         // statements
         console.log(e);
      }
      const first_user = extractUserInfo(domElement)
      console.log({
         first_user,
         isOpenAble
      });
      const updateData = {
         follows_back: false,
         visited: true,
         profilePicture: null
      };
      if (first_user?.username == myUsername) {
         //ser follow backs me
         //ser follow backs me
         updateData.follows_back = true
         //ser follow backs me
         //ser follow backs me
      } else {
         try {
            //nfolowwwing i
            //nfolowwwing i
            //nfolowwwing i
            const unfollowing_btn = document.querySelector('button._acan._acap._acat._aj1-._ap30')
            if (unfollowing_btn) {
               unfollowing_btn.click()
               await sleep(3000);
               const allDivs = document.querySelectorAll('div.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh.x1uhb9sk.x1plvlek.xryxfnj.x1iyjqo2.x2lwn1j.xeuugli.xdt5ytf.xqjyukv.x1cy8zhl.x1oa3qoh.x1nhvcw1');
               // Check if any elements were found
               if (allDivs.length === 0) {
                  console.error('Error: No matching div elements found.');
               } else {
                  // Select the last element
                  const unfollow_btn = allDivs[allDivs.length - 1];
                  await sleep(1000);
                  unfollow_btn.click()
                  await sleep(2000);
                  console.log('Last matching div element:', lastDiv);
               }
            }
            //nfolowwwing i
            //nfolowwwing i
            //nfolowwwing i
         } catch (e) {
            // statements
            console.log(e);
         }
      }
      // first ser info extracting
      // first ser info extracting
      // Hit the update status endpoint
      await fetch(`http://localhost:3005/user/username/${unvisitedUser.username}/update-status`, {
         method: 'PUT',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(updateData)
      });
      //also add fail/ success count // to orevent api rate limiting
      console.log({
         updateData
      });
      console.log(`User ${unvisitedUser.username} status updated to ${updateData}`);
      // Hit the endpoint to set initialization state to true
      await fetch('http://localhost:3005/init/set-true', {
         method: 'PUT'
      });
      console.log('Initialization state set to true after user update');
      // await sleep(5000); 
      // const messageContainer = createNotificationSystem();
      // showMessages(messageContainer);
      // Refresh the page to move to the next user
      window.location.reload(); // Correctly reload the page
   }
}
// Call the main function to execute

function extractUserInfo(domElement) {
   const userInfo = {
      username: domElement.querySelector(`a[href^="/${myUsername}/"] span`).innerText.trim(),
      profilePicture: domElement.querySelector(`a[href^="/${myUsername}/"] img`).src,
      name: domElement.querySelector('span[dir="auto"]').innerText.trim()
   };
   return userInfo;
}

function extractInstagramUserInfo(container) {
   try {
      // Check if container exists
      if (!container) throw new Error("Container not found");
      // Extract username from the anchor tag (href contains the username)
      const usernameElement = container.querySelector('a[href]');
      const username = usernameElement ? usernameElement.getAttribute('href').replaceAll('/', '') : null;
      // Extract full name (if exists)
      const fullNameElement = container.querySelector('span.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft');
      const fullName = fullNameElement ? fullNameElement.textContent.trim() : null;
      // Extract profile picture (img src)
      const profilePictureElement = container.querySelector('img');
      const profilePicture = profilePictureElement ? profilePictureElement.src : null;
      return {
         username: username || "N/A",
         href: username ? `https://www.instagram.com/${username}` :  "N/A",
         fullName: fullName || "N/A",
         profilePicture: profilePicture || "N/A"
      };
   } catch (error) {
      console.error("Error extracting Instagram user info:", error.message);
      return {
         error: error.message
      };
   }
}
const snow_globe = []
async function getFollowingList() {
   if (getCurrentUserFromUrl() == myUsername) {
      await sleep(4000)
      document.querySelectorAll(`ul.x78zum5.x1q0g3np.xieb3on>li>div>a`)[1].click()
      await sleep(4000)
      // Select the scrollable container
      const scrollContainer = document.querySelector('.xyi19xy.x1ccrb07.xtf3nb5.x1pc53ja.x1lliihq.x1iyjqo2.xs83m0k.xz65tgg.x1rife3k.x1n2onr6');
      const processedUsernames = new Set(); // Store processed usernames
      const batchSize = 100; // Process and discard in chunks of 100 users
      let processedCount = 0;
      // Variables to track last user
      let lastUser = null; // Keep track of the last processed user
      let consecutiveSameLastUserCount = 0; // Track how many times the same user is found consecutively
      while (true) {
         try {
            // Select target elements inside the scrollable container
            let targetElements = scrollContainer.querySelectorAll('div.x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3');
            // Example: Scrolling the container by a certain amount
            const visibleElements = getVisibleElements(targetElements, scrollContainer);
            scrollContainer.scrollTop += 100; // Scroll down by 100 pixels
            const users_info = visibleElements.map(e => {
               try {
                  return extractInstagramUserInfo(e); // Extract each user's info
               } catch (error) {
                  console.error('Error extracting user info:', error);
                  return null; // Return null in case of error, so we can filter it out
               }
            }).filter(Boolean); // Remove null values caused by failed extractions
            // Filter out users who have already been processed (check for duplicates)
            const uniqueUsers = users_info.filter(user => {
               if (processedUsernames.has(user.username)) {
                  return false; // Skip users we've already processed
               } else {
                  processedUsernames.add(user.username); // Mark the user as processed
                  return true; // Keep this user for processing
               }
            });
            if (uniqueUsers.length > 0) {
               // Process the user info immediately (only unique users)
               await processUserInfoCallback(uniqueUsers);
               processedCount += uniqueUsers.length;
               // Log progress and memory footprint
               console.log(`Processed ${processedCount} unique users so far.`);
               // Check the last user and compare with the previous iteration
               const currentLastUser = uniqueUsers[uniqueUsers.length - 1]?.username;
               if (currentLastUser === lastUser) {
                  consecutiveSameLastUserCount++;
               } else {
                  consecutiveSameLastUserCount = 0; // Reset the counter if a new last user is found
               }
               // Update the last processed user
               lastUser = currentLastUser;
               // If the same last user is found 4 times, break the loop
               if (consecutiveSameLastUserCount >= 4) {
                  console.log('Same last user found 4 times, no more data. Stopping the scraping process.');
                  break;
               }
               // If processedCount reaches batchSize, clear older data or adjust logic here
               if (processedCount >= batchSize) {
                  processedCount = 0; // Reset count and continue fresh
                  await sleep(30000)
               }
            }
         } catch (error) {
            console.error('Error during scraping process:', error);
         }
         await sleep(1000); // Pause for a second before repeating
      }
   } else {
      //vist the crrent user
      //vist the crrent user
      window.location.href = `https://www.instagram.com/${myUsername}/`;
      //vist the crrent user
      //vist the crrent user
   }
}
async function processUserInfoCallback(users_info) {
   snow_globe.push(...users_info)
   // Instead of storing in memory, process the data here
   // Example: Send to a server or database, or simply log
   for (let user of users_info) {

        try {
          const response = await fetch('http://localhost:3005/user/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log('Success:', data);
        } catch (error) {
          console.error('Error:', error);
        }

      // Replace this with actual processing (e.g., sending to API)
      console.log(`Processing unique user: ${user.username}`);
   }
   console.log({
      snow_globe
   });
}

function isElementVisible(el, scrollContainer) {
   const rect = el.getBoundingClientRect();
   const containerRect = scrollContainer.getBoundingClientRect();
   // Check if the element is within the visible part of the scroll container
   return (rect.top >= containerRect.top && rect.bottom <= containerRect.bottom);
}
// Function to get all visible elements
function getVisibleElements(targetElements, scrollContainer) {
   const visibleElements = [];
   targetElements.forEach(el => {
      if (isElementVisible(el, scrollContainer)) {
         visibleElements.push(el);
      }
   });
   return visibleElements;
}




// getFollowingList()
main();//to unfollow