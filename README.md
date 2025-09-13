# Blockchain Attendance System

A decentralized attendance management system built using Solidity, Web3.js, and MetaMask.  
It allows teachers to add students, mark attendance, and students to view their profiles and attendance records — all stored securely on the Ethereum Sepolia Test Network.

## Features
- Teacher Dashboard
  - Connect wallet (MetaMask)
  - Add students with name, roll number, and wallet address
  - Mark attendance (date + status)
  - View teacher profile
  - Download monthly attendance (CSV)

- Student Dashboard
  - Connect wallet (MetaMask)
  - View own profile
  - Check attendance by date
  - 
## Technologies Used
- Solidity (0.8.19) – Smart contract for attendance logic  
- Web3.js – Frontend blockchain interaction  
- MetaMask – Wallet integration  
- HTML/CSS/JS – User-friendly dashboards  

## Project Structure
attendance/
│── index.html # Login page
│── teacher.html # Teacher dashboard
│── student.html # Student dashboard
│── shared.js # Shared Web3 & contract logic
│── AttendanceSystem.sol # Solidity smart contract

## How to Run
1. Clone this repo  
2. Open `index.html` in your browser  
3. Connect MetaMask (Sepolia testnet)  
4. Use Teacher or Student dashboard  

## Notes
- Ensure you have MetaMask installed and configured for Sepolia Test Network.  
- Only the contract owner (teacher) can add students and mark attendance.  
