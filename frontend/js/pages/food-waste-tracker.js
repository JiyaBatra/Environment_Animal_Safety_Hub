// Food Waste Tracker JavaScript

let wasteEntries = JSON.parse(localStorage.getItem("foodWasteData")) || [];
let wasteChart = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    updateDisplay();
    initializeAOS();
});

// Initialize form submission
function initializeForm() {
    const form = document.getElementById('wasteForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            addWasteEntry();
        });
    }

    // Set today's date as default
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
}

// Add waste entry
function addWasteEntry() {
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const reason = document.getElementById('reason').value;
    const notes = document.getElementById('notes').value;

    if (!category || !amount || !date) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const entry = {
        id: Date.now(),
        category,
        amount,
        date,
        reason,
        notes,
        timestamp: new Date().toISOString()
    };

    wasteEntries.push(entry);
    saveToLocalStorage();
    updateDisplay();
    resetForm();
    showNotification('Entry added successfully!', 'success');
}

// Reset form
function resetForm() {
    document.getElementById('wasteForm').reset();
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('foodWasteData', JSON.stringify(wasteEntries));
}

// Update all displays
function updateDisplay() {
    updateStats();
    updateTable();
    updateChart();
    updateInsights();
}

// Update statistics
function updateStats() {
    let totalWaste = 0;
    let categoryTotals = {};

    wasteEntries.forEach(entry => {
        totalWaste += entry.amount;
        categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount;
    });

    // Update stat cards
    document.getElementById('totalWaste').textContent = totalWaste.toFixed(2) + ' kg';
    document.getElementById('moneyLost').textContent = '₹' + (totalWaste * 200).toFixed(0);
    document.getElementById('co2').textContent = (totalWaste * 2.5).toFixed(1) + ' kg';
    document.getElementById('entryCount').textContent = wasteEntries.length;
}

// Update table
function updateTable() {
    const tableBody = document.getElementById('tableBody');
    
    if (wasteEntries.length === 0) {
        tableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="fa-solid fa-inbox" style="font-size: 2rem; opacity: 0.5;"></i>
                    <p style="margin-top: 10px; opacity: 0.7;">No entries yet. Start tracking your food waste!</p>
                </td>
            </tr>
        `;
        return;
    }

    // Sort by date (newest first)
    const sortedEntries = [...wasteEntries].sort((a, b) => new Date(b.date) - new Date(a.date));

    tableBody.innerHTML = sortedEntries.map(entry => `
        <tr>
            <td>${formatDate(entry.date)}</td>
            <td>${entry.category}</td>
            <td>${entry.amount} kg</td>
            <td>${entry.reason || '—'}</td>
            <td>${entry.notes ? entry.notes.substring(0, 30) + '...' : '—'}</td>
            <td>
                <button class="btn btn-sm btn-outline" onclick="deleteEntry(${entry.id})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Delete entry
function deleteEntry(entryId) {
    if (confirm('Are you sure you want to delete this entry?')) {
        wasteEntries = wasteEntries.filter(entry => entry.id !== entryId);
        saveToLocalStorage();
        updateDisplay();
        showNotification('Entry deleted successfully!', 'success');
    }
}

// Clear all entries
function clearAllEntries() {
    if (confirm('Are you sure you want to delete ALL entries? This action cannot be undone.')) {
        wasteEntries = [];
        saveToLocalStorage();
        updateDisplay();
        showNotification('All entries deleted!', 'success');
    }
}

// Update chart
function updateChart() {
    let categoryTotals = {};

    wasteEntries.forEach(entry => {
        categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount;
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = generateColors(labels.length);

    const ctx = document.getElementById('wasteChart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (wasteChart) {
        wasteChart.destroy();
    }

    // Create new chart
    wasteChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.length > 0 ? labels : ['No data'],
            datasets: [{
                data: data.length > 0 ? data : [1],
                backgroundColor: data.length > 0 ? colors : ['#e0e0e0'],
                borderColor: 'var(--card-bg)',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif"
                        },
                        color: 'var(--text-color)',
                        padding: 15
                    }
                }
            }
        }
    });
}

// Update insights
function updateInsights() {
    if (wasteEntries.length === 0) {
        document.getElementById('avgDaily').textContent = '0 kg';
        document.getElementById('maxCategory').textContent = 'None';
        document.getElementById('topReason').textContent = 'None';
        return;
    }

    // Calculate average daily waste
    const uniqueDates = new Set(wasteEntries.map(e => e.date));
    const avgDaily = (wasteEntries.reduce((sum, e) => sum + e.amount, 0) / uniqueDates.size).toFixed(2);
    document.getElementById('avgDaily').textContent = avgDaily + ' kg';

    // Find most wasted category
    let categoryTotals = {};
    wasteEntries.forEach(entry => {
        categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount;
    });
    const maxCategory = Object.keys(categoryTotals).reduce((a, b) => 
        categoryTotals[a] > categoryTotals[b] ? a : b
    );
    document.getElementById('maxCategory').textContent = maxCategory;

    // Find most common reason
    let reasonCounts = {};
    wasteEntries.forEach(entry => {
        if (entry.reason) {
            reasonCounts[entry.reason] = (reasonCounts[entry.reason] || 0) + 1;
        }
    });
    const topReason = Object.keys(reasonCounts).length > 0 ?
        Object.keys(reasonCounts).reduce((a, b) => 
            reasonCounts[a] > reasonCounts[b] ? a : b
        ) : 'None';
    document.getElementById('topReason').textContent = topReason;
}

// Generate colors for chart
function generateColors(count) {
    const colors = [];
    const baseColors = [
        '#27ae60', '#2ecc71', '#3498db', '#e74c3c', '#f39c12',
        '#9b59b6', '#1abc9c', '#e67e22', '#95a5a6', '#34495e'
    ];

    for (let i = 0; i < count; i++) {
        colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
}

// Export as CSV
function exportCSV() {
    if (wasteEntries.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }

    let csv = 'Date,Category,Amount (kg),Reason,Notes\n';
    
    wasteEntries.forEach(entry => {
        const notes = (entry.notes || '').replace(/"/g, '""');
        csv += `"${entry.date}","${entry.category}","${entry.amount}","${entry.reason || ''}","${notes}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-waste-tracker-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Data exported successfully!', 'success');
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize AOS
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .btn-sm {
        padding: 8px 12px;
        font-size: 0.85rem;
    }
`;
document.head.appendChild(style);
