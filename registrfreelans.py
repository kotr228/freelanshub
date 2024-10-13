from flask import Flask, request, redirect, url_for
import mysql.connector

app = Flask(__name__)

def connect_to_db():
    return mysql.connector.connect(
        host="localhost",  # Змініть на ваші параметри доступу
        user="root",
        password="Sillver-228",
        database="freelans"
    )

@app.route('/register', methods=['POST'])
def register():
    name = request.form['name']
    email = request.form['email']
    phone = request.form['phone']
    password = request.form['password']  # В реальних умовах пароль має бути захешований
    telegram = request.form['telegram']
    specialty = request.form['specialty']
    bank_card = request.form['bank_card']

    db = connect_to_db()
    cursor = db.cursor()
    query = """
    INSERT INTO freelanser_akks (name, email, password, telegram, phone, spacialty, bank_card)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (name, email, password, telegram, phone, specialty, bank_card))
    db.commit()
    cursor.close()
    db.close()
    
    return redirect(url_for('form_submitted'))

@app.route('/form_submitted')
def form_submitted():
    return "Форму успішно надіслано!"

if __name__ == '__main__':
    app.run(debug=True)
