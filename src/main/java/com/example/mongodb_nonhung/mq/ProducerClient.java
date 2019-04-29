package com.example.mongodb_nonhung.mq;

import com.aliyun.openservices.ons.api.*;
import com.aliyun.openservices.ons.api.order.OrderProducer;

import java.util.Date;
import java.util.Properties;

public class ProducerClient {
    public static void main(String[] args) {
        Properties properties = new Properties();
        // 您在控制台创建的 Group ID
        properties.put(PropertyKeyConst.GROUP_ID, "GID_SONGCW_CES_TY_WARNING_PROD");
        // AccessKey 阿里云身份验证，在阿里云服务器管理控制台创建
        properties.put(PropertyKeyConst.AccessKey, "LTAISEydnUc8GAyC");
        // SecretKey 阿里云身份验证，在阿里云服务器管理控制台创建
        properties.put(PropertyKeyConst.SecretKey, "xhFvuGfEHOOOmAO0VlSl7rg5xI7e9b");
        // 设置 TCP 接入域名，进入控制台的实例管理页面的“获取接入点信息”区域查看
        properties.put(PropertyKeyConst.NAMESRV_ADDR,
                "http://MQ_INST_1742934930529626_BaMwaShI.mq-internet-access.mq-internet.aliyuncs.com:80");
        Producer producer = ONSFactory.createProducer(properties);
        // 在发送消息前，必须调用 start 方法来启动 Producer，只需调用一次即可。
        producer.start();
            Message msg = new Message(//
                    // Message 所属的 Topic
                    "TP_SONGCW_CES_PROD",
                    // Message Tag, 可理解为 Gmail 中的标签，对消息进行再归类，方便 Consumer 指定过滤条件在消息队列 RocketMQ 的服务器过滤
                    "TAG_CES_TY_GPS_WARN",
                    // Message Body 可以是任何二进制形式的数据， 消息队列 RocketMQ 不做任何干预，需要 Producer 与 Consumer 协商好一致的序列化和反序列化方式
                    "%5b%7b%22alarmAddress%22%3a%22%e5%9c%a8%e8%b4%b5%e5%b7%9e%e7%9c%81%e9%81%b5%e4%b9%89%e5%b8%82%e6%b9%84%e6%bd%ad%e5%8e%bf%e4%bb%99%e8%b0%b7%e5%b1%b1%e8%b7%af.%e7%a6%bb%e5%86%9c%e8%b4%b8%e8%a1%97%e9%99%84%e8%bf%91%e5%b0%8f%e5%85%b5%e5%8a%a0%e5%b7%a5%e7%bb%b4%e4%bf%ae%e7%ba%a629%e7%b1%b3%e5%8f%91%e7%94%9f%e6%96%ad%e7%94%b5%e9%a2%84%e8%ad%a6.%22%2c%22alarmLat%22%3a27.768556594848633%2c%22alarmLng%22%3a107.47196197509766%2c%22alarmTime%22%3a%222019-03-26+10%3a04%3a19%22%2c%22alarmType%22%3a2%2c%22deviceType%22%3a1%2c%22frameNo%22%3a%22LVGD*%e5%b1%8f%e8%94%bd%e7%9a%84%e5%85%b3%e9%94%ae%e5%ad%97*6A5DG465495%22%2c%22imeiNo%22%3a%22863013180982093%22%7d%5d".getBytes()
            );
           // 设置代表消息的业务关键属性，请尽可能全局唯一。
            // 以方便您在无法正常收到消息情况下，可通过控制台查询消息并补发。
            // 注意：不设置也不会影响消息正常收发
            msg.setKey("biz123456");
            /* // 分区顺序消息中区分不同分区的关键字段，sharding key 于普通消息的 key 是完全不同的概念。
            // 全局顺序消息，该字段可以设置为任意非空字符串。
            String shardingKey = String.valueOf(orderId);*/
            try {
                SendResult sendResult = producer.send(msg);
                // 发送消息，只要不抛异常就是成功
                if (sendResult != null) {
                    System.out.println(new Date() + " Send mq message success. Topic is:" + msg.getTopic() + " msgId is: " + sendResult.getMessageId());
                }
            }
            catch (Exception e) {
                // 消息发送失败，需要进行重试处理，可重新发送这条消息或持久化这条数据进行补偿处理
                System.out.println(new Date() + " Send mq message failed. Topic is:" + msg.getTopic());
                e.printStackTrace();

        }
        // 在应用退出前，销毁 Producer 对象
        // 注意：如果不销毁也没有问题
        producer.shutdown();
    }
}

