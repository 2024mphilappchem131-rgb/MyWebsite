// ============================================
// GHARWALAAI - Complete JavaScript
// ============================================

// ---------- GLOBAL STATE ----------
let chatMessages = [];

// ---------- UTILITY FUNCTIONS ----------
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = {
    success: 'fa-check-circle',
    warning: 'fa-exclamation-triangle',
    error: 'fa-times-circle',
    info: 'fa-info-circle'
  };
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 50);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  overlay?.classList.toggle('show');
}

function updateDate() {
  const now = new Date();
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  document.querySelectorAll('.date-display').forEach(el => {
    el.textContent = now.toLocaleDateString('en-PK', options);
  });
}

function updateDashboardStats() {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const groceries = JSON.parse(localStorage.getItem('grocery') || '[]');
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');

  const dueBills = bills.filter(b => new Date(b.dueDate) < new Date() && b.status !== 'paid');
  const lowItems = groceries.filter(g => g.status === 'low' || g.status === 'finished');

  const dueEl = document.getElementById('dueBillsCount');
  if (dueEl) dueEl.textContent = dueBills.length;
  const lowEl = document.getElementById('lowGroceryCount');
  if (lowEl) lowEl.textContent = lowItems.length;
  const guestEl = document.getElementById('guestCount');
  if (guestEl) guestEl.textContent = guests.length;
  const recipeEl = document.getElementById('recipeCount');
  if (recipeEl) recipeEl.textContent = recipes.length;

  updateNotificationBadge();
}

function updateNotificationBadge() {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const dueBills = bills.filter(b => new Date(b.dueDate) < new Date() && b.status !== 'paid');
  const badge = document.getElementById('notifCount');
  if (badge) {
    badge.textContent = dueBills.length;
    badge.style.display = dueBills.length > 0 ? 'block' : 'none';
  }
}

function showNotifications() {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const dueBills = bills.filter(b => new Date(b.dueDate) < new Date() && b.status !== 'paid');
  if (dueBills.length === 0) {
    showToast('🎉 No pending bills!', 'success');
  } else {
    const names = dueBills.map(b => b.name).join(', ');
    showToast(`⚠️ ${dueBills.length} bill(s) due: ${names}`, 'warning');
  }
}

// ---------- AI CHAT ----------
function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input?.value.trim();
  if (!msg) return;

  addChatMessage(msg, 'user');
  input.value = '';

  setTimeout(() => {
    const response = getAIResponse(msg);
    addChatMessage(response, 'ai');
  }, 500 + Math.random() * 800);
}

function addChatMessage(text, sender) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const div = document.createElement('div');
  div.className = `message ${sender}`;
  const icon = sender === 'user' ? 'fa-user' : 'fa-robot';
  div.innerHTML = `<i class="fas ${icon}"></i><div class="bubble">${text}</div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  chatMessages.push({ sender, text });
}

function clearChat() {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  container.innerHTML = `
    <div class="message ai">
      <i class="fas fa-robot"></i>
      <div class="bubble">Assalam-u-Alaikum! 🌙<br>Main aapka GharWalaAI hoon. Kya help chahiye?</div>
    </div>
  `;
  chatMessages = [];
}

function getAIResponse(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('bill') || lower.includes('payment')) {
    return '📊 Aapki bills ki total amount PKR 12,500 hai. 2 bills due hain: Electricity (PKR 5,000) aur Gas (PKR 3,500). Kya main remind karun?';
  } else if (lower.includes('sabzi') || lower.includes('grocery') || lower.includes('fridge')) {
    return '🍅 Fridge mein: Tomatoes, Onions, Eggs, aur Milk hai. Low stock: Chicken aur Bread. Kya aap recipe suggest karna chahenge?';
  } else if (lower.includes('guest') || lower.includes('mehman')) {
    return '👥 Agle haftay 2 mehman aa rahe hain: Ali (2 days) aur Sara (3 days). Kya aap guest prep tips chahte hain?';
  } else if (lower.includes('recipe') || lower.includes('cook')) {
    return '🍳 Aapke ingredients se: Tomato Egg Curry, Aloo Anda, aur Chicken Karahi bana sakte hain. Kya recipe chahiye?';
  } else if (lower.includes('budget') || lower.includes('paise')) {
    return '💰 Is mahine ka budget: PKR 35,000. Bills: PKR 15,000, Grocery: PKR 12,000, Extra: PKR 8,000. Bachat: PKR 5,000 inshaAllah!';
  } else {
    return '🤖 GharWalaAI yahan hai! Main bills, grocery, guests, recipes, aur budget mein help kar sakta hoon. Kya poochna hai?';
  }
}

// ---------- AI QUICK ACTIONS ----------
function aiSuggestBudget() {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const total = bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
  showToast(`💰 Suggested monthly budget: PKR ${(total + 5000).toLocaleString()}`, 'info');
  addChatMessage(`💰 Suggested budget: PKR ${(total + 5000).toLocaleString()} (bills: PKR ${total.toLocaleString()} + savings)`, 'ai');
}

function aiSuggestRecipe() {
  const groceries = JSON.parse(localStorage.getItem('grocery') || '[]');
  const items = groceries.map(g => g.name).filter(Boolean);
  if (items.length === 0) {
    showToast('🍳 Fridge khali hai! Pehle grocery add karein.', 'warning');
    return;
  }

  const recipes = {
    tomato: 'Tomato Egg Curry: Tomatoes, Eggs, Onion, Garlic, Spices',
    chicken: 'Chicken Karahi: Chicken, Tomatoes, Ginger, Garlic, Green Chillies',
    egg: 'Aloo Anda: Potatoes, Eggs, Onion, Turmeric, Chilli Powder',
    potato: 'Aloo Gosht: Potatoes, Meat (or Chicken), Onion, Spices',
    onion: 'Pyaz Ka Salan: Onions, Tamarind, Spices'
  };

  const available = items.map(i => i.toLowerCase());
  let suggestion = '🍳 Aap in ingredients se ye bana sakte hain:\n';
  let found = false;
  for (const [key, value] of Object.entries(recipes)) {
    if (available.some(a => a.includes(key))) {
      suggestion += `- ${value}\n`;
      found = true;
    }
  }
  if (!found) {
    suggestion = '🍳 Kuch Pakistani recipes: Chicken Karahi, Daal Chawal, Aloo Gosht, ya Anda Paratha try karein!';
  }
  addChatMessage(suggestion, 'ai');
  showToast('🍳 AI recipe suggestions dekhaye gaye!', 'success');
}

function aiCheckBills() {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const due = bills.filter(b => new Date(b.dueDate) < new Date() && b.status !== 'paid');
  if (due.length === 0) {
    showToast('🎉 Koi bill due nahi hai! Mubarak ho!', 'success');
  } else {
    const list = due.map(b => `${b.name} (PKR ${b.amount})`).join(', ');
    showToast(`⚠️ ${due.length} bill(s) due: ${list}`, 'warning');
  }
}

function aiGuestPrep() {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  if (guests.length === 0) {
    showToast('👥 Koi guest nahi aaye. Guest add karein!', 'info');
    return;
  }
  const tips = [
    '🛏️ Guest room tayar karein: extra pillows, fresh bedsheets',
    '🍽️ Menu plan karein: guests ke liye khaas dish tayar karein',
    '🧹 Ghar saaf karayein: floor, bathroom, kitchen',
    '🎁 Guest welcome gift: fresh flowers or chocolates',
    '📱 Guest ko WiFi password zaroor den'
  ];
  const randomTip = tips[Math.floor(Math.random() * tips.length)];
  showToast(`👥 Guest Tip: ${randomTip}`, 'info');
  addChatMessage(`👥 ${randomTip}`, 'ai');
}

// ---------- HELPER ----------
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ---------- BILLS MANAGEMENT ----------
function loadBills() {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const tbody = document.getElementById('billsTableBody');
  if (!tbody) return;

  if (bills.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:#94a3b8;">No bills added yet.</td></tr>';
    const total = document.getElementById('totalBills');
    if (total) total.textContent = 'Total: 0';
    return;
  }

  let html = '';
  bills.forEach((bill, index) => {
    const isDue = new Date(bill.dueDate) < new Date() && bill.status !== 'paid';
    const statusClass = isDue ? 'due' : 'paid';
    const statusText = isDue ? 'Due' : 'Paid';
    html += `
      <tr>
        <td><strong>${escapeHtml(bill.name)}</strong></td>
        <td>PKR ${parseFloat(bill.amount).toLocaleString()}</td>
        <td>${new Date(bill.dueDate).toLocaleDateString()}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-edit" onclick="editBill(${index})"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn-delete" onclick="deleteBill(${index})"><i class="fas fa-trash"></i> Delete</button>
            ${isDue ? `<button class="btn-edit" onclick="markBillPaid(${index})" style="background:#d1fae5;color:#059669;"><i class="fas fa-check"></i> Paid</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  const total = document.getElementById('totalBills');
  if (total) total.textContent = `Total: ${bills.length}`;
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('billForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('billName').value.trim();
      const amount = document.getElementById('billAmount').value;
      const dueDate = document.getElementById('billDueDate').value;

      if (!name || !amount || !dueDate) {
        showToast('Please fill all fields', 'error');
        return;
      }

      const bills = JSON.parse(localStorage.getItem('bills') || '[]');
      bills.push({ name, amount: parseFloat(amount), dueDate, status: 'pending' });
      localStorage.setItem('bills', JSON.stringify(bills));
      form.reset();
      loadBills();
      updateDashboardStats();
      updateNotificationBadge();
      showToast(`✅ Bill "${name}" added successfully!`, 'success');
    });
  }
});

function deleteBill(index) {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  if (confirm(`Delete "${bills[index].name}"?`)) {
    bills.splice(index, 1);
    localStorage.setItem('bills', JSON.stringify(bills));
    loadBills();
    updateDashboardStats();
    updateNotificationBadge();
    showToast('🗑️ Bill deleted.', 'warning');
  }
}

function editBill(index) {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const bill = bills[index];
  const nameInput = document.getElementById('billName');
  const amountInput = document.getElementById('billAmount');
  const dateInput = document.getElementById('billDueDate');
  if (nameInput) nameInput.value = bill.name;
  if (amountInput) amountInput.value = bill.amount;
  if (dateInput) dateInput.value = bill.dueDate;

  bills.splice(index, 1);
  localStorage.setItem('bills', JSON.stringify(bills));
  loadBills();
  showToast(`✏️ Edit "${bill.name}" and click Add again.`, 'info');
}

function markBillPaid(index) {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  bills[index].status = 'paid';
  localStorage.setItem('bills', JSON.stringify(bills));
  loadBills();
  updateDashboardStats();
  updateNotificationBadge();
  showToast('✅ Bill marked as paid!', 'success');
}

function checkBillReminders() {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const due = bills.filter(b => new Date(b.dueDate) < new Date() && b.status !== 'paid');
  if (due.length === 0) {
    showToast('🎉 Koi bill due nahi hai!', 'success');
  } else {
    const list = due.map(b => `${b.name} (PKR ${b.amount})`).join('\n');
    showToast(`⚠️ Due bills:\n${list}`, 'warning');
  }
}

function analyzeBudget() {
  const bills = JSON.parse(localStorage.getItem('bills') || '[]');
  const total = bills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
  const avg = bills.length > 0 ? total / bills.length : 0;
  const suggestion = `📊 Total bills: PKR ${total.toLocaleString()}\nAverage per bill: PKR ${avg.toFixed(0)}\nSuggested monthly budget: PKR ${(total + 5000).toLocaleString()}`;
  const el = document.getElementById('budgetSuggestion');
  if (el) el.textContent = suggestion;
  showToast('💰 Budget analysis complete!', 'success');
}

// ---------- GROCERY MANAGEMENT ----------
function loadGrocery() {
  const groceries = JSON.parse(localStorage.getItem('grocery') || '[]');
  const tbody = document.getElementById('groceryTableBody');
  if (!tbody) return;

  if (groceries.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:30px;color:#94a3b8;">No grocery items added yet.</td></tr>';
    const total = document.getElementById('totalItems');
    if (total) total.textContent = 'Total: 0';
    return;
  }

  let html = '';
  groceries.forEach((item, index) => {
    const statusClass = item.status === 'available' ? 'available' : item.status === 'low' ? 'low' : 'finished';
    html += `
      <tr>
        <td><strong>${escapeHtml(item.name)}</strong></td>
        <td>${escapeHtml(item.qty)}</td>
        <td><span class="status-badge ${statusClass}">${item.status}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-edit" onclick="editGrocery(${index})"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn-delete" onclick="deleteGrocery(${index})"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  const total = document.getElementById('totalItems');
  if (total) total.textContent = `Total: ${groceries.length}`;
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('groceryForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('groceryName').value.trim();
      const qty = document.getElementById('groceryQty').value.trim();
      const status = document.getElementById('groceryStatus').value;

      if (!name || !qty) {
        showToast('Please fill all fields', 'error');
        return;
      }

      const groceries = JSON.parse(localStorage.getItem('grocery') || '[]');
      groceries.push({ name, qty, status });
      localStorage.setItem('grocery', JSON.stringify(groceries));
      form.reset();
      loadGrocery();
      updateDashboardStats();
      showToast(`🛒 "${name}" added to fridge!`, 'success');
    });
  }
});

function deleteGrocery(index) {
  const groceries = JSON.parse(localStorage.getItem('grocery') || '[]');
  if (confirm(`Remove "${groceries[index].name}" from fridge?`)) {
    groceries.splice(index, 1);
    localStorage.setItem('grocery', JSON.stringify(groceries));
    loadGrocery();
    updateDashboardStats();
    showToast('🗑️ Item removed.', 'warning');
  }
}

function editGrocery(index) {
  const groceries = JSON.parse(localStorage.getItem('grocery') || '[]');
  const item = groceries[index];
  const nameInput = document.getElementById('groceryName');
  const qtyInput = document.getElementById('groceryQty');
  const statusInput = document.getElementById('groceryStatus');
  if (nameInput) nameInput.value = item.name;
  if (qtyInput) qtyInput.value = item.qty;
  if (statusInput) statusInput.value = item.status;

  groceries.splice(index, 1);
  localStorage.setItem('grocery', JSON.stringify(groceries));
  loadGrocery();
  showToast(`✏️ Edit "${item.name}" and click Add again.`, 'info');
}

function checkLowStock() {
  const groceries = JSON.parse(localStorage.getItem('grocery') || '[]');
  const low = groceries.filter(g => g.status === 'low' || g.status === 'finished');
  if (low.length === 0) {
    showToast('🛒 Fridge full! Sabzi khatam nahi hui.', 'success');
  } else {
    const list = low.map(g => `${g.name} (${g.status})`).join(', ');
    showToast(`⚠️ Low/Finished items: ${list}`, 'warning');
  }
}

function scanFridge() {
  const groceries = JSON.parse(localStorage.getItem('grocery') || '[]');
  const available = groceries.filter(g => g.status === 'available');
  const low = groceries.filter(g => g.status === 'low');
  const finished = groceries.filter(g => g.status === 'finished');

  let status = `🧊 Fridge Scan Report:\n`;
  status += `✅ Available: ${available.length} items\n`;
  status += `⚠️ Low Stock: ${low.length} items\n`;
  status += `❌ Finished: ${finished.length} items\n`;
  status += `\n💡 Tip: ${low.length > 0 ? `Buy: ${low.map(g => g.name).join(', ')}` : 'Fridge is well-stocked! 🌟'}`;

  const el = document.getElementById('fridgeStatus');
  if (el) el.textContent = status;
  showToast('🧊 Fridge scan complete!', 'info');
}

// ---------- GUEST MANAGEMENT ----------
function loadGuests() {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const tbody = document.getElementById('guestsTableBody');
  if (!tbody) return;

  if (guests.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:30px;color:#94a3b8;">No guests added yet.</td></tr>';
    const total = document.getElementById('totalGuests');
    if (total) total.textContent = 'Total: 0';
    return;
  }

  let html = '';
  guests.forEach((guest, index) => {
    const arrival = new Date(guest.arrival);
    const today = new Date();
    const status = arrival > today ? 'coming' : 'staying';
    const statusClass = status === 'coming' ? 'coming' : 'staying';
    const statusText = status === 'coming' ? 'Coming' : 'Staying';
    html += `
      <tr>
        <td><strong>${escapeHtml(guest.name)}</strong></td>
        <td>${arrival.toLocaleDateString()}</td>
        <td>${guest.days}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-edit" onclick="editGuest(${index})"><i class="fas fa-pen"></i> Edit</button>
            <button class="btn-delete" onclick="deleteGuest(${index})"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  const total = document.getElementById('totalGuests');
  if (total) total.textContent = `Total: ${guests.length}`;
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('guestForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('guestName').value.trim();
      const arrival = document.getElementById('guestArrival').value;
      const days = document.getElementById('guestDays').value;

      if (!name || !arrival || !days) {
        showToast('Please fill all fields', 'error');
        return;
      }

      const guests = JSON.parse(localStorage.getItem('guests') || '[]');
      guests.push({ name, arrival, days: parseInt(days) });
      localStorage.setItem('guests', JSON.stringify(guests));
      form.reset();
      loadGuests();
      updateDashboardStats();
      showToast(`👋 Guest "${name}" added!`, 'success');
    });
  }
});

function deleteGuest(index) {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  if (confirm(`Remove "${guests[index].name}" from guest list?`)) {
    guests.splice(index, 1);
    localStorage.setItem('guests', JSON.stringify(guests));
    loadGuests();
    updateDashboardStats();
    showToast('🗑️ Guest removed.', 'warning');
  }
}

function editGuest(index) {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const guest = guests[index];
  const nameInput = document.getElementById('guestName');
  const arrivalInput = document.getElementById('guestArrival');
  const daysInput = document.getElementById('guestDays');
  if (nameInput) nameInput.value = guest.name;
  if (arrivalInput) arrivalInput.value = guest.arrival;
  if (daysInput) daysInput.value = guest.days;

  guests.splice(index, 1);
  localStorage.setItem('guests', JSON.stringify(guests));
  loadGuests();
  showToast(`✏️ Edit "${guest.name}" and click Add again.`, 'info');
}

function getGuestPrepTips() {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  if (guests.length === 0) {
    const tipEl = document.getElementById('guestPrepTip');
    if (tipEl) tipEl.textContent = '👤 No guests added yet. Add guests first!';
    return;
  }

  const tips = [
    '🛏️ Guest room ready: fresh bedsheets, pillows, towels',
    '🍽️ Plan a special meal: guests love homemade Pakistani food!',
    '🧹 Deep clean: floor, bathroom, and kitchen',
    '🎁 Welcome gesture: flowers, dates, or chocolates',
    '📱 Share WiFi password and house rules',
    '🚗 Arrange parking or transport if needed',
    '📸 Create a photo corner for memories'
  ];

  const randomTips = tips.sort(() => Math.random() - 0.5).slice(0, 3);
  const guestNames = guests.map(g => g.name).join(', ');
  const tipEl = document.getElementById('guestPrepTip');
  if (tipEl) {
    tipEl.textContent = `👥 Guests: ${guestNames}\n💡 Tips:\n${randomTips.map(t => `• ${t}`).join('\n')}`;
  }
  showToast('👥 Guest prep tips generated!', 'info');
}

// ---------- RECIPE MANAGEMENT ----------
function getRecipeSuggestions(input) {
  const normalized = input.toLowerCase();
  const keywordList = normalized.split(/[,\s]+/).filter(Boolean);

  const allRecipes = [
    {
      name: 'Chicken Karahi',
      description: 'A rich and spicy Pakistani chicken curry with tomatoes and green chillies.',
      ingredients: ['500g chicken', '2 tomatoes', '1 onion', '3 garlic cloves', '1 tsp ginger', '2 green chillies', '1 tbsp oil', 'salt', 'coriander'],
      steps: [
        'Heat oil and fry sliced onion until golden brown.',
        'Add ginger, garlic, and green chillies and cook for one minute.',
        'Add chicken and cook until it turns slightly brown.',
        'Add chopped tomatoes, salt, and spices, then simmer until the oil separates.',
        'Finish with coriander and serve hot with naan or rice.'
      ],
      time: '35 min',
      servings: '4',
      tags: ['chicken', 'tomato', 'curry', 'spicy', 'pakistani']
    },
    {
      name: 'Tomato Egg Curry',
      description: 'A quick and comforting curry made with eggs and tomatoes for a budget-friendly meal.',
      ingredients: ['4 eggs', '3 tomatoes', '1 onion', '2 garlic cloves', '1 tsp turmeric', '1 tsp chilli powder', '1 tbsp oil', 'salt'],
      steps: [
        'Boil the eggs, peel them, and set aside.',
        'Saute onion in oil until soft and golden.',
        'Add garlic, turmeric, and chilli powder and stir for a minute.',
        'Add chopped tomatoes and cook until they soften into a thick gravy.',
        'Add the boiled eggs and simmer for 5 minutes.',
        'Serve with roti or steamed rice.'
      ],
      time: '25 min',
      servings: '3',
      tags: ['egg', 'eggs', 'tomato', 'curry', 'quick']
    },
    {
      name: 'Daal Chawal',
      description: 'Simple lentils with rice, perfect for a wholesome everyday lunch.',
      ingredients: ['1 cup lentils', '1 cup rice', '1 onion', '2 tomatoes', '1 tsp turmeric', '1 tsp cumin', 'salt', 'water'],
      steps: [
        'Wash the lentils and rice well.',
        'Cook lentils with turmeric and water until soft.',
        'In a separate pan, fry onion and tomatoes with cumin.',
        'Add the fried mixture to the lentils and stir.',
        'Cook rice separately and serve with the daal.'
      ],
      time: '40 min',
      servings: '4',
      tags: ['lentil', 'rice', 'daal', 'healthy', 'comfort']
    },
    {
      name: 'Aloo Gosht',
      description: 'A hearty meat and potato dish with rich, slow-cooked flavors.',
      ingredients: ['500g meat', '3 potatoes', '1 onion', '2 tomatoes', '1 tbsp ginger garlic paste', 'salt', 'spices'],
      steps: [
        'Brown the meat with onion in a heavy pot.',
        'Add ginger-garlic paste and spices, then stir well.',
        'Add tomatoes and cook until the mixture thickens.',
        'Add potatoes and enough water to simmer gently.',
        'Cook until the meat is tender and the gravy is rich.'
      ],
      time: '60 min',
      servings: '4',
      tags: ['meat', 'potato', 'gosht', 'hearty']
    },
    {
      name: 'Chicken Biryani',
      description: 'Layered rice and chicken cooked with aromatic spices and herbs.',
      ingredients: ['500g chicken', '2 cups rice', '1 onion', '2 tomatoes', 'yogurt', 'biryani masala', 'mint', 'coriander'],
      steps: [
        'Marinate chicken with yogurt and biryani masala.',
        'Cook rice until partially done and set aside.',
        'Fry onions and add tomatoes and marinated chicken.',
        'Layer rice and chicken in a pot with herbs.',
        'Cook on low heat until fragrant and fully cooked.'
      ],
      time: '70 min',
      servings: '5',
      tags: ['chicken', 'rice', 'biryani', 'aromatic']
    },
    {
      name: 'Shahi Paneer',
      description: 'Creamy and rich paneer curry with a smooth tomato gravy.',
      ingredients: ['250g paneer', '2 tomatoes', '1 onion', '1 tbsp cream', 'cashews', 'garlic', 'spices'],
      steps: [
        'Blend tomatoes, onion, garlic, and cashews into a smooth paste.',
        'Cook the paste in oil until the raw smell disappears.',
        'Add spices and cream, then simmer gently.',
        'Add paneer cubes and cook until coated.',
        'Serve with naan or rice.'
      ],
      time: '30 min',
      servings: '3',
      tags: ['paneer', 'cream', 'vegetarian', 'rich']
    }
  ];

  const matched = allRecipes.filter(recipe => {
    const haystack = `${recipe.name} ${recipe.description} ${recipe.ingredients.join(' ')} ${recipe.tags.join(' ')}`.toLowerCase();
    return keywordList.some(word => {
      if (!word) return false;
      if (haystack.includes(word)) return true;
      if (word.endsWith('s') && haystack.includes(word.slice(0, -1))) return true;
      return recipe.tags.some(tag => tag.includes(word) || word.includes(tag));
    });
  });

  if (matched.length > 0) return matched.slice(0, 3);
  return allRecipes.slice(0, 3);
}

function generateRecipe() {
  const input = document.getElementById('recipeIngredients');
  const ingredients = input.value.trim();
  if (!ingredients) {
    showToast('🍳 Please enter some ingredients!', 'error');
    return;
  }

  const recipes = getRecipeSuggestions(ingredients);
  const container = document.getElementById('recipeContent');
  if (!container) return;

  let html = `<h4 style="margin-bottom:16px;">🍳 Complete recipes for: "${escapeHtml(ingredients)}"</h4>`;
  html += recipes.map((recipe, i) => `
    <div class="recipe-item">
      <div class="recipe-header-row">
        <div>
          <h4>${i + 1}. ${escapeHtml(recipe.name)}</h4>
          <p>${escapeHtml(recipe.description)}</p>
        </div>
        <button class="btn-save-recipe" data-name="${escapeHtml(recipe.name)}" data-description="${escapeHtml(recipe.description)}" data-ingredients='${JSON.stringify(recipe.ingredients).replace(/'/g, "&apos;")}' data-steps='${JSON.stringify(recipe.steps).replace(/'/g, "&apos;")}' data-time="${escapeHtml(recipe.time)}" data-servings="${escapeHtml(recipe.servings)}" onclick="saveRecipeFromButton(this)">
          <i class="fas fa-bookmark"></i> Save Recipe
        </button>
      </div>
      <div class="recipe-meta">
        <span><i class="fas fa-clock"></i> ${escapeHtml(recipe.time)}</span>
        <span><i class="fas fa-users"></i> ${escapeHtml(recipe.servings)} servings</span>
      </div>
      <div class="recipe-section">
        <h5>Ingredients</h5>
        <ul>${recipe.ingredients.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
      <div class="recipe-section">
        <h5>Method</h5>
        <ol>${recipe.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
  showToast('🍳 Complete recipes ready!', 'success');
}

function saveRecipeFromButton(button) {
  const name = button.dataset.name;
  const description = button.dataset.description;
  const ingredients = JSON.parse(button.dataset.ingredients || '[]');
  const steps = JSON.parse(button.dataset.steps || '[]');
  const time = button.dataset.time;
  const servings = button.dataset.servings;
  saveRecipe(name, description, ingredients, steps, time, servings);
}

function saveRecipe(name, description, ingredients = [], steps = [], time = '', servings = '') {
  const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  recipes.push({
    name,
    description,
    ingredients,
    steps,
    time,
    servings,
    savedAt: new Date().toISOString()
  });
  localStorage.setItem('recipes', JSON.stringify(recipes));
  loadSavedRecipes();
  showToast(`📖 Recipe "${name}" saved!`, 'success');
}

function loadSavedRecipes() {
  const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  const tbody = document.getElementById('savedRecipesBody');
  if (!tbody) return;

  if (recipes.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:30px;color:#94a3b8;">No saved recipes yet.</td></tr>';
    const count = document.getElementById('savedRecipeCount');
    if (count) count.textContent = 'Total: 0';
    return;
  }

  let html = '';
  recipes.forEach((recipe, index) => {
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : recipe.description || '';
    const steps = Array.isArray(recipe.steps) ? recipe.steps.slice(0, 2).join(' • ') : '';
    html += `
      <tr>
        <td><strong>${escapeHtml(recipe.name)}</strong></td>
        <td>${escapeHtml(`${ingredients}${steps ? ' | ' + steps : ''}`)}</td>
        <td>
          <div class="action-btns">
            <button class="btn-delete" onclick="deleteRecipe(${index})"><i class="fas fa-trash"></i> Delete</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  const count = document.getElementById('savedRecipeCount');
  if (count) count.textContent = `Total: ${recipes.length}`;
}

function deleteRecipe(index) {
  const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  if (confirm(`Delete "${recipes[index].name}" recipe?`)) {
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
    loadSavedRecipes();
    showToast('🗑️ Recipe deleted.', 'warning');
  }
}

// ---------- SETTINGS ----------
function loadSettings() {
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const familyNameInput = document.getElementById('familyName');
  const familyCityInput = document.getElementById('familyCity');
  if (familyNameInput) familyNameInput.value = profile.familyName || '';
  if (familyCityInput) familyCityInput.value = profile.city || '';

  const notifSettings = JSON.parse(localStorage.getItem('notifications') || '{}');
  const notifBills = document.getElementById('notifBills');
  const notifGrocery = document.getElementById('notifGrocery');
  const notifGuests = document.getElementById('notifGuests');
  const notifRecipes = document.getElementById('notifRecipes');

  if (notifBills) notifBills.checked = notifSettings.bills !== false;
  if (notifGrocery) notifGrocery.checked = notifSettings.grocery !== false;
  if (notifGuests) notifGuests.checked = notifSettings.guests !== false;
  if (notifRecipes) notifRecipes.checked = notifSettings.recipes === true;
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('profileForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const profile = {
        familyName: document.getElementById('familyName').value.trim(),
        city: document.getElementById('familyCity').value.trim()
      };
      localStorage.setItem('profile', JSON.stringify(profile));
      showToast('✅ Profile saved!', 'success');
    });
  }
});

function saveNotificationSettings() {
  const settings = {
    bills: document.getElementById('notifBills').checked,
    grocery: document.getElementById('notifGrocery').checked,
    guests: document.getElementById('notifGuests').checked,
    recipes: document.getElementById('notifRecipes').checked
  };
  localStorage.setItem('notifications', JSON.stringify(settings));
  showToast('🔔 Notification settings saved!', 'success');
}

function exportData() {
  const data = {
    bills: JSON.parse(localStorage.getItem('bills') || '[]'),
    grocery: JSON.parse(localStorage.getItem('grocery') || '[]'),
    guests: JSON.parse(localStorage.getItem('guests') || '[]'),
    recipes: JSON.parse(localStorage.getItem('recipes') || '[]'),
    profile: JSON.parse(localStorage.getItem('profile') || '{}'),
    notifications: JSON.parse(localStorage.getItem('notifications') || '{}')
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gharwalaai_data_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Data exported successfully!', 'success');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.bills) localStorage.setItem('bills', JSON.stringify(data.bills));
        if (data.grocery) localStorage.setItem('grocery', JSON.stringify(data.grocery));
        if (data.guests) localStorage.setItem('guests', JSON.stringify(data.guests));
        if (data.recipes) localStorage.setItem('recipes', JSON.stringify(data.recipes));
        if (data.profile) localStorage.setItem('profile', JSON.stringify(data.profile));
        if (data.notifications) localStorage.setItem('notifications', JSON.stringify(data.notifications));
        showToast('📥 Data imported successfully!', 'success');
        loadBills();
        loadGrocery();
        loadGuests();
        loadSavedRecipes();
        loadSettings();
        updateDashboardStats();
      } catch (err) {
        showToast('❌ Invalid file format!', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function clearAllData() {
  if (confirm('⚠️ WARNING: This will delete ALL your data. Continue?')) {
    if (confirm('Are you sure? This cannot be undone!')) {
      localStorage.clear();
      showToast('🗑️ All data cleared!', 'warning');
      loadBills();
      loadGrocery();
      loadGuests();
      loadSavedRecipes();
      loadSettings();
      updateDashboardStats();
      clearChat();
    }
  }
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', function() {
  updateDate();

  const page = window.location.pathname.split('/').pop();
  if (page === 'index.html' || page === '') {
    updateDashboardStats();
    updateNotificationBadge();
  }
  if (page === 'bills.html') loadBills();
  if (page === 'grocery.html') loadGrocery();
  if (page === 'guests.html') loadGuests();
  if (page === 'recipes.html') loadSavedRecipes();
  if (page === 'settings.html') loadSettings();

  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.menu-toggle');
    if (sidebar && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggle?.contains(e.target)) {
        sidebar.classList.remove('open');
        document.getElementById('sidebarOverlay')?.classList.remove('show');
      }
    }
  });

  console.log('🏠 GharWalaAI loaded successfully!');
  console.log('📦 Data stored in localStorage.');
});

// ---------- KEYBOARD SHORTCUTS ----------
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key === 'Enter') {
    const chatInput = document.getElementById('chatInput');
    if (chatInput && document.activeElement === chatInput) {
      sendMessage();
    }
  }
});

function getGuestPrepTips() {
  const guests = JSON.parse(localStorage.getItem('guests') || '[]');
  const el = document.getElementById('guestPrepTip');
  if (!el) return;
  if (!guests.length) { el.textContent = '👤 No guests added yet. Add guests first!'; return; }
  const names = guests.map(g => g.name).join(', ');
  el.textContent = `👥 Guests: ${names}\n💡 Tips: prepare room, snacks, towels, and wifi details.`;
  showToast('👥 Guest prep tips generated!', 'info');
}

function generateRecipe() {
  const input = document.getElementById('recipeIngredients');
  const container = document.getElementById('recipeContent');
  if (!input || !container) return;
  const ingredients = input.value.trim();
  if (!ingredients) { showToast('🍳 Please enter some ingredients!', 'error'); return; }
  const suggestions = getRecipeSuggestions(ingredients);
  container.innerHTML = `<h4 style="margin-bottom:12px;">Recipes based on: ${escapeHtml(ingredients)}</h4>${suggestions.map((recipe, index) => `
    <div class="recipe-item">
      <h4>${index + 1}. ${escapeHtml(recipe.name)}</h4>
      <p>${escapeHtml(recipe.description)}</p>
      <button class="btn-save-recipe" onclick="saveRecipe('${recipe.name}', '${recipe.description.replace(/'/g, "\\'")}')"><i class="fas fa-bookmark"></i> Save Recipe</button>
    </div>`).join('')}`;
  showToast('🍳 Recipes generated!', 'success');
}

function getRecipeSuggestions(input) {
  const allRecipes = [
    { name: 'Chicken Karahi', description: 'Chicken, tomatoes, ginger, garlic, green chillies, spices' },
    { name: 'Aloo Gosht', description: 'Potatoes, meat or chicken, onion, garlic, spices' },
    { name: 'Daal Chawal', description: 'Lentils, rice, onion, tomatoes, spices' },
    { name: 'Tomato Egg Curry', description: 'Tomatoes, eggs, onion, garlic, turmeric, chilli' }
  ];
  const matched = allRecipes.filter(r => input.split(',').some(i => r.description.toLowerCase().includes(i.trim().toLowerCase())));
  return matched.length ? matched.slice(0, 4) : [
    { name: 'Aaloo Gosht', description: 'Try potatoes, meat, onion and tomatoes' },
    { name: 'Daal Chawal', description: 'Basic lentils, rice, onion and spices' }
  ];
}

function saveRecipe(name, description) {
  const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  recipes.push({ name, description, savedAt: new Date().toISOString() });
  localStorage.setItem('recipes', JSON.stringify(recipes));
  loadSavedRecipes();
  showToast(`📖 Recipe "${name}" saved!`, 'success');
}

function loadSavedRecipes() {
  const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  const tbody = document.getElementById('savedRecipesBody');
  if (!tbody) return;

  if (!recipes.length) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:#64748b;padding:24px;">No saved recipes yet.</td></tr>';
    const total = document.getElementById('savedRecipeCount');
    if (total) total.textContent = 'Total: 0';
    return;
  }

  tbody.innerHTML = recipes.map((recipe, index) => `
    <tr>
      <td><strong>${escapeHtml(recipe.name)}</strong></td>
      <td>${escapeHtml(recipe.description)}</td>
      <td><button class="btn-delete" onclick="deleteRecipe(${index})"><i class="fas fa-trash"></i> Delete</button></td>
    </tr>`).join('');

  const total = document.getElementById('savedRecipeCount');
  if (total) total.textContent = `Total: ${recipes.length}`;
}

function deleteRecipe(index) {
  const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
  if (!confirm(`Delete "${recipes[index].name}" recipe?`)) return;
  recipes.splice(index, 1);
  localStorage.setItem('recipes', JSON.stringify(recipes));
  loadSavedRecipes();
  updateDashboardStats();
  showToast('🗑️ Recipe deleted.', 'warning');
}

function loadSettings() {
  const profile = JSON.parse(localStorage.getItem('profile') || '{}');
  const family = document.getElementById('familyName');
  const city = document.getElementById('familyCity');
  if (family) family.value = profile.familyName || '';
  if (city) city.value = profile.city || '';

  const notifSettings = JSON.parse(localStorage.getItem('notifications') || '{}');
  document.getElementById('notifBills') && (document.getElementById('notifBills').checked = notifSettings.bills !== false);
  document.getElementById('notifGrocery') && (document.getElementById('notifGrocery').checked = notifSettings.grocery !== false);
  document.getElementById('notifGuests') && (document.getElementById('notifGuests').checked = notifSettings.guests !== false);
  document.getElementById('notifRecipes') && (document.getElementById('notifRecipes').checked = notifSettings.recipes === true);
}

function saveProfile(e) {
  e.preventDefault();
  const profile = {
    familyName: document.getElementById('familyName')?.value.trim() || '',
    city: document.getElementById('familyCity')?.value.trim() || ''
  };
  localStorage.setItem('profile', JSON.stringify(profile));
  showToast('✅ Profile saved!', 'success');
}

function saveNotificationSettings() {
  const settings = {
    bills: document.getElementById('notifBills')?.checked ?? true,
    grocery: document.getElementById('notifGrocery')?.checked ?? true,
    guests: document.getElementById('notifGuests')?.checked ?? true,
    recipes: document.getElementById('notifRecipes')?.checked ?? false
  };
  localStorage.setItem('notifications', JSON.stringify(settings));
  showToast('🔔 Notification settings saved!', 'success');
}

function exportData() {
  const data = {
    bills: JSON.parse(localStorage.getItem('bills') || '[]'),
    grocery: JSON.parse(localStorage.getItem('grocery') || '[]'),
    guests: JSON.parse(localStorage.getItem('guests') || '[]'),
    recipes: JSON.parse(localStorage.getItem('recipes') || '[]'),
    profile: JSON.parse(localStorage.getItem('profile') || '{}'),
    notifications: JSON.parse(localStorage.getItem('notifications') || '{}')
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gharwalaai_data_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Data exported successfully!', 'success');
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.bills) localStorage.setItem('bills', JSON.stringify(data.bills));
        if (data.grocery) localStorage.setItem('grocery', JSON.stringify(data.grocery));
        if (data.guests) localStorage.setItem('guests', JSON.stringify(data.guests));
        if (data.recipes) localStorage.setItem('recipes', JSON.stringify(data.recipes));
        if (data.profile) localStorage.setItem('profile', JSON.stringify(data.profile));
        if (data.notifications) localStorage.setItem('notifications', JSON.stringify(data.notifications));
        loadBills(); loadGrocery(); loadGuests(); loadSavedRecipes(); loadSettings(); updateDashboardStats();
        showToast('📥 Data imported successfully!', 'success');
      } catch (err) {
        showToast('❌ Invalid file format!', 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function clearAllData() {
  if (!confirm('⚠️ This will delete all your data. Continue?')) return;
  localStorage.clear();
  loadBills(); loadGrocery(); loadGuests(); loadSavedRecipes(); loadSettings(); updateDashboardStats();
  clearChat();
  showToast('🗑️ All data cleared!', 'warning');
}

function initApp() {
  updateDate();
  updateDashboardStats();
  loadBills();
  loadGrocery();
  loadGuests();
  loadSavedRecipes();
  loadSettings();

  const billForm = document.getElementById('billForm');
  if (billForm) billForm.addEventListener('submit', addBill);

  const groceryForm = document.getElementById('groceryForm');
  if (groceryForm) groceryForm.addEventListener('submit', addGrocery);

  const guestForm = document.getElementById('guestForm');
  if (guestForm) guestForm.addEventListener('submit', addGuest);

  const profileForm = document.getElementById('profileForm');
  if (profileForm) profileForm.addEventListener('submit', saveProfile);

  const chatInput = document.getElementById('chatInput');
  if (chatInput) chatInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') sendMessage(); });

  document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.menu-toggle');
    if (sidebar?.classList.contains('open') && !sidebar.contains(e.target) && !toggle?.contains(e.target)) {
      toggleSidebar();
    }
  });

  console.log('🏠 GharWalaAI loaded successfully');
}

document.addEventListener('DOMContentLoaded', initApp);
