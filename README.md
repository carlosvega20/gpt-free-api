# GPT-FREE-API

A ChatGPT API client that connects through the chat.openai.com Web browser app using puppeteer.


***NOTE:*** I can't guarantee you will not be blocked by using this method, although it has worked for me. OpenAI does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe. For experimental purpouses.

This code and project was generated with ChatGPT itself. Check out the prompts here:
https://chat.openai.com/share/2231cdf4-3f64-4b5f-8d4a-1cce9a3e267f
https://chat.openai.com/share/7ce86bdf-712f-4e58-8bae-69fe586e50bf


### Description:
The provided code sets up an Express server with Puppeteer to interact with the OpenAI chat interface. It can be run with different configurations using command-line arguments. The server handles both GET and POST requests, including handling verification challenges. The code installation requires Node.js and npm, and it can be executed with specified arguments for different behaviors.


## Installation:
Clone the repository or create a new directory for your project.
Navigate to the project directory in your terminal.
Install the required Node.js packages using npm (Node Package Manager):

```
npm install puppeteer express dotenv
```

## Minimum Requirements:

- Node.js (Version 12 or higher recommended)
- npm (Node Package Manager)

## Running the Code:
You can run the code with different options using the following command-line arguments:

### Run with default settings:
```
node index.js
```

### Run in non-headless mode:
```
node index.js --no-headless
```
### Run on a custom port (e.g., port 3000):
```
node index.js --port 3000
```
### Combine options (e.g., non-headless mode on port 3000):
```
node index.js --no-headless --port 3000
```
### Curl Statements Examples:

GET request:
```
curl http://localhost:4000
```
POST request with JSON data:
```
curl -X POST -H "Content-Type: application/json" -d '{"text":"Hello, ChatGPT!"}' http://localhost:4000
```

## Performance
Performance optimizations have been implemented by allowing users to specify whether Puppeteer should run in headless mode or not using command-line arguments. Additionally, the minimal_args array has been introduced to streamline the launch of the Puppeteer browser with minimal runtime arguments for improved efficiency. Furthermore, a cache for the userDataDir has been implemented to enhance performance by reusing user data directories across browser launches, reducing the overhead of recreating and reinitializing these directories for each session. These changes collectively contribute to more streamlined and efficient interactions with the Puppeteer browser, resulting in improved overall performance of the application.

Having said that, there is plently of room to keep improving performance and waiting times.

## Disclaimer
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with OpenAI or any of its subsidiaries or its affiliates. The official OpenAI website can be found at https://openai.com/. "OpenAI" as well as related names, marks, emblems and images are registered trademarks of their respective owners.

## License
Copyright 2023 Carlos Vega

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this project except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.