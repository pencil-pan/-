// This file will handle background tasks for the extension
chrome.runtime.onInstalled.addListener(() => {
    console.log("网页二维码生成器已安装");
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        console.log("页面加载完成");
    }
});

// 引入 QRious
importScripts('qrious.min.js');

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'generateQR') {
        // 创建离屏 canvas
        const canvas = new OffscreenCanvas(150, 150);
        
        // 生成二维码
        const qr = new QRious({
            element: canvas,
            value: request.url,
            size: 150,
            background: 'white',
            foreground: 'black',
            level: 'H'
        });

        // 将 canvas 转换为 base64 图片数据
        canvas.convertToBlob().then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
                sendResponse({ qrData: reader.result });
            };
            reader.readAsDataURL(blob);
        });

        return true; // 保持消息通道开放
    }
});
