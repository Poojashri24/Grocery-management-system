import java.util.*;
import java.time.*;

class Admin{

    private ATM atm;

    Admin(ATM atm){
        this.atm=atm;
    }

    void depositCashToAtm(int amt){

        if(amt%100==0){

            if(atm.deposit(amt)){
                System.out.println("Cash loaded to ATM");
            }
            else{
                System.out.println("Invalid amount");
            }

        }
        else{
            System.out.println("Enter multiples of 100");
        }
    }

    void checkBalance(){
        System.out.println("ATM Balance : "+atm.getBalance());
    }

    void createUser(HashMap<String,User> userMap,
                    String acc,
                    String name,
                    int pin,
                    int balance){

        if(userMap.containsKey(acc)){
            System.out.println("Account already exists");
        }
        else{
            userMap.put(acc,new User(name,pin,balance,acc,atm));
            System.out.println("User created successfully");
        }
    }

    void viewTodayCount(ArrayList<Transaction> list){

        int count=0;

        LocalDate today = LocalDate.now();

        for(Transaction t:list){

            if(t.time.toLocalDate().equals(today)){
                count++;
            }
        }

        System.out.println("Today's Transactions : "+count);
    }
}