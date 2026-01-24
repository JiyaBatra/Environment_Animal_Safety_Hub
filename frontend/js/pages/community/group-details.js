// Group Details Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = parseInt(urlParams.get('id'));

    if (!groupId) {
        window.location.href = 'groups.html';
        return;
    }

    loadGroupDetails(groupId);
    initializeTabs();
});

function loadGroupDetails(groupId) {
    // Combine featured groups and custom groups from localStorage
    const featuredGroups = [
        {
            id: 1,
            name: "Urban Wildlife Protectors",
            category: "wildlife",
            members: 1250,
            description: "Dedicated to protecting urban wildlife habitats and educating communities about coexistence. This group focuses on providing safe havens for squirrels, birds, and other urban dwellers.",
            image: "🦊",
            location: "New York, USA",
            isJoined: false
        },
        {
            id: 2,
            name: "Zero Waste Living",
            category: "sustainable",
            members: 2100,
            description: "A community committed to eliminating waste through sustainable living practices and education. We share tips on composting, reducing plastic use, and DIY eco-friendly products.",
            image: "♻️",
            location: "London, UK",
            isJoined: true
        },
        {
            id: 3,
            name: "Climate Action Network",
            category: "education",
            members: 3500,
            description: "Educating and mobilizing communities for effective climate action and policy change. Our network connects local activists with global initiatives to fight climate change.",
            image: "🌍",
            location: "Global",
            isJoined: false
        },
        {
            id: 4,
            name: "Animal Rescue Alliance",
            category: "animal-welfare",
            members: 1800,
            description: "Coordinating rescue efforts and providing support for abandoned and injured animals. We work closely with local shelters and veterinarians to give every animal a second chance.",
            image: "🐾",
            location: "Mumbai, India",
            isJoined: true
        }
    ];

    const customGroups = JSON.parse(localStorage.getItem('community_groups') || '[]');
    const allGroups = [...customGroups, ...featuredGroups];

    const group = allGroups.find(g => g.id === groupId);

    if (!group) {
        alert('Group not found!');
        window.location.href = 'groups.html';
        return;
    }

    // Populate header
    document.getElementById('group-name').textContent = group.name;
    document.getElementById('group-emoji').textContent = group.image || '🌱';
    document.getElementById('group-category').textContent = getCategoryName(group.category);
    document.getElementById('member-count').textContent = group.members.toLocaleString();
    document.getElementById('group-location').textContent = group.location || 'Global';
    document.title = `${group.name} - EcoLife`;

    // Populate About
    document.getElementById('group-description-full').textContent = group.description;

    // Join Button state
    const joinBtn = document.getElementById('join-group-btn');
    updateJoinButton(joinBtn, group.isJoined);

    joinBtn.addEventListener('click', () => {
        group.isJoined = !group.isJoined;
        if (group.isJoined) {
            group.members++;
            showNotification(`Successfully joined ${group.name}!`, 'success');
        } else {
            group.members--;
            showNotification(`Left ${group.name}.`, 'info');
        }
        document.getElementById('member-count').textContent = group.members.toLocaleString();
        updateJoinButton(joinBtn, group.isJoined);
        
        // Update storage if it's a custom group
        if (groupId > 1000) { // Simple check for custom id
            const updatedCustom = customGroups.map(g => g.id === groupId ? group : g);
            localStorage.setItem('community_groups', JSON.stringify(updatedCustom));
        }
    });

    // Populate Members Mock
    loadMockMembers();
    // Populate Events Mock
    loadMockEvents(group.name);
}

function updateJoinButton(btn, isJoined) {
    if (isJoined) {
        btn.innerHTML = '<i class="fa-solid fa-sign-out-alt"></i> Leave Group';
        btn.className = 'btn-secondary';
    } else {
        btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> Join Group';
        btn.className = 'btn-primary';
    }
}

function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${target}-tab`).classList.add('active');
        });
    });
}

function loadMockMembers() {
    const membersGrid = document.getElementById('group-members-grid');
    const mockMembers = [
        { name: "Sarah Green", initial: "SG" },
        { name: "John Doe", initial: "JD" },
        { name: "Eco Warrior", initial: "EW" },
        { name: "Animal Lover", initial: "AL" },
        { name: "Mia Wong", initial: "MW" },
        { name: "David Smith", initial: "DS" }
    ];

    membersGrid.innerHTML = mockMembers.map(member => `
        <div class="member-card">
            <div class="member-avatar">${member.initial}</div>
            <span class="member-name">${member.name}</span>
        </div>
    `).join('');
}

function loadMockEvents(groupName) {
    const eventsList = document.getElementById('group-events-list');
    const mockEvents = [
        {
            title: `${groupName} Monthly Meetup`,
            date: "Feb 15, 2026",
            time: "10:00 AM",
            location: "Virtual / Zoom"
        },
        {
            title: "Local Cleanup Drive",
            date: "Mar 2, 2026",
            time: "08:00 AM",
            location: "City Central Park"
        }
    ];

    eventsList.innerHTML = mockEvents.map(event => `
        <div class="card event-card">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4 style="margin: 0; color: var(--primary-color);">${event.title}</h4>
                    <p style="margin: 5px 0; font-size: 0.9rem;"><i class="fa-solid fa-calendar"></i> ${event.date} at ${event.time}</p>
                    <p style="margin: 0; font-size: 0.9rem;"><i class="fa-solid fa-location-dot"></i> ${event.location}</p>
                </div>
                <button class="btn-primary" style="padding: 5px 15px; font-size: 0.8rem;">I'm Interested</button>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const categories = {
        'wildlife': 'Wildlife Conservation',
        'sustainable': 'Sustainable Living',
        'education': 'Environmental Education',
        'animal-welfare': 'Animal Welfare',
        'climate': 'Climate Action',
        'ocean': 'Ocean Cleanups'
    };
    return categories[category] || category;
}

function showNotification(message, type = 'info') {
    // Re-using the logic from groups.js or common utils if available
    alert(message);
}
