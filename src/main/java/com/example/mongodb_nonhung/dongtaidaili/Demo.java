package com.example.mongodb_nonhung.dongtaidaili;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Demo {
    public static void main(String[] args) throws ClassNotFoundException {
        // 保存生成的代理类的字节码文件
        System.getProperties().put("sun.misc.ProxyGenerator.saveGeneratedFiles", "true");
        int i,h;

        // jdk动态代理测试
        File file = null;
        try (FileChannel fileChannel = new FileInputStream(file).getChannel()) {

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        Subject subject = new JDKDynamicProxy(new RealSubject()).getProxy();
        subject.doSomething();
        Map map = new HashMap();
        ConcurrentHashMap concurrentHashMap =new ConcurrentHashMap(16,1,2);
        concurrentHashMap.put(1,1);
        map.put(1,1);
        boolean b;
        List list = new ArrayList();
        System.out.println( 1 << 30);
        Class<?> aClass = Class.forName("com.example.mongodb_nonhung.dongtaidaili.Demo");
    }
    public void saa(boolean i){
        System.out.println(i);
    }
}
