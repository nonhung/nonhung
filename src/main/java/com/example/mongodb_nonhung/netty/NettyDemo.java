package com.example.mongodb_nonhung.netty;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public class NettyDemo {

    private static final Logger log = LoggerFactory.getLogger(NettyDemo.class);
    //boss事件轮询线程组
    private EventLoopGroup boss = new NioEventLoopGroup();
    //worker事件轮询线程组
    private EventLoopGroup worker = new NioEventLoopGroup();

    private Channel channel;

    @Autowired
    ChannelHandleDemo serverChannelInitializer;

    @Value("${n.port}")
    private Integer port;

    public ChannelFuture start() {
        //启动类
        ServerBootstrap serverBootstrap = new ServerBootstrap();
        serverBootstrap.group(boss, worker)//设置参数，组配置
                .option(ChannelOption.SO_BACKLOG, 128)//socket参数，当服务器请求处理程全满时，用于临时存放已完成三次握手的请求的队列的最大长度。如果未设置或所设置的值小于1，Java将使用默认值50。
                .channel(NioServerSocketChannel.class)///构造channel通道工厂//bossGroup的通道，只是负责连接
                .childHandler(serverChannelInitializer);//设置通道处理者ChannelHandler////workerGroup的处理器
        //Future：异步操作的结果
        ChannelFuture channelFuture = serverBootstrap.bind(port);//绑定端口
        ChannelFuture channelFuture1 = channelFuture.syncUninterruptibly();//接收连接
        channel = channelFuture1.channel();//获取通道
        if (channelFuture1 != null && channelFuture1.isSuccess()) {
            log.info("Netty server 服务启动成功，端口port = {}", port);
        } else {
            log.info("Netty server start fail");
        }

        return channelFuture1;
    }

    /**
     * 停止Netty服务
     */
    public void destroy() {
        if (channel != null) {
            channel.close();
        }
        worker.shutdownGracefully();
        boss.shutdownGracefully();
        log.info("Netty server shutdown success");
    }


}
