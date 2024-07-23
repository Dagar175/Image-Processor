document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const statusButton = document.getElementById('check-status');
    const downloadButton = document.getElementById('download-sheet');
    
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        const response = await fetch('/api/sheet/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if(result.requestId == "Nan"){

            alert(`Incorrect CSV`);
        }else{
            alert(`Upload complete. Your request ID is: ${result.requestId}`);
        }
        
    });

    statusButton.addEventListener('click', async () => {
        const requestId = document.getElementById('request-id').value;
        const response = await fetch(`/api/sheet/status/${requestId}`);
        const result = await response.json();
        if (result) {
            document.getElementById('status-result').innerText = JSON.stringify(result.status);}
        else{
            document.getElementById('status-result').innerText = JSON.stringify("No File Found!!");
        }
    });

    downloadButton.addEventListener('click', async () => {
        const sheetId = document.getElementById('sheet-id').value;
        const response = await fetch(`/api/sheet/download/${sheetId}`);
        
        if (response.status === 200) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `output-${sheetId}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            const result = await response.json();
            alert(result.error);
        }
    });
});
