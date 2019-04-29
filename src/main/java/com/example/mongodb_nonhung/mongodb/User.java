package com.example.mongodb_nonhung.mongodb;

import jdk.nashorn.internal.ir.annotations.Immutable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.lang.ref.PhantomReference;
import java.lang.ref.ReferenceQueue;
import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;
import java.util.*;
import java.util.concurrent.ThreadPoolExecutor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "student")
public class User implements Serializable {
    private static final long serialVersionUID = 5301728766931012681L;

    @Id
    private String id;

    private String userName;

    private String passWord;

    public static void main(String[] args) {
        User user = new User();
        SoftReference softReference= new SoftReference(user);
        user=null;
        softReference.get();
        System.out.println(softReference.get());
        WeakReference weakReference = new WeakReference(user);
        weakReference.get();
        ReferenceQueue referenceQueue = new ReferenceQueue();
        PhantomReference phantomReference = new PhantomReference(user,referenceQueue);
        phantomReference.get();
        List list = new ArrayList();
        list.clear();
        String jack = "jack";

        WeakHashMap weakHashMap = new WeakHashMap();
        System.out.println(weakReference.get());

        System.runFinalization();

        m(9);
    }

        /**
         * 打印出九九乘法表
         * @param i
         */
        public static void m(int i) {
            if (i == 1) {
                System.out.println("1*1=1 ");
            } else {
                m(i - 1);
                for (int j = 1; j <= i; j++) {
                    System.out.print(j + "*" + i + "=" + j * i + " ");
                }
                System.out.println();
            }
        }


}
