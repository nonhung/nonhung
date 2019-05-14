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
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int []arr = new int[n];
        for (int i = 0;i<n;i++){
            arr[i] = scanner.nextInt();
        }
        int m = scanner.nextInt();
        System.out.println(find(arr,m));
    }

}
