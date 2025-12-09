// application fulfills the following four properties
// 1. One or more classes
// 2. Contains form fields and validates those fields
// 3. Sets, updates and changes local storage
// 4. Write testable code, use Jasmine unit tests

class RSVP {
  constructor(firstName, lastName, email, phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.timestamp = Date.now();
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  getFirstName() {
    return `${this.firstName}`;
  }

  getLastName() {
    return `${this.lastName}`;
  }

  getEmail() {
    return `${this.email}`;
  }
  
  getPhone() {
    return `${this.phone}`;
  }

  getTimestamp() {
    return `${this.timestamp}`;
  }

  toString() {
    return `${this.firstName} - ${this.lastName} - ${this.email} - ${this.phone} - ${this.timestamp}`;
  }
}

// ------------------- Validation Functions -------------------
function validateFirstName(name) {
  return name && name.trim().length >= 1 ? '' : 'First name must be at least 1 character.';
}

function validateLastName(name) {
  return name && name.trim().length >= 1 ? '' : 'Last name must be at least 1 character.';
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? '' : 'Email must be valid.';
}

function validatePhone(phone) {
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phone) ? '' : 'Phone must be in format 123-456-7890.';
}

document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById('rsvp-form');
const list = document.getElementById('rsvp-list');
const showCountBtn = document.getElementById('show-count');

// ---- If DOM elements are missing (Jasmine), skip DOM code ----
  if (!form || !list || !showCountBtn) return;

let rsvps = JSON.parse(localStorage.getItem('rsvp_list'))?.map(
  o => new RSVP(o.firstName, o.lastName, o.email, o.phone)
) || [];

// ------------------- Render List -------------------
function renderList() {
  list.innerHTML = '';
  if (rsvps.length === 0) {
    list.innerHTML = '<p>No RSVPs submitted.</p>';
    return;
  }
  rsvps.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'list-group-item';
    div.textContent = entry.getFullName();
    list.appendChild(div);
  });
}

// ------------------- Form Submit -------------------
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const firstName = form.querySelector('#first-name').value.trim();
  const lastName = form.querySelector('#last-name').value.trim();
  const email = form.querySelector('#email').value.trim();
  const phone = form.querySelector('#phone').value.trim();

  // Validate all fields
  const errors = [
    validateFirstName(firstName),
    validateLastName(lastName),
    validateEmail(email),
    validatePhone(phone)
  ].filter(Boolean);

  if (errors.length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Please fix the following errors:',
      html: errors.map(err => `<p>${err}</p>`).join(''),
    });
    // alert('Please fix the following errors:\n- ' + errors.join('\n- '));
    // using sweet alert 2 popup
    return;
  }

  // Create new RSVP object
  const newRsvp = new RSVP(firstName, lastName, email, phone);

  // If there is already a person with the same name do not input the new entry
  if (rsvps.some(r => r.getFullName() === newRsvp.getFullName())) {
    Swal.fire({
      icon: 'warning',
      title: 'Duplicate Entry',
      text: 'This person already exists. Please enter a new person or contact the administrator to remove/update the duplicate entry.',
    });
    //alert('This person already exists. Please enter a new person or contact the administrator to remove/update the duplicate entry.');
    form.reset();
    return;
  }

  rsvps.push(newRsvp);

  // Save to localStorage
  localStorage.setItem('rsvp_list', JSON.stringify(rsvps));

  // Save a hash map to localStorage for checking duplicate entries
  localStorage.setItem(newRsvp.getFullName(), JSON.stringify(rsvps));

  // Render updated list and reset form
  renderList();
  form.reset();
});

// ------------------- Show Total Attendees -------------------
showCountBtn.addEventListener('click', () => {
  Swal.fire({
    icon: 'info',
    title: 'Total Registered',
    html: `<h2 style="font-size: 2rem; margin-top: 10px;">${rsvps.length}</h2>`,
  });
});

// ------------------- Initial Render -------------------
renderList();

});