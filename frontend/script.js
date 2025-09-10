const SERVER_IP = "http://localhost:3222";
document.addEventListener('DOMContentLoaded', () => {
    new AbsenceNotificationSystem();
    
    // Show demo message
    setTimeout(() => {
        const messageEl = document.getElementById('statusMessage');
        messageEl.className = 'status-message success';
        messageEl.classList.remove('hidden');
        
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 8000);
    }, 1000);
});

class AbsenceNotificationSystem {
    constructor() {
        this.currentStudentId = null;
        this.timetableData = {};
        this.currentEditCell = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Load timetable button
        document.getElementById('loadTimetable').addEventListener('click', () => {
            this.loadTimetable();
        });

        // Student ID input enter key
        document.getElementById('studentId').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.loadTimetable();
            }
        });

        // Editable cells
        document.querySelectorAll('.editable').forEach(cell => {
            cell.addEventListener('click', () => {
                this.openClassModal(cell);
            });
        });

        // Update timetable button
        document.getElementById('updateTimetable').addEventListener('click', () => {
            this.updateTimetable();
        });

        // Delete timetable button
        document.getElementById('deleteTimetable').addEventListener('click', () => {
            this.deleteTimetable();
        });

        // Absence form submission
        document.getElementById('absenceForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitAbsence();
        });

        // Modal event listeners
        this.initModalEventListeners();
    }

    initModalEventListeners() {
        const modal = document.getElementById('classModal');
        const closeBtn = document.querySelector('.close');
        const saveBtn = document.getElementById('saveClass');
        const cancelBtn = document.getElementById('cancelEdit');

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });

        saveBtn.addEventListener('click', () => {
            this.saveClassDetails();
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    async loadTimetable() {
        const studentId = document.getElementById('studentId').value.trim();
        
        if (!studentId) {
            this.showMessage('Please enter a Student ID', 'error');
            return;
        }

        try {
            this.showMessage('Loading timetable...', 'success');
            
            // Simulate GET request to load timetable
            const response = await this.mockApiCall('GET', `/api/timetable?studentId=${studentId}`);
            
            if (response.success) {
                this.currentStudentId = studentId;
                this.timetableData = response || {};
                this.renderTimetable();
                this.showMessage('Timetable loaded successfully!', 'success');
            } else {
                this.showMessage('Failed to load timetable. Creating new one.', 'error');
                this.currentStudentId = studentId;
                this.timetableData = {};
                this.renderTimetable();
            }
        } catch (error) {
            this.showMessage('Error loading timetable: ' + error.message, 'error');
            this.currentStudentId = studentId; // please remove this when backend ready #VERY IMPORTANT !!!
        }
    }

    renderTimetable() {
        document.querySelectorAll('.editable').forEach(cell => {
            const day = cell.dataset.day;
            const period = cell.dataset.period;
            const key = `${day}_${period}`;
            
            const classData = this.timetableData[key];
            
            if (classData) {
                cell.innerHTML = `
                    <div class="class-info">
                        <div class="subject">${classData.subject}</div>
                        <div class="teacher">${classData.teacher}</div>
                        <div class="email">${classData.email}</div>
                    </div>
                `;
                cell.classList.add('has-class');
            } else {
                cell.innerHTML = '<div style="color: #ccc; font-size: 12px;">Click to add class</div>';
                cell.classList.remove('has-class');
            }
        });
    }

    openClassModal(cell) {
        if (!this.currentStudentId) {
            this.showMessage('Please load a timetable first', 'error');
            return;
        }

        this.currentEditCell = cell;
        const day = cell.dataset.day;
        const period = cell.dataset.period;
        const key = `${day}_${period}`;
        const classData = this.timetableData[key] || {};

        // Populate modal fields
        document.getElementById('subjectName').value = classData.subject || '';
        document.getElementById('teacherName').value = classData.teacher || '';
        document.getElementById('teacherEmail').value = classData.email || '';

        // Show modal
        document.getElementById('classModal').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('classModal').classList.add('hidden');
        this.currentEditCell = null;
    }

    saveClassDetails() {
        if (!this.currentEditCell) return;

        const subject = document.getElementById('subjectName').value.trim();
        const teacher = document.getElementById('teacherName').value.trim();
        const email = document.getElementById('teacherEmail').value.trim();

        const day = this.currentEditCell.dataset.day;
        const period = this.currentEditCell.dataset.period;
        const key = `${day}_${period}`;

        if (subject && teacher && email) {
            this.timetableData[key] = { subject, teacher, email };
        } else if (!subject && !teacher && !email) {
            delete this.timetableData[key];
        } else {
            this.showMessage('Please fill all fields or leave all empty to remove class', 'error');
            return;
        }

        this.renderTimetable();
        this.closeModal();
    }

    async updateTimetable() {
        if (!this.currentStudentId) {
            this.showMessage('Please load a timetable first', 'error');
            return;
        }

        try {
            this.showMessage('Updating timetable...', 'success');
            
            // Simulate PUT request to update timetable
            const response = await this.mockApiCall('PUT', '/api/timetable', {
                studentId: this.currentStudentId,
                timetable: this.timetableData
            });

            if (response.success) {
                this.showMessage('Timetable updated successfully!', 'success');
            } else {
                this.showMessage('Failed to update timetable', 'error');
            }
        } catch (error) {
            this.showMessage('Error updating timetable: ' + error.message, 'error');
        }
    }

    async deleteTimetable() {
        if (!this.currentStudentId) {
            this.showMessage('Please load a timetable first', 'error');
            return;
        }

        if (!confirm('Are you sure you want to delete this timetable? This action cannot be undone.')) {
            return;
        }

        try {
            this.showMessage('Deleting timetable...', 'success');
            
            // Simulate DELETE request
            const response = await this.mockApiCall('DELETE', `/api/timetable?studentId=${this.currentStudentId}`);

            if (response.success) {
                this.currentStudentId = null;
                this.timetableData = {};
                this.renderTimetable();
                document.getElementById('studentId').value = '';
                this.showMessage('Timetable deleted successfully!', 'success');
            } else {
                this.showMessage('Failed to delete timetable', 'error');
            }
        } catch (error) {
            this.showMessage('Error deleting timetable: ' + error.message, 'error');
        }
    }

    async submitAbsence() {
        const day = document.getElementById('absenceDay').value;
        const reason = document.getElementById('absenceReason').value.trim();

        if (!this.currentStudentId) {
            this.showMessage('Please load your timetable first', 'error');
            return;
        }

        if (!day || !reason) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            this.showMessage('Sending absence notifications...', 'success');

            // Get affected classes based on selected day
            const affectedClasses = this.getClassesForDay(day);
            
            if (affectedClasses.length === 0) {
                this.showMessage('No classes found for the selected day', 'error');
                return;
            }

            // Simulate POST request to send absence notifications
            const response = await this.mockApiCall('POST', '/api/absence', {
                studentId: this.currentStudentId,
                day: day,
                reason: reason,
                affectedClasses: affectedClasses
            });

            if (response.success) {
                this.showMessage(`Absence notifications sent to ${affectedClasses.length} teacher(s) successfully!`, 'success');
                
                // Reset form
                document.getElementById('absenceForm').reset();
                
                // Show summary
                this.showAbsenceSummary(affectedClasses, day, reason);
            } else {
                this.showMessage('Failed to send absence notifications', 'error');
            }
        } catch (error) {
            this.showMessage('Error sending notifications: ' + error.message, 'error');
        }
    }

    getClassesForDay(selectedDay) {
        let targetDay = selectedDay;
        
        // Handle "today" and "tomorrow"
        if (selectedDay === 'today' || selectedDay === 'tomorrow') {
            const today = new Date();
            const targetDate = selectedDay === 'today' ? today : new Date(today.getTime() + 24 * 60 * 60 * 1000);
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            targetDay = days[targetDate.getDay()];
        }

        const classes = [];
        
        // Get all classes for the target day
        for (let period = 1; period <= 8; period++) {
            const key = `${targetDay}_${period}`;
            if (this.timetableData[key]) {
                classes.push({
                    period: period,
                    subject: this.timetableData[key].subject,
                    teacher: this.timetableData[key].teacher,
                    email: this.timetableData[key].email
                });
            }
        }
        
        return classes;
    }

    showAbsenceSummary(classes, day, reason) {
        const summary = classes.map(cls => 
            `${cls.subject} - ${cls.teacher} (${cls.email})`
        ).join('<br>');

        console.log(`Absence notification sent for ${day}:`);
        console.log(`Reason: ${reason}`);
        console.log('Teachers notified:');
        classes.forEach(cls => {
            console.log(`- ${cls.teacher} (${cls.email}) - ${cls.subject}`);
        });
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('statusMessage');
        messageEl.textContent = message;
        messageEl.className = `status-message ${type}`;
        messageEl.classList.remove('hidden');

        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageEl.classList.add('hidden');
        }, 5000);
    }

    // Mock API call simulation
    async mockApiCall(method, url, data = null) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
        url = SERVER_IP+url;

        console.log(`${method} ${url}`, data);

        // Simulate different responses based on the endpoint
        if (url.includes('/api/timetable') && method === 'GET') {
            let result = await fetch(url).then((r)=>r.json());
            return result;
        }
        else if (url.includes('/api/absence') && method === 'POST') {
            let result = await fetch(url, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((r) => r.json());
            return result;
        }
        else if (url.includes('/api/timetable') && method === 'DELETE') {
            let result = await fetch(url, {method: "DELETE"});
            return result;
        }
        else if (url.includes('/api/timetable') && method === 'PUT') {
            let result = await fetch(url, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }).then((r) => r.json());
            return result;
        }
    }
}