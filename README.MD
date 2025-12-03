# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js

---

## Features
- Built with **Node.js**, **Express**, **EJS**, **MySQL** and **CSS**.
- Multiple Routes:
    - `/` - Home Page
    - `/about` - About Page
    - `/books/search`- Search Page
    - `/users/register` - Register Page
    - `/books/addbook` - Add Books Page
    - `/books/list` - List of Books Page
    - `/books/bargainbooks` - Bargain Books Page
    - `/users/list` - List of Users Who Registered Page
    - `/users/login` - Login Page
    - `users/audit` - Audit Log Page
    - `weather` - Weather Page
    - `/api/books` - API for Books Page

## dotenv Implementation
To secure database credentials by implementing the dotenv module:

1. Installed dotenv: `npm install dotenv`
2. Created a `.env` file using the professor's recommended format:
 - BB_USER='berties_books_app'
 - BB_PASSWORD='qwertyuiop'
 - BB_DATABASE='berties_books'
3. Updated the database configuration to use `process.env.BB_USER`, `process.env.BB_PASSWORD`, and `process.env.BB_DATABASE`
4. Added `.env` to `.gitignore` to prevent accidental exposure
5. Used 'localhost' as the host since it wasn't specified in the environment variables

## Audit Login
I have implemented a comprehensive audit logging system to track all login attempts:

## Features:
- **Complete Login Tracking**: Records both successful and failed login attempts
- **Detailed Information**: Captures username, timestamp, success status, IP address, and user agent
- **Security Monitoring**: Helps identify suspicious activities and brute force attacks
- **Audit Trail**: Provides a complete history of all authentication events

## Technical Implementation:
1. **Database Table**: Created `audit_log` table with columns:
   - `username`: The username attempted
   - `attempt_time`: Timestamp of the attempt (auto-generated)
   - `success`: Boolean indicating success or failure
   - `ip_address`: Client IP address for geographic tracking
   - `user_agent`: Browser/device information

2. **Logging Function**: Implemented `logLoginAttempt()` function that automatically records:
   - All login attempts (successful and failed)
   - IP address and user agent for security analysis
   - Timestamp for chronological tracking

3. **Audit Route**: Created `/users/audit` route that displays:
   - Complete history of login attempts in descending chronological order
   - Color-coded success/failure status
   - All captured metadata in a readable table format

## Usage:
- Access the audit log at: `http://localhost:8000/users/audit`
- All login attempts are automatically recorded in real-time
- The audit log helps with security monitoring and troubleshooting authentication issues

## Data Validation
I implemented server-side validation using the `express-validator` module to ensure data integrity before processing it.

### Where Validation IS Applied:

**User Registration (`/users/registered`):**
- **Email:** validated using `.isEmail()` to ensure the user provides a functioning contact method.
- **Username:** validated using `.isLength({ min: 5, max: 20 })` to enforce consistency and database constraints.
- **Password:** validated using `.isLength({ min: 8 })` to enforce a minimum security standard (e.g., passwords like `aaaaAAAA1234!` are accepted).
- **First and Last Names:** validated using `.notEmpty()` to ensure incomplete profiles are not created.

**Add Book Form (`/books/bookadded`):**
- **Book Name:** validated with `.notEmpty()` to prevent empty book entries.
- **Price:** validated with `.isFloat({ min: 0 })` to ensure the price is a positive number.

### Where Validation is NOT Applied (Reasoning):

- **Login Route:** I did not apply strict length/format validation to login fields. The authentication process itself (checking the database) acts as the validation. Invalid input will simply fail to find a match, which is the desired behavior.
- **Search Route:** No restrictions on search term length; users may validly search for short words or partial matches.

---

## Security: Input Sanitization (XSS Prevention)
To prevent Cross-Site Scripting (XSS) attacks, I implemented the `express-sanitizer` middleware. This strips dangerous HTML tags (like `<script>`) from user inputs before they are processed or stored in the database.

### Where Sanitization IS Applied:

- **Registration Form:** `username`, `first_name`, `last_name`, and `email` are sanitized. This ensures that if a malicious user registers with a name containing a script, it will not execute when other users view the "User List" page.
- **Add Book Form:** The book name is sanitized to prevent malicious scripts from being injected into the book inventory list.
- **Search Form:** The search keyword is sanitized to prevent XSS attacks on the search results page (where the keyword is echoed back to the user).
- **Login Form:** The username is sanitized as a general precaution.

### Where Sanitization is NOT Applied:

- **Passwords:** I did not sanitize passwords. Sanitizing passwords would alter special characters (e.g., changing `<` to `&lt;`) and break hash verification, preventing legitimate users from logging in. Passwords are never displayed in HTML, so they do not pose an XSS risk.

---

## Test Users and Password Policy

- Added test user `gold` with password `smiths` in `insert_test_data.sql` for marking and local testing.
- Password validation allows strong passwords, e.g., `aaaaAAAA1234!`.
- Ensures consistent credentials across environments.

---

## Weather
Added a /weather route that shows current weather data.

Users can enter a city name in a form, and the app fetches weather data from the OpenWeatherMap API.

Displayed data includes:
- Temperature
- Humidity
- Wind speed

Error handling is implemented:
 - If the city is invalid or API fails, the page shows "City not found. Try again."

The API key is stored in .env and accessed via process.env.WEATHER_API_KEY to avoid exposing it in code.

## API for Books
Added /api/books route to allow other developers to get books data in JSON format.

Query Parameters:
 - **search**: Filter books whose names contain the search term.
 - **minprice**: Filter books priced above this value.
 - **maxprice**: Filter books priced below this value.
 - **sort**: Sort results by name or price (ascending).

**Examples:**
- Get all books:
   - http://localhost:8000/api/books

- Search for books containing "world":
   - http://localhost:8000/api/books?search=world

- Filter books between £5 and £10:
   - http://localhost:8000/api/books?min_price=5&max_price=10