document.addEventListener('DOMContentLoaded', (event) => {

    // Lấy dữ liệu từ localStorage và gán vào các ô nhập liệu
    document.getElementById('jsonInput').value = localStorage.getItem('jsonInput') || '';
    document.getElementById('jsonInput2').value = localStorage.getItem('jsonInput2') || '';
    document.getElementById('jsonInput3').value = localStorage.getItem('jsonInput3') || '';

    var socket = io.connect('http://' + document.domain + ':' + location.port);

    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('update_data', function(data) {
        console.log('Received data:', data);

         // Lấy giá trị của phần tử "method"
         const methodValue = data.method;
         document.getElementById('method').innerText = methodValue;

        // Lấy phần tử HTML để hiển thị kết quả
        var responseDiv = document.getElementById('response');
        
        // Xóa nội dung hiện có
        responseDiv.innerHTML = '';

        // Duyệt qua các key-value trong đối tượng JSON
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                // Tạo phần tử HTML mới cho từng key-value
                var p = document.createElement('p');
                p.innerText = key + ': ' + data[key];
                responseDiv.appendChild(p);
            }
        }

    });

// Xử lý khi người dùng nhấn nút "Send JSON"
document.getElementById('sendJsonButton').addEventListener('click', function() {
    console.log('Button clicked, executing function'); // Kiểm tra sự kiện click
    const positionCode1 = document.getElementById('jsonInput').value;
    const positionCode2 = document.getElementById('jsonInput2').value;
    const taskTyp = document.getElementById('jsonInput3').value;
    // Lưu dữ liệu vào localStorage, chỉ lưu lần nhập gần nhất
    localStorage.setItem('jsonInput', positionCode1);
    localStorage.setItem('jsonInput2', positionCode2);
    localStorage.setItem('jsonInput3', taskTyp);

    const N = 99999;
    const randomNumber = parseInt(Math.random() * N, 10);
    //console.log(randomNumber);
        const jsonString = {
            "reqCode": randomNumber.toString(),
            "reqTime": "2020-05-03 03:22:33",
            "taskTyp": taskTyp,
            "wbCode": "",
            "positionCodePath": [
                {
                    "positionCode": positionCode1, 
                    "type": "00" 
                },
                {
                    "positionCode": positionCode2, 
                    "type": "00" 
                }
            ],
            "podCode": "",
            "podDir": "",
            "podTyp": "",
            "agvCode": "",
            "taskCode": ""
        };
    // Kiểm tra xem chuỗi JSON có hợp lệ hay không
    try {
       // const jsonData = JSON.parse(jsonString);
         document.getElementById('responseContainer').innerText = JSON.stringify(jsonString);
        // Gửi yêu cầu POST đến server khác
        fetch('http://192.168.3.28:8182/rcms/services/rest/hikRpcService/genAgvSchedulingTask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonString)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from other server:', data);
            
           
            // Hiển thị phản hồi trong phần tử HTML
            document.getElementById('responseContainer').innerText = JSON.stringify(data, null, 2);
            alert('JSON sent successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send JSON');
            
            // Hiển thị lỗi trong phần tử HTML
            document.getElementById('responseContainer').innerText = 'Error: ' + error.message;
        });
    } catch (e) {
        alert('Invalid JSON format');
        
        // Hiển thị lỗi nếu JSON không hợp lệ
        document.getElementById('responseContainer').innerText = 'Invalid JSON format';
      //  console.log('Invalid JSON format');
    }
}); 

});
