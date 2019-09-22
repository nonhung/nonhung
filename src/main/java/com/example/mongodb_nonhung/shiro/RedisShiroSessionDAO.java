package com.example.mongodb_nonhung.shiro;

import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.EnterpriseCacheSessionDAO;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.Serializable;
import java.util.concurrent.TimeUnit;

/**
 * @author nonhung
 * @version V1.0.0
 * @date 2018/5/26 15: 14
 * @description shiro session DAO
 */
@Component
public class RedisShiroSessionDAO extends EnterpriseCacheSessionDAO {

    @Resource(name = "shiroRedisTemplate")
    private RedisTemplate shiroRedisTemplate;

    @Override
    protected Serializable doCreate(Session session) {
        Serializable sessionId = super.doCreate(session);
        final String key = RedisKeys.getShiroSessionKey(sessionId.toString());
        setShiroSession(key, session);
        return sessionId;
    }

    @Override
    protected Session doReadSession(Serializable sessionId) {
        Session session = super.doReadSession(sessionId);
        if(session == null){
            final String key = RedisKeys.getShiroSessionKey(sessionId.toString());
            session = getShiroSession(key);
        }
        return session;
    }

    @Override
    protected void doUpdate(Session session) {
        super.doUpdate(session);
        final String key = RedisKeys.getShiroSessionKey(session.getId().toString());
        setShiroSession(key, session);
    }

    @Override
    protected void doDelete(Session session) {
        super.doDelete(session);
        final String key = RedisKeys.getShiroSessionKey(session.getId().toString());
        shiroRedisTemplate.delete(key);
    }

    private Session getShiroSession(String key) {
        return (Session)shiroRedisTemplate.opsForValue().get(key);
    }

    private void setShiroSession(String key, Session session){
        shiroRedisTemplate.opsForValue().set(key, session);
        //60分钟过期
        shiroRedisTemplate.expire(key, 60, TimeUnit.MINUTES);
    }

}
