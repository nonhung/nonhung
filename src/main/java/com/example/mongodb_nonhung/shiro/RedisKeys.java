package com.example.mongodb_nonhung.shiro;

/**
 * @author nonhung
 * @version V1.0.0
 * @date 2018/5/26 15: 14
 * @description redis keys 工具类
 */
public class RedisKeys {

    public static String getSysConfigKey(String key){
        return "sys:config:" + key;
    }

    public static String getShiroSessionKey(String key){
        return "sessionid:" + key;
    }
}
