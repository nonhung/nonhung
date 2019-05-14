package com.example.mongodb_nonhung.arithmetic;

import java.util.Scanner;


/**
 * 功能描述: <br>
 * @description: 求一个正式分解质因数
 * @parm:
 * @return:
 * @Author:ryfh
 * @Date: 2019/5/14 14:10
 */
public class ZiShu {

    public static void main(String[] args) {
        System.out.print("请您输入一个数：");
        Scanner sc = new Scanner(System.in);
        int num = sc.nextInt();        //从键盘上接受一个输入的值
        System.out.print(num + "=");
        for (int i = 2; i <= num; i++) {
            if (num % i == 0 && num != i) {
                System.out.print(i + "*");
                num = num / i;
                i = 2;
            }
            if (i == num) {
                System.out.print(num);    //输出最后一个质因数
                break;
            }
        }

    }

}
