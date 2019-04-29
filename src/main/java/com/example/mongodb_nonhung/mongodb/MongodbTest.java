package com.example.mongodb_nonhung.mongodb;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReadWriteLock;

import static java.util.List.*;

@Service
@Slf4j
public class MongodbTest {

    @Resource
    private MongoTemplate mongoTemplate;

    public void add(){
        Map map = new HashMap();
        User test = mongoTemplate.save(new User() {{
            setPassWord("123");
            setUserName("1234");
        }}, "mongodb_nonhung");
    }

    public void query(){
        List<User> list = new ArrayList<>();
        User user = new User();
        user.setUserName("meixi");
        user.setPassWord("123");
        User user1 = new User();
        user1.setUserName("suya");
        user1.setPassWord("1234");
        list.add(user);
        list.add(user1);
        Collection<User> users = mongoTemplate.insertAll(list);
        Query query = new Query(Criteria.where("name").is("梅西"));
       // query.addCriteria(Criteria.where("userName").is("1234"));
        List<Student> list1 = mongoTemplate.find(query, Student.class);
        log.info("users:::{}",users);
       /* List<AggregationOperation> operations = new ArrayList<>();
        operations.add(Aggregation.match(Criteria.where("name").is("梅西")));
        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<Student> mongodb_nonhung = mongoTemplate.aggregate(aggregation, "student", Student.class);
        List<Student> mappedResults = mongodb_nonhung.getMappedResults();*/
    }

    public static void main(String[] args) {
        //java.lang.StackOverflowError
       /* MongodbTest mongodbTest = new MongodbTest();
        mongodbTest.test();*/

    }

   /* public  void test(){
        test();
    }*/
}
