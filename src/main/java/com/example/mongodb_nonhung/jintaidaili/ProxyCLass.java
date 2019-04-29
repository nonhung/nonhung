package com.example.mongodb_nonhung.jintaidaili;

import lombok.Data;


@Data
public class ProxyCLass implements Car{

    private People people;

    @Override
    public void byCar() {
        try {

        }catch (Exception E) {

        }finally {

        }
        if (people.getVip() == "vip"){
            people.byCar();
            return ;
        }
        if(people.getCash()>=50000){
            System.out.println(people.getUsername()+"买了新车，交易结束！");
        }
        else
        {
            System.out.println(people.getUsername()+"钱不够，不能买车，继续比赛！");
        }
    }

}
