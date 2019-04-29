package com.example.mongodb_nonhung.mongodb;

import com.sun.scenario.effect.impl.sw.sse.SSEBlend_SRC_OUTPeer;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Objects;

@Data
@Document("student")
public class Student implements Serializable {

    /**
     * name : 梅西
     * age : 31
     * address : 石柱
     * country : 中国
     * proFession : 足球
     */

    private String name;
    private int age;
    private String address;
    private String country;
    private String proFession;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProFession() {
        return proFession;
    }

    public void setProFession(String proFession) {
        this.proFession = proFession;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return age == student.age &&
                Objects.equals(name, student.name) &&
                Objects.equals(address, student.address) &&
                Objects.equals(country, student.country) &&
                Objects.equals(proFession, student.proFession);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age, address, country, proFession);
    }

    public static void main(String[] args) {
        Integer i1=1;
        Integer i2=1;
        System.out.println(i1==i2);
        System.out.println(i1.equals(i2));
    }


}
