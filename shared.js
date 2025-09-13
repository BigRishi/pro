let web3;
let contract;
const contractAddress = "0xf9C62B1bcD793a4E483f472b9A925b77202F5968"; // Your Sepolia contract address

// Full ABI copied from your Solidity contract
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

async function loadStudentsForAttendance() {
    const dateInput = document.getElementById("attendDate").value;
    if (!dateInput) {
        alert("Please select a date first.");
        return;
    }
    const studentsListContainer = document.getElementById("studentsList");
    studentsListContainer.innerHTML = 'Loading...';
    try {
        const studentAddresses = await contract.methods.getAllStudents().call();
        studentsListContainer.innerHTML = '';
        document.getElementById("submitAttendanceButton").style.display = 'block';

        if (studentAddresses.length === 0) {
            studentsListContainer.innerHTML = 'No students registered yet.';
            document.getElementById("submitAttendanceButton").style.display = 'none';
            return;
        }

        for (const addr of studentAddresses) {
            const student = await contract.methods.getStudent(addr).call();
            const attendance = await contract.methods.getAttendance(addr, dateInput).call();

            const studentCard = document.createElement('div');
            studentCard.className = 'student-card';
            studentCard.dataset.address = addr;

            const studentInfo = document.createElement('div');
            studentInfo.className = 'student-info';
            studentInfo.innerHTML = `<strong>${student.name}</strong> (Roll: ${student.rollNumber})`;

            const attendanceOptions = document.createElement('div');
            attendanceOptions.className = 'attendance-options';

            const presentOption = createRadioButton('Present', true, attendance.isPresent && attendance.exists);
            const absentOption = createRadioButton('Absent', false, !attendance.isPresent && attendance.exists);
            
            attendanceOptions.appendChild(presentOption);
            attendanceOptions.appendChild(absentOption);
            
            studentCard.appendChild(studentInfo);
            studentCard.appendChild(attendanceOptions);
            studentsListContainer.appendChild(studentCard);
        }
    } catch (error) {
        console.error("Error loading students:", error);
        alert("Failed to load students. See console for details.");
        studentsListContainer.innerHTML = 'Failed to load students.';
        document.getElementById("submitAttendanceButton").style.display = 'none';
    }
}

function createRadioButton(label, value, isChecked) {
    const container = document.createElement('label');
    container.innerHTML = `<input type="radio" name="attendance-${value}" value="${value}" ${isChecked ? 'checked' : ''}> ${label}`;
    return container;
}

async function submitAttendance() {
    const date = document.getElementById("attendDate").value;
    if (!date) {
        alert("Please select a date first.");
        return;
    }
    const accounts = await web3.eth.getAccounts();
    const studentsListContainer = document.getElementById("studentsList");
    const studentCards = studentsListContainer.getElementsByClassName("student-card");

    if (studentCards.length === 0) {
        alert("No students to submit attendance for.");
        return;
    }

    const txs = [];
    for (const card of studentCards) {
        const addr = card.dataset.address;
        const status = card.querySelector('input[type="radio"]:checked');
        
        if (!status) {
            alert(`Please mark attendance for all students before submitting.`);
            return;
        }

        const isPresent = status.value === "true";
        txs.push(contract.methods.markAttendance(addr, date, isPresent).send({ from: accounts[0] }));
    }

    try {
        await Promise.all(txs);
        alert("Attendance submitted successfully!");
    } catch (error) {
        console.error("Error marking attendance:", error);
        alert("Failed to submit all attendance records. See console for details.");
    }
}

// ================== STUDENT FUNCTIONS ==================
async function viewMyProfile() {
    try {
        const accounts = await web3.eth.getAccounts();
        const profile = await contract.methods.getMyProfile().call({ from: accounts[0] });
        document.getElementById("profile").innerText = `Name: ${profile[0]}, Roll: ${profile[1]}`;
    } catch (error) {
        console.error("Error fetching profile:", error);
        document.getElementById("profile").innerText = "Profile not found or not connected.";
    }
}

async function viewMyAttendance() {
    // This function remains unchanged, though it is not used in the teacher's dashboard
    const date = document.getElementById("myDate").value;
    const accounts = await web3.eth.getAccounts();
    const attendance = await contract.methods.getMyAttendance(date).call({ from: accounts[0] });
    document.getElementById("myAttendance").innerText =
        attendance[2] ? (attendance[0] ? "Present" : "Absent") + " on " + date : "No record found";
}
// ================== DOWNLOAD ATTENDANCE ==================
async function downloadMonthlyAttendance() {
    try {
        const accounts = await web3.eth.getAccounts();
        if (!accounts[0]) {
            alert("Please connect your wallet first.");
            return;
        }

        const studentAddresses = await contract.methods.getAllStudents().call();
        if (studentAddresses.length === 0) {
            alert("No students registered to download attendance for.");
            return;
        }

        const today = new Date();
        const dates = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            dates.push(d.toISOString().slice(0, 10)); // Format YYYY-MM-DD
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        let header = "Student Name,Roll Number";
        header += "," + dates.join(",");
        csvContent += header + "\r\n";

        for (const addr of studentAddresses) {
            const student = await contract.methods.getStudent(addr).call();
            let row = `"${student.name}","${student.rollNumber}"`;
            
            for (const date of dates) {
                const attendance = await contract.methods.getAttendance(addr, date).call();
                let status = "N/A";
                if (attendance.exists) {
                    status = attendance.isPresent ? "P" : "A"; // P for Present, A for Absent
                }
                row += `,${status}`;
            }
            csvContent += row + "\r\n";
        }

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `attendance_monthly_${today.toISOString().slice(0, 7)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert("Attendance data downloaded successfully!");

    } catch (error) {
        console.error("Error downloading attendance:", error);
        alert("Failed to download attendance data. See console for details.");
    }
}