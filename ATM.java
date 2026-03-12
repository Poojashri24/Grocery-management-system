class ATM{

    private int atmbalance;

    boolean deposit(int amt){

        if(amt>0){
            atmbalance+=amt;
            return true;
        }

        return false;
    }

    boolean withdraw(int amt){

        if(amt>0 && amt<=atmbalance){
            atmbalance-=amt;
            return true;
        }

        return false;
    }

    int getBalance(){
        return atmbalance;
    }
}