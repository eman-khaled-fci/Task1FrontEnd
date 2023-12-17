let csvData;

function readCSV() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        fetch('http://localhost:4000/api/csv/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                console.log(data);
                getCsvData();
            })
            .catch(error => {
                console.error('Error uploading CSV file:', error);
            });
    }
}


function getCsvData() {
    fetch('http://localhost:4000/api/csv/get-csv-data')
        .then(response => response.json())
        .then(data => {
            csvData = data;
            displayGrid(csvData);
        })
        .catch(error => {
            console.error('Error getting CSV data:', error);
        });
}


function displayGrid(data) {
    const gridContainer = document.getElementById('gridContainer');
    gridContainer.innerHTML = '';
    const table = document.createElement('table');
    table.border = '1';
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    data.forEach(rowData => {
        const row = document.createElement('tr');
        Object.values(rowData).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });
    gridContainer.appendChild(table);
}


function downloadXLSX() {
    fetch('http://localhost:4000/api/csv/convert-to-excel')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.xlsx';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            console.log('Downloading XLSX...');
        })
        .catch(error => {
            console.error('Error converting to Excel:', error);
        });
}

