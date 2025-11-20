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
    - `` - Home Page
    - `/about` - About Page
    - `/books/search`- Search Page
    - `/users/register` - Register Page
    - `/books/addbook` - Add Books Page
    - `/books/list` - List of Books Page
    - `/books/bargainbooks` - Bargain Books Page
    - `/users/list` - List of Users Who Registered Page
    - `/users/login` - Login Page

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