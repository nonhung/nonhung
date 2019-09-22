package com.example.mongodb_nonhung.dao;

import com.example.mongodb_nonhung.dao.dto.UserInfoDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ShiroTestDao {

    @Select("SELECT * FROM sys_user WHERE username=#{username}")
   UserInfoDto queryUser(String username);

    @Select("SELECT m.perms FROM sys_user_role ur LEFT JOIN sys_role_menu rm ON ur.role_id=rm.role_id LEFT JOIN sys_menu m ON rm.menu_id=m.menu_id WHERE ur.user_id=#{userId}")
    List<String> queryReos(Long userId);
}
