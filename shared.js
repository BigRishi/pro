let web3;
let contract;
const contractAddress = "0xf9C62B1bcD793a4E483f472b9A925b77202F5968"; // Your Sepolia contract address

// ✅ Full ABI copied from your Solidity contract
const contractABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "studentAddress", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "rollNumber", "type": "string" }
    ],
    "name": "StudentAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "studentAddress", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "date", "type": "string" },
      { "indexed": false, "internalType": "bool", "name": "isPresent", "type": "bool" }
    ],
    "name": "AttendanceMarked",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      { "internalType": "string", "name": "_rollNumber", "type": "string" },
      { "internalType": "address", "name": "_walletAddress", "type": "address" }
    ],
    "name": "addStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_studentAddress", "type": "address" },
      { "internalType": "string", "name": "_date", "type": "string" },
      { "internalType": "bool", "name": "_isPresent", "type": "bool" }
    ],
    "name": "markAttendance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_studentAddress", "type": "address" }],
    "name": "getStudent",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "rollNumber", "type": "string" },
      { "internalType": "address", "name": "walletAddress", "type": "address" },
      { "internalType": "bool", "name": "isRegistered", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_rollNumber", "type": "string" }],
    "name": "getStudentByRollNumber",
    "outputs": [
      { "internalType": "address", "name": "studentAddress", "type": "address" },
      { "internalType": "string", "name": "name", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_studentAddress", "type": "address" },
      { "internalType": "string", "name": "_date", "type": "string" }
    ],
    "name": "getAttendance",
    "outputs": [
      { "internalType": "bool", "name": "isPresent", "type": "bool" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllStudents",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStudentCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_date", "type": "string" }],
    "name": "getMyAttendance",
    "outputs": [
      { "internalType": "bool", "name": "isPresent", "type": "bool" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bool", "name": "exists", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyProfile",
    "outputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "rollNumber", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_studentAddress", "type": "address" }],
    "name": "isStudentRegistered",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// ================== CONNECT WALLET ==================
async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        document.getElementById("account").innerText = "Connected: " + accounts[0];

        contract = new web3.eth.Contract(contractABI, contractAddress);

        // if owner section exists in page
        if (document.getElementById("owner")) {
            const owner = await contract.methods.owner().call();
            document.getElementById("owner").innerText = "Contract Owner: " + owner;
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// ================== TEACHER FUNCTIONS ==================
async function addStudent() {
    const name = document.getElementById("studentName").value;
    const roll = document.getElementById("studentRoll").value;
    const addr = document.getElementById("studentAddress").value;
    const accounts = await web3.eth.getAccounts();
    await contract.methods.addStudent(name, roll, addr).send({ from: accounts[0] });
    alert("Student added successfully!");
}

async function markAttendance() {
    const addr = document.getElementById("attendAddress").value;
    const date = document.getElementById("attendDate").value;
    const status = document.getElementById("attendStatus").value === "true";
    const accounts = await web3.eth.getAccounts();
    await contract.methods.markAttendance(addr, date, status).send({ from: accounts[0] });
    alert("Attendance marked!");
}

// ================== STUDENT FUNCTIONS ==================
async function viewMyProfile() {
    const accounts = await web3.eth.getAccounts();
    const profile = await contract.methods.getMyProfile().call({ from: accounts[0] });
    document.getElementById("profile").innerText = `Name: ${profile[0]}, Roll: ${profile[1]}`;
}

async function viewMyAttendance() {
    const date = document.getElementById("myDate").value;
    const accounts = await web3.eth.getAccounts();
    const attendance = await contract.methods.getMyAttendance(date).call({ from: accounts[0] });
    document.getElementById("myAttendance").innerText =
        attendance[2] ? (attendance[0] ? "Present" : "Absent") + " on " + date : "No record found";
}
