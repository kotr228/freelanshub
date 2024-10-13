pip install mysql-connector-python
import mysql.connector
from getpass import getpass

def connect_to_db():
    return mysql.connector.connect(
        host="your_host",  # Замініть на ваші дані
        user="your_username",
        password="your_password",
        database="freelans"
    )

def insert_freelancer(name, email, phone, password, telegram, specialty, bank_card):
    try:
        conn = connect_to_db()
        cursor = conn.cursor()
        query = """
        INSERT INTO freelanser_akks (name, email, password, telegram, phone, spacialty, bank_card)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        data = (name, email, password, telegram, phone, specialty, bank_card)
        cursor.execute(query, data)
        conn.commit()
        print("Freelancer added successfully!")
    except mysql.connector.Error as e:
        print("Error:", e)
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    name = input("Enter name: ")
    email = input("Enter email: ")
    phone = input("Enter phone number: ")
    password = getpass("Enter password: ")  # Використання getpass для приховування вводу пароля
    telegram = input("Enter Telegram nickname: ")
    specialty = input("Enter specialty: ")
    bank_card = input("Enter bank card number: ")

    insert_freelancer(name, email, phone, password, telegram, specialty, bank_card)
