import java.time.LocalDateTime;

class Transaction {

    String type;
    String accNo;
    int amount;
    String receiver;
    LocalDateTime time;

    Transaction(String type,String accNo,int amount,String receiver){

        this.type = type;
        this.accNo = accNo;
        this.amount = amount;
        this.receiver = receiver;
        this.time = LocalDateTime.now();
    }

    void display(){

        System.out.println(type +
                " | Acc:" + accNo +
                " | Amount:" + amount +
                " | To:" + receiver +
                " | Time:" + time);
    }
}