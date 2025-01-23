// This script will run in the context of the webpage
// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageInfo") {
        sendResponse({
            url: window.location.href,
            title: document.title
        });
    }
});

// 创建并注入角标和二维码模态框
function createQRBadge() {
    // 创建固定容器
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        z-index: 9999;
    `;

    // 创建角标
    const badge = document.createElement('div');
    badge.className = 'qr-badge';
    badge.setAttribute('data-qr-extension', 'true');
    badge.innerHTML = 'QR';

    // 创建二维码模态框
    const modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.setAttribute('data-qr-extension', 'true');
    modal.innerHTML = `
        <div class="qr-container" data-qr-extension="true">
            <canvas class="qr-extension-canvas" id="qrCode" width="150" height="150"></canvas>
            <div class="qr-extension-site-name"></div>
            <div class="qr-extension-page-title"></div>
        </div>
    `;

    // 添加到页面
    container.appendChild(modal);
    container.appendChild(badge);
    document.body.appendChild(container);

    // 点击角标显示/隐藏二维码
    badge.addEventListener('click', () => {
        if (!isDragging) {
            if (modal.classList.contains('show')) {
                modal.classList.remove('show');
            } else {
                modal.classList.add('show');
                generateQRCode();
            }
        }
    });

    // 点击其他区域关闭二维码
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target) && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });

    // 拖动功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    badge.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === badge) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            container.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
}

// 生成二维码的函数
function generateQRCode() {
    const qrCanvas = document.getElementById('qrCode');
    const siteNameElement = document.querySelector('.qr-extension-site-name');
    const pageTitleElement = document.querySelector('.qr-extension-page-title');

    if (!qrCanvas || !siteNameElement || !pageTitleElement) return;

    try {
        // 直接使用 QRious 生成二维码
        new QRious({
            element: qrCanvas,
            value: window.location.href,
            size: 150,
            background: 'white',
            foreground: 'black',
            level: 'H'
        });

        // 更新网站信息
        siteNameElement.textContent = window.location.hostname;
        pageTitleElement.textContent = document.title;
    } catch (error) {
        console.error('生成二维码失败:', error);
    }
}

// 初始化
createQRBadge();
