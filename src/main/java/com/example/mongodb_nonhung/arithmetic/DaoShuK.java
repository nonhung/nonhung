package com.example.mongodb_nonhung.arithmetic;

import java.util.Scanner;

/**
 * 功能描述: <br>
 * @description: 输入一个链表，输出该链表中倒数第k个结点。为了符合大多数人的习惯
 * @Author:ryfh
 * @Date: 2019/5/14 14:09
 */
public class DaoShuK {

    public static Integer find(int a[], int k) {
        if (k >a.length || k<=0){
            return null;
        }
        int i = 0;
        int j = k;
        while (j != a.length){
            i++;
            j++;
        }
        return a[i];
    }

    public static void main(String[] args) {
      int a[]={1,2,4,5,6,7,8,9};
        System.out.println(find(a,4));
    }

}
