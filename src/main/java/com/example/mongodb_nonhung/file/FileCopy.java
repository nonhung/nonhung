package com.example.mongodb_nonhung.file;

import java.io.*;
import java.nio.channels.FileChannel;

/**
 * 功能描述: <br>
 *
 * @description: 文件copy
 * @Author:ryfh
 * @Date: 2019/4/29 12:37
 */
public class FileCopy {

    public static void main(String[] args) throws IOException {

        copyFileByStream(new File("D:\\work\\ces_dev.sql"), new File("D:\\work\\车企源\\新建文本文档.txt"));
       //copyFileByChannel(new File("D:\\work\\ces_dev.sql"), new File("D:\\work\\车企源\\新建文本文档.txt"));

    }

    //利用 java.io 类库，直接为源文件构建一个FileInputStream读取然后再构建一个
    public static void copyFileByStream(File source, File dest) throws IOException {
        try (InputStream is = new FileInputStream(source);
             OutputStream os = new FileOutputStream(dest)) {
            byte[] buffer = new byte[1024];
            int length;
            while ((length = is.read(buffer)) > 0) {
                os.write(buffer, 0, length);
            }
        }
    }


    //利用JAVA.Nio类 tansferTo或tansferFrom
    public static void copyFileByChannel(File source, File dest) throws IOException {
        try (FileChannel sourceChannel = new FileInputStream(source)
                .getChannel();
             FileChannel targetChannel = new FileOutputStream(dest).getChannel
                     ()) {
            for (long count = sourceChannel.size(); count > 0; ) {
                long transferred = sourceChannel.transferTo(sourceChannel.position(), count, targetChannel);
                sourceChannel.position(sourceChannel.position() + transferred);
                count -= transferred;
            }
        }
    }
}
