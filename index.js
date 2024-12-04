const fs = require("fs"); // Require the fs module for file operations
const fetch = require("node-fetch"); // Import the fetch function from node-fetch

const count = 2;

const allItems = [];

async function fetchData() {
  for (let i = 1; i < count; i++) {
    console.log(i, `https://www.ikea.com/eg/ar/search/?q=furniture&page=${i}`);
    try {
      const response = await fetch(
        `https://www.ikea.com/eg/ar/search/?q=furniture&page=${i}`
      );
      // const data = await response.json();
      const htmlContent = await response.text();
      //   console.log(htmlContent, "result");
      allItems.push(JSON.stringify(htmlContent));
    } catch (error) {
      console.error(error);
    }
  }
  // After the loop or operation is complete, write the allItems array to a file
}

fetchData()
  .then(() => {
    fs.writeFile("output.txt", JSON.stringify(allItems, null, 2), (err) => {
      if (err) {
        console.error("Error writing to file", err);
      } else {
        console.log("Data written to file successfully!");
      }
    });
  })
  .finally(() => {
    async function processFile() {
      try {
        // Read the file content as a string
        const data = await fs.promises.readFile("output.txt", "utf-8");

        // Clean up escape sequences like \\\", \\ etc., that appear in the string
        const cleanedData = data.replace(/\\\\+/g, ""); // Remove excess backslashes

        // Regular expression to match URLs starting with 'https' and ending with '.jpg'
        const regex = /https:\/\/[^ ]+\.jpg/g;

        let matches = []; // Array to store matched URLs

        let match;
        // Use the regex to find all occurrences of the matching URL pattern
        while ((match = regex.exec(cleanedData)) !== null) {
          matches.push(match[0]); // Store the matched URL
        }

        // Output the matches found
        console.log("Matched URLs:", matches);

        // Optionally, write the matches to a file
        await fs.promises.writeFile(
          "extracted-urls.json",
          JSON.stringify(matches, null, 2)
        );
        console.log("Matched URLs written to extracted-urls.json");
      } catch (err) {
        console.error("Error reading the file:", err);
      }
    }

    processFile(); // Execute the function
  }); // Call the function

// Read the JSON file
