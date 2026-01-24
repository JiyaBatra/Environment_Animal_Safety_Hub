/**
 * Community Chat System
 *
 * Handles real-time chat functionality, friend selection, message sending,
 * and chat search features for the community chat interface.
 *
 * @author Environment & Animal Safety Hub Team
 * @version 1.0.0
 * @since 2024
 */

(function() {
    'use strict';

    /**
     * Initializes chat functionality when DOM is loaded
     */
    document.addEventListener('DOMContentLoaded', () => {
        const chatWindow = document.getElementById('chat-window');
        const chatInput = document.querySelector('.chat-input');
        const sendChatBtn = document.querySelector('.send-chat-btn');
        const friendsContainer = document.querySelector('.right-panel .panel-section');
        const currentUserAvatar = 'https://picsum.photos/seed/current/50';

        /**
         * Adds a message to the chat window
         * @param {string} text - The message text
         * @param {boolean} self - Whether the message is from the current user
         * @param {string} avatar - Avatar URL for the message sender
         */
        function addMessage(text, self = false, avatar = currentUserAvatar) {
            const noMsg = chatWindow.querySelector('.no-chat-msg');
            if (noMsg) noMsg.style.display = 'none';

            const messageEl = document.createElement('div');
            messageEl.classList.add('chat-message');
            if (self) messageEl.classList.add('self');

            messageEl.innerHTML = `
                <img src="${avatar}" alt="avatar">
                <p>${text}</p>
            `;

            chatWindow.appendChild(messageEl);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        /**
         * Initializes message sending functionality
         */
        if (sendChatBtn && chatInput) {
            sendChatBtn.addEventListener('click', () => {
                const text = chatInput.value.trim();
                if (text !== '') {
                    addMessage(text, true);
                    chatInput.value = '';
                }
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendChatBtn.click();
                }
            });
        }

        /**
         * Initializes friend selection functionality
         */
        if (friendsContainer) {
            const friendBtns = friendsContainer.querySelectorAll('.chat-now-btn');
            friendBtns.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const friendItem = btn.closest('.friend-item');
                    const friendName = friendItem.querySelector('span').textContent;
                    const friendAvatar = friendItem.querySelector('img').src;

                    chatWindow.innerHTML = '';
                    addMessage(`You started a chat with ${friendName}`, false, friendAvatar);
                });
            });
        }

        /**
         * Initializes chat search functionality
         */
        const chatSearch = document.querySelector('.chat-search');
        if (chatSearch) {
            chatSearch.addEventListener('input', () => {
                const query = chatSearch.value.toLowerCase();
                const friends = friendsContainer.querySelectorAll('.friend-item');
                friends.forEach(f => {
                    const name = f.querySelector('span').textContent.toLowerCase();
                    f.style.display = name.includes(query) ? 'flex' : 'none';
                });
            });
        }
    });

})();