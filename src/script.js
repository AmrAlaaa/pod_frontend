document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("podcastForm");
    const numberOfSpeakers = document.getElementById("numberOfSpeakers");
    const secondSpeakerOptions = document.getElementById("secondSpeakerOptions");
    const submitButton = document.getElementById("submitButton");

    const topic = document.getElementById("topic");
    const hostGender = document.getElementById("hostGender");
    const secondSpeakerGender = document.getElementById("secondSpeakerGender");
    const secondSpeakerRole = document.getElementById("secondSpeakerRole");

    const scriptOutput = document.getElementById("scriptOutput");
    const audioOutput = document.getElementById("audioOutput");
    const outputDiv = document.getElementById("output");

    // Show/Hide second speaker options based on number of speakers
    numberOfSpeakers.addEventListener("change", () => {
        if (numberOfSpeakers.value === "2") {
            secondSpeakerOptions.style.display = "block";
        } else {
            secondSpeakerOptions.style.display = "none";
            resetSecondSpeakerFields();
        }
    });

    // Enable or disable the submit button based on required field validation
    form.addEventListener("input", () => {
        validateForm();
    });

    // Form submit handler
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        let requestBody = {};

        requestBody.topic = formData.get("topic");
        requestBody.number_of_speakers = parseInt(formData.get("numberOfSpeakers"));
        requestBody.host_gender = formData.get("hostGender");

        const hostTraits = formData.get("hostTraits");
        if (hostTraits) {
            requestBody.host_traits = hostTraits;
        }

        if (requestBody.number_of_speakers === 2) {
            requestBody.second_speaker_gender = formData.get("secondSpeakerGender");
            requestBody.second_speaker_role = formData.get("secondSpeakerRole");

            const secondSpeakerTraits = formData.get("secondSpeakerTraits");
            if (secondSpeakerTraits) {
                requestBody.second_speaker_traits = secondSpeakerTraits;
            }
        }

        // Sending POST request to the backend
        try {
            const response = await fetch('http://127.0.0.1:8000/generate-podcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const result = await response.json();

            // Display the script and audio file
            scriptOutput.innerText = result.script;
            audioOutput.src = result.audio_file;
            outputDiv.style.display = "block";
        } catch (error) {
            console.error('Error fetching podcast script:', error);
            alert("Failed to get the podcast. Please try again later.");
        }
    });

    // Reset second speaker fields
    function resetSecondSpeakerFields() {
        secondSpeakerGender.value = "";
        secondSpeakerRole.value = "";
        document.getElementById("secondSpeakerTraits").value = "";
    }

    // Validate the form to enable/disable submit button
    function validateForm() {
        if (topic.value && hostGender.value && numberOfSpeakers.value) {
            if (numberOfSpeakers.value === "2") {
                if (secondSpeakerGender.value && secondSpeakerRole.value) {
                    submitButton.disabled = false;
                    return;
                }
                submitButton.disabled = true;
            } else {
                submitButton.disabled = false;
            }
        } else {
            submitButton.disabled = true;
        }
    }
});
