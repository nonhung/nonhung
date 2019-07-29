package com.example.mongodb_nonhung.dao;

import com.example.mongodb_nonhung.dao.dto.UserInfoDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ShiroTestDao {

    @Select("SELECT * FROM sys_user WHERE username=#{username}")
   UserInfoDto queryUser(String username);
}
