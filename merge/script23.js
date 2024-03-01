
    document.addEventListener('DOMContentLoaded', () => {
        let mediaRecorder;
        let audioChunks = [];
        let isRecording = false;

        const toggleRecordingButton = document.getElementById('toggleRecording');

        toggleRecordingButton.addEventListener('click', toggleRecording);

        async function toggleRecording() {
            if (!isRecording) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                mediaRecorder = new MediaRecorder(stream);
                audioChunks = []; // Clear the array before starting a new recording

                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // You can change 'audio/wav' to 'audio/mp3' if needed
                    // Perform operations with the recorded audio, if desired

                    // Clear recorded audio and enable button for the next recording
                    audioChunks = [];
                    isRecording = false;
                    toggleRecordingButton.textContent = '🎙️';
                };

                mediaRecorder.start();
                isRecording = true;
                toggleRecordingButton.textContent = '🔴';
            } else {
                mediaRecorder.stop();
            }
        }
    });
    async function sendAudioToEndpoint(audioBlob) {
            // Adjust the URL to your FastAPI endpoint
            const apiUrl = 'https://your-fastapi-endpoint.com/upload-audio';

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: audioBlob,
                    headers: {
                        'Content-Type': 'audio/wav', // Set the appropriate content type
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const responseData = await response.json();
                console.log('Response from FastAPI:', responseData);
            } catch (error) {
                console.error('Error sending audio to FastAPI:', error);
            }
        }
    });







