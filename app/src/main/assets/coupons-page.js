 // Select all buttons with the "check-availability-btn" class
  document.querySelectorAll('.check-availability-btn').forEach(button => {
    button.addEventListener('click', function() {
      // Get the category and coupon count from data attributes
      const category = this.getAttribute('data-category');
      const couponCount = this.getAttribute('data-coupons');

      // Navigate to the page dynamically (modify the URL as needed)
      window.location.href = `coupon-detailed-view.html?category=${category}&coupons=${couponCount}`;
    });
  });