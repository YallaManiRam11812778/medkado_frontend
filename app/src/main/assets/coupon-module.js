// Function to create and add the coupon-count HTML structure to a container
function createCouponCount(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error(`Container with selector "${containerSelector}" not found.`);
    return;
  }

  // Create the coupon-count structure
  const couponCountHTML = `
    <div class="header">
      <p class="coupon-count">You have <br><span></span></p>
      <p class="coupon-head-desc">with various discounts</p>
    </div>
  `;

  container.innerHTML = couponCountHTML;
}

// Function to update the coupon count dynamically
function updateCouponCount(coupons) {
  const totalCouponsLeft = coupons.reduce((sum, coupon) => sum + coupon.available_number_of_coupons, 0);

  // Update the total count in the specified span element
  const couponCountSpan = document.querySelector('.header .coupon-count span');
  if (couponCountSpan) {
    couponCountSpan.textContent = `x ${totalCouponsLeft} free coupons`;
  }
}

// Export the functions for reuse
export { createCouponCount, updateCouponCount };
