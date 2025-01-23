document.addEventListener("DOMContentLoaded", function() {
    // 获取当前标签页信息
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        
        // 获取页面信息
        chrome.tabs.sendMessage(activeTab.id, { action: "getPageInfo" }, function(response) {
            if (response) {
                try {
                    // 生成二维码
                    const qr = new QRious({
                        element: document.getElementById('qrCode'),
                        value: response.url,
                        size: 150,
                        background: 'white',
                        foreground: 'black',
                        level: 'H',
                        padding: 10
                    });

                    // 更新网站信息
                    const siteName = document.getElementById('siteName');
                    const pageTitle = document.getElementById('pageTitle');
                    
                    const url = new URL(response.url);
                    siteName.textContent = url.hostname;
                    pageTitle.textContent = response.title.length > 20 ? 
                        response.title.substring(0, 20) + '...' : 
                        response.title;

                } catch (error) {
                    console.error('Error generating QR code:', error);
                }
            }
        });
    });
});
