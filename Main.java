import java.util.*;

class Main{

    public static void main(String args[]){

        Scanner sc=new Scanner(System.in);

        ATM atm=new ATM();

        Admin admin=new Admin(atm);

        HashMap<String,String> adminMap=new HashMap<>();
        adminMap.put("admin","1234");

        HashMap<String,User> userMap=new HashMap<>();

        ArrayList<Transaction> transactions=new ArrayList<>();

        boolean run=true;

        System.out.println("----Welcome----");

        while(run){
            System.out.println("\n1.Admin Login");
            System.out.println("2.User Login");
            System.out.println("3.Exit");

            int choice=sc.nextInt();

            switch(choice){

                case 1:

                    System.out.print("Username: ");
                    String u=sc.next();

                    System.out.print("Password: ");
                    String p=sc.next();

                    if(adminMap.containsKey(u)
                       && adminMap.get(u).equals(p)){

                        boolean adminMenu=true;

                        while(adminMenu){

                            System.out.println("\nADMIN MENU");
                            System.out.println("1.Load ATM Cash");
                            System.out.println("2.Check ATM Balance");
                            System.out.println("3.Create User");
                            System.out.println("4.Today Transaction Count");
                            System.out.println("5.Exit");

                            int op=sc.nextInt();

                            switch(op){

                                case 1:

                                    System.out.println("Enter amount");
                                    int amt=sc.nextInt();
                                    admin.depositCashToAtm(amt);
                                    break;

                                case 2:

                                    admin.checkBalance();
                                    break;

                                case 3:

                                    System.out.println("Account No");
                                    String acc=sc.next();

                                    System.out.println("Name");
                                    String name=sc.next();

                                    System.out.println("Pin");
                                    int pin=sc.nextInt();

                                    System.out.println("Initial Balance");
                                    int bal=sc.nextInt();

                                    admin.createUser(
                                            userMap,
                                            acc,
                                            name,
                                            pin,
                                            bal);

                                    break;

                                case 4:

                                    admin.viewTodayCount(transactions);
                                    break;

                                case 5:

                                    adminMenu=false;
                            }
                        }
                    }
                    else{
                        System.out.println("Invalid login");
                    }

                    break;

                case 2:

                    System.out.println("Enter account no");
                    String acc=sc.next();

                    if(!userMap.containsKey(acc)){
                        System.out.println("Account not found");
                        break;
                    }

                    User user=userMap.get(acc);

                    System.out.println("Enter pin");
                    int pin=sc.nextInt();

                    if(!user.verifyPin(pin)){
                        System.out.println("Wrong pin");
                        break;
                    }

                    boolean userMenu=true;

                    while(userMenu){

                        System.out.println("\nUSER MENU");
                        System.out.println("1.Deposit");
                        System.out.println("2.Withdraw");
                        System.out.println("3.Check Balance");
                        System.out.println("4.Change Pin");
                        System.out.println("5.Mini Statement");
                        System.out.println("6.Transfer");
                        System.out.println("7.Exit");

                        int op=sc.nextInt();

                        switch(op){

                            case 1:

                                int d=sc.nextInt();
                                user.deposit(d,transactions);
                                break;

                            case 2:

                                int w=sc.nextInt();
                                user.withdraw(w,transactions);
                                break;

                            case 3:

                                user.checkBalance();
                                break;

                            case 4:

                                int np=sc.nextInt();
                                user.changePin(np);
                                break;

                            case 5:

                                user.miniStatement(transactions);
                                break;

                            case 6:

                                System.out.println("Receiver account");
                                String r=sc.next();

                                if(!userMap.containsKey(r)){
                                    System.out.println("Account not found");
                                    break;
                                }

                                int ta=sc.nextInt();

                                user.transfer(
                                        userMap.get(r),
                                        ta,
                                        transactions);

                                break;

                            case 7:

                                userMenu=false;
                        }
                    }

                    break;

                case 3:

                    run=false;
                    System.out.println("Thank youu..!!");
            }
        }
    }
}