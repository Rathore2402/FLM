document.getElementById('leaveForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const leaveData = {
        name: document.getElementById('name').value,
        department: document.getElementById('department').value,
        leaveType: document.getElementById('leaveType').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        reason: document.getElementById('reason').value,
        status: 'Pending'
    };

    try {
        const response = await fetch('http://localhost:3001/api/leaves', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leaveData)
        });

        if (response.ok) {
            alert('Leave application submitted successfully!');
            document.getElementById('leaveForm').reset();
            fetchLeaves();
        } else {
            throw new Error('Failed to submit leave application');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting leave application');
    }
});

async function fetchLeaves() {
    try {
        const response = await fetch('http://localhost:3001/api/leaves');
        const leaves = await response.json();
        displayLeaves(leaves);
    } catch (error) {
        console.error('Error fetching leaves:', error);
    }
}

function displayLeaves(leaves) {
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = '';

    if (leaves.length === 0) {
        statusList.innerHTML = '<p>No leave applications found</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Leave Type</th>
            <th>Dates</th>
            <th>Status</th>
        </tr>
    `;

    leaves.forEach(leave => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${leave.name}</td>
            <td>${leave.department}</td>
            <td>${leave.leaveType}</td>
            <td>${new Date(leave.startDate).toLocaleDateString()} - ${new Date(leave.endDate).toLocaleDateString()}</td>
            <td>${leave.status}</td>
        `;
        table.appendChild(row);
    });

    statusList.appendChild(table);
}

// Initial load of leave applications
fetchLeaves();
