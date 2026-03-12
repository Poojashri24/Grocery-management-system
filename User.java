import java.util.*;

class User{

    private String name;
    private int pin;
    private int balance;
    private String accNo;

    private ATM atm;

    User(String name,int pin,int balance,String accNo,ATM atm){

        this.name=name;
        this.pin=pin;
        this.balance=balance;
        this.accNo=accNo;
        this.atm=atm;
    }

    boolean verifyPin(int p){
        return pin==p;
    }

    void deposit(int amt,ArrayList<Transaction> list){

        if(amt%100==0){

            if(atm.deposit(amt)){

                balance+=amt;

                list.add(new Transaction(
                        "Deposit",accNo,amt,"-"));

                System.out.println("Deposited successfully");
            }
        }
        else{
            System.out.println("Enter amount as multiples of 100");
        }
    }

    void withdraw(int amt,ArrayList<Transaction> list){
        if(amt%100==0){

        if(balance>=amt){

            if(atm.withdraw(amt)){

                balance-=amt;

                list.add(new Transaction(
                        "Withdraw",accNo,amt,"-"));

                System.out.println("Withdrawn successfully");
            }
            else{
                System.out.println("ATM has no cash");
            }
        }
        else{
            System.out.println("Insufficient balance");
        }
        }
        else{
            System.out.println("Enter amount as multiples of 100");
        }
    }

    void transfer(User receiver,int amt,
                  ArrayList<Transaction> list){

        if(balance>=amt){

            balance-=amt;
            receiver.balance+=amt;

            list.add(new Transaction(
                    "Transfer",accNo,amt,receiver.accNo));

            System.out.println("Transfer successful");
        }
        else{
            System.out.println("Insufficient balance");
        }
    }

    void miniStatement(ArrayList<Transaction> list){

        for(Transaction t:list){

            if(t.accNo.equals(accNo)){
                t.display();
            }
        }
    }

    void checkBalance(){
        System.out.println("Balance : "+balance);
    }

    void changePin(int p){
        pin=p;
        System.out.println("Pin changed");
    }
}