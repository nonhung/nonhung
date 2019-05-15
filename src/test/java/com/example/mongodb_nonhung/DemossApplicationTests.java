package com.example.mongodb_nonhung;

import com.example.mongodb_nonhung.jintaidaili.Car;
import com.example.mongodb_nonhung.jintaidaili.People;
import com.example.mongodb_nonhung.jintaidaili.ProxyCLass;
import com.example.mongodb_nonhung.mongodb.MongodbTest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemossApplicationTests {

    @Resource
    MongodbTest mongodbTest;

    @Test
    public void contextLoads() {
        //mongodbTest.add();
    }


    @Test
    public void query() {
        mongodbTest.query();
    }

    @Test
    public void test(){
        People people_3 =new People();
        people_3.setCash(0);
        people_3.setUsername("tom");
        people_3.setVip("vi");
        Car car =new ProxyCLass();
        ((ProxyCLass) car).setPeople(people_3);
        car.byCar();
    }

}
