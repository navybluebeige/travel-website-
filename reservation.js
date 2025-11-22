 document.addEventListener('DOMContentLoaded', function() {
            // Room option selection
            const roomOptions = document.querySelectorAll('.room-option');
            let selectedRoom = null;
            
            roomOptions.forEach(option => {
                option.addEventListener('click', function() {
                    roomOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    selectedRoom = this.getAttribute('data-value');
                });
            });
            
            // Amenity selection
            const amenityOptions = document.querySelectorAll('.amenity-option');
            let selectedAmenities = [];
            
            amenityOptions.forEach(option => {
                option.addEventListener('click', function() {
                    this.classList.toggle('selected');
                    
                    const value = this.getAttribute('data-value');
                    if (this.classList.contains('selected')) {
                        selectedAmenities.push(value);
                    } else {
                        selectedAmenities = selectedAmenities.filter(item => item !== value);
                    }
                });
            });
            
            // Form submission
            const bookingForm = document.getElementById('bookingForm');
            const confirmation = document.getElementById('confirmation');
            const bookingDetails = document.getElementById('bookingDetails');
            const newBookingBtn = document.getElementById('newBooking');
            
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validate room selection
                if (!selectedRoom) {
                    alert('Please select a room type');
                    return;
                }
                
                // Get form values
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const checkIn = document.getElementById('checkIn').value;
                const checkOut = document.getElementById('checkOut').value;
                const adults = document.getElementById('adults').value;
                const children = document.getElementById('children').value;
                
                // Calculate stay duration
                const checkInDate = new Date(checkIn);
                const checkOutDate = new Date(checkOut);
                const stayDuration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
                
                // Calculate price
                let pricePerNight = 0;
                switch(selectedRoom) {
                    case 'standard':
                        pricePerNight = 199;
                        break;
                    case 'deluxe':
                        pricePerNight = 299;
                        break;
                    case 'suite':
                        pricePerNight = 499;
                        break;
                }
                
                const totalPrice = pricePerNight * stayDuration;
                
                // Display confirmation
                bookingDetails.innerHTML = `
                    <p><strong>Guest:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Check-in:</strong> ${formatDate(checkIn)}</p>
                    <p><strong>Check-out:</strong> ${formatDate(checkOut)}</p>
                    <p><strong>Guests:</strong> ${adults} Adults, ${children} Children</p>
                    <p><strong>Room Type:</strong> ${capitalizeFirstLetter(selectedRoom)}</p>
                    <p><strong>Stay Duration:</strong> ${stayDuration} nights</p>
                    <p><strong>Total Price:</strong> $${totalPrice}</p>
                `;
                
                if (selectedAmenities.length > 0) {
                    bookingDetails.innerHTML += `<p><strong>Special Requests:</strong> ${selectedAmenities.map(capitalizeFirstLetter).join(', ')}</p>`;
                }
                
                // Hide form, show confirmation
                bookingForm.style.display = 'none';
                confirmation.style.display = 'block';
            });
            
            // Make a new booking
            newBookingBtn.addEventListener('click', function() {
                // Reset form
                bookingForm.reset();
                roomOptions.forEach(opt => opt.classList.remove('selected'));
                amenityOptions.forEach(opt => opt.classList.remove('selected'));
                selectedRoom = null;
                selectedAmenities = [];
                
                // Show form, hide confirmation
                confirmation.style.display = 'none';
                bookingForm.style.display = 'block';
            });
            
            // Set min date for check-in to today
            const today = new Date();
            const checkInInput = document.getElementById('checkIn');
            checkInInput.min = today.toISOString().split('T')[0];
            
            // Date validation
            checkInInput.addEventListener('change', function() {
                const tomorrow = new Date(this.value);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                const checkOutInput = document.getElementById('checkOut');
                checkOutInput.min = tomorrow.toISOString().split('T')[0];
                
                if (checkOutInput.value && new Date(checkOutInput.value) <= new Date(this.value)) {
                    checkOutInput.value = tomorrow.toISOString().split('T')[0];
                }
            });
            
            // Helper functions
            function formatDate(dateString) {
                const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString(undefined, options);
            }
            
            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        });