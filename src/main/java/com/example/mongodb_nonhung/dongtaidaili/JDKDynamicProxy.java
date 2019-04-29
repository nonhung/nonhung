package com.example.mongodb_nonhung.dongtaidaili;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

public class JDKDynamicProxy implements InvocationHandler {

    private Object target;

    public JDKDynamicProxy(Object target) {
        this.target = target;
    }

    /**
     * 获取被代理接口实例对象
     * @param <T>
     * @return
     */
    public <T> T getProxy() {
        return (T) Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Class<JDKDynamicProxy> jdkDynamicProxyClass = JDKDynamicProxy.class;
        Method[] methods = jdkDynamicProxyClass.getMethods();
        System.out.println(method);
        ClassLoader classLoader = jdkDynamicProxyClass.getClassLoader();
        Class<?>[] interfaces = jdkDynamicProxyClass.getInterfaces();
        System.out.println("Do something before");
        Object result = method.invoke(target, args);
        System.out.println("Do something after");
        return result;
    }
}
