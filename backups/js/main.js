// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 处理反馈表单提交
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const feedback = document.getElementById('feedback').value;
            
            // 这里可以添加表单数据处理逻辑
            // 目前仅显示提交成功消息
            alert('感谢您的反馈！我们会认真考虑您的建议。');
            
            // 清空表单
            this.reset();
        });
    }
    
    // 添加平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 添加导航栏滚动效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.nav-bar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // 向下滚动
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // 音频播放器控制
    const players = document.querySelectorAll('.custom-player');
    
    players.forEach(player => {
        const playBtn = player.querySelector('.play-btn');
        const playIcon = player.querySelector('.play-icon');
        const pauseIcon = player.querySelector('.pause-icon');
        const progressBar = player.querySelector('.progress-bar');
        const progress = player.querySelector('.progress');
        const currentTime = player.querySelector('.current-time');
        const duration = player.querySelector('.duration');
        const audioId = playBtn.getAttribute('data-audio');
        const audio = document.getElementById(audioId);

        // 更新时间显示
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // 更新进度条
        function updateProgress() {
            const percent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${percent}%`;
            currentTime.textContent = formatTime(audio.currentTime);
        }

        // 音频加载完成后显示总时长
        audio.addEventListener('loadedmetadata', () => {
            duration.textContent = formatTime(audio.duration);
        });

        // 播放/暂停控制
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                // 暂停其他所有音频
                document.querySelectorAll('audio').forEach(a => {
                    if (a !== audio) {
                        a.pause();
                        const otherPlayer = a.closest('.player-controls').querySelector('.custom-player');
                        const otherPlayIcon = otherPlayer.querySelector('.play-icon');
                        const otherPauseIcon = otherPlayer.querySelector('.pause-icon');
                        otherPlayIcon.style.display = 'block';
                        otherPauseIcon.style.display = 'none';
                    }
                });

                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });

        // 进度条点击控制
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
        });

        // 更新进度
        audio.addEventListener('timeupdate', updateProgress);

        // 音频结束时重置
        audio.addEventListener('ended', () => {
            audio.currentTime = 0;
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        });
    });
}); 