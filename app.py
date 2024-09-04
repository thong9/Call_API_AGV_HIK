from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

last_received_data = None

@app.route('/')
def index():
    return render_template('index.html')

#@app.route('/data/agv', methods=['POST'])
@app.route('/data/agv', methods=['POST'])
def receive_data():
    global last_received_data
    last_received_data = request.json
    print(f"Received data: {last_received_data}")
    
    # Gửi dữ liệu đến tất cả các client đang kết nối qua WebSocket
    socketio.emit('update_data', last_received_data)
    
    
    return jsonify({'code': '0','message': 'successful','reqCode': '', 'data': last_received_data}), 200

@socketio.on('connect')
def handle_connect():
    print('Client connected')
    if last_received_data:
        emit('update_data', last_received_data)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='192.168.3.28', port=8080)
