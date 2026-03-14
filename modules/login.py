import pymysql 

def login_as_administrator(passwd):
    # root_password = input("\n:: Enter Password for Administrator >>> ")
        
    try:
        conn_object = pymysql.Connection(
            host = 'localhost',
            username = 'root',
            password = passwd,
            database = employees
        )

        if conn_object.open:

            print("\nLogin Successful!\nWelcome Administrator\n")

    except pymysql.err as error:
        print(f"Error :: {error}")
        print("\n --- Login Failed ! --- ")


def main():
    print("==================================")
    print("    Employee Management System    ")
    print("==================================")
    print("\n[1]    Login as Administrator")
    print("[2]    Login as Employee")
    print("[3]    Exit")
    choice = input("\n:: Select an option >>> ")
    
    if choice == '1':
        login_as_administrator()

    elif choice == '2':
        print("\n--- Logged in as Employee ---\n")

    elif choice == '3':
        print("\n--- Thank you ---\n")