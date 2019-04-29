package com.example.mongodb_nonhung.jintaidaili;

import lombok.Data;

@Data
public class People implements Car {

    private int cash;
    private String vip;
    private String username;

    @Override
    public void byCar() {
        System.out.print(username+"是vip 客户，可以直接购买新车！");
    }
}
