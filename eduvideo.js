document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:5000/api/videos')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const container = document.getElementById('uploaded-videos-container');

      if (!container) {
        console.error('Container with ID "uploaded-videos-container" not found.');
        return;
      }

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('No videos to display.');
        return;
      }

      // Add necessary classes for horizontal scrolling
      container.classList.add('flex', 'overflow-x-scroll', 'space-x-6', 'pb-4');

      data.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.classList.add('bg-white', 'p-4', 'min-w-[300px]', 'max-w-sm', 'rounded-lg', 'shadow-lg', 'flex-shrink-0');

        if (video.url) {
          const videoIframe = document.createElement('iframe');
          videoIframe.src = video.url;
          videoIframe.frameBorder = '0';
          videoIframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
          videoIframe.allowFullscreen = true;
          videoIframe.classList.add('w-full', 'h-48', 'rounded-lg', 'shadow-md');
          videoCard.appendChild(videoIframe);
        } else if (video.videoFile) {
          const videoElement = document.createElement('video');
          videoElement.src = video.videoFile;
          videoElement.controls = true;
          videoElement.classList.add('w-full', 'h-48', 'rounded-lg', 'shadow-md');
          videoCard.appendChild(videoElement);
        }

        const videoTitle = document.createElement('p');
        videoTitle.classList.add('text-xl', 'mt-4', 'font-medium', 'text-gray-800');
        videoTitle.textContent = video.title || 'Untitled Video';

        videoCard.appendChild(videoTitle);
        container.appendChild(videoCard);
      });
    })
    .catch(error => console.error('Error fetching videos:', error));
});
