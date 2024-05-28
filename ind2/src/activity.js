async function updateActivity() {
    setTimeout(() => {
        displayActivity()
            .then(() => updateActivity());
    },60000);
}


async function displayActivity() {
    let data = await getActivity()
        .then(activity => {
            document.getElementById('newLabel').className = 'new';
            return activity;
        });
    console.log(data);
    document.getElementById('activity').textContent = data.activity;
    document.getElementById('availability').textContent = data.availability;
    document.getElementById('type').textContent = data.type;
    document.getElementById('participants').textContent = data.participants;
    document.getElementById('price').textContent = data.price;
    document.getElementById('accessibility').textContent = data.accessibility;
    document.getElementById('duration').textContent = data.duration;
    document.getElementById('kidFriendly').textContent = data.kidFriendly ? "Yes" : "No";
   let fadeOut = async () => setTimeout(() => document.getElementById('newLabel').className = 'old', 1000);
    fadeOut();
}

function getActivity() {
    console.log(`Updating Activity [${new Date().toLocaleString()}]`);
    return fetch('http://localhost:3000/activity')
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching activity:', error);
        });
}