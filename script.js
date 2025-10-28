document.addEventListener('DOMContentLoaded', () => {
    // --- HIỆU ỨNG FADE-IN KHI CUỘN TRANG ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    const elementsToFadeIn = document.querySelectorAll('.fade-in');
    elementsToFadeIn.forEach(el => observer.observe(el));

    // --- LOGIC CHO MODAL ĐẶT HÀNG (SỬ DỤNG FORMSPREE) ---
    const orderModal = document.getElementById('orderModal');
    const closeButton = document.querySelector('.close-button');
    const addToCartButtons = document.querySelectorAll('.product-card .cta-button');
    const orderForm = document.getElementById('orderForm');
    const modalTitle = document.getElementById('modalTitle');
    const productNameInput = document.getElementById('productNameInput');
    const submitButton = orderForm.querySelector('.form-submit-button');

    function openModal() {
        orderModal.style.display = 'flex';
    }

    function closeModal() {
        orderModal.style.display = 'none';
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            modalTitle.textContent = `Đặt mua: ${productName}`;
            productNameInput.value = productName;
            openModal();
        });
    });

    closeButton.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === orderModal) {
            closeModal();
        }
    });

    // Xử lý sự kiện submit form - Gửi bằng FORMSPREE
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định của form

        const form = event.target;
        const formData = new FormData(form);
        const originalButtonText = submitButton.textContent;
        
        submitButton.textContent = 'Đang gửi...';
        submitButton.disabled = true;

        // Gửi dữ liệu đến endpoint của Formspree bằng fetch
        fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json' // Yêu cầu Formspree trả về JSON
            }
        }).then(response => {
            if (response.ok) {
                // Nếu gửi thành công
                alert('Đặt hàng thành công!\nChúng tôi đã nhận được thông tin và sẽ liên hệ với bạn sớm nhất. Cảm ơn bạn!');
                form.reset();
                closeModal();
            } else {
                // Nếu có lỗi từ phía server
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Đã có lỗi xảy ra. Vui lòng thử lại.');
                    }
                })
            }
        }).catch(error => {
            // Nếu có lỗi mạng
            console.error('Error:', error);
            alert('Gửi đơn hàng thất bại do lỗi mạng. Vui lòng kiểm tra kết nối và thử lại.');
        }).finally(() => {
            // Khôi phục lại trạng thái nút bấm dù thành công hay thất bại
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
});