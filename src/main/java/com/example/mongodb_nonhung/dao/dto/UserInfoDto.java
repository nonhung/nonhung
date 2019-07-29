package com.example.mongodb_nonhung.dao.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
@Data
public class UserInfoDto implements Serializable {

    private Long userId;
    private String username;
    private String name;
    private String password;
    private String salt;
    private String email;
    private String mobile;
    private Integer status;
    private List<Long> roleIdList;
    private String roleNames;
    @JsonFormat(
            pattern = "yyyy-MM-dd HH:mm:ss"
    )
    private Date createTime;
    private Long deptId;
    private String deptName;
    private String confirmPassword;
    private String oldPassword;
    private String merchantNo;
    private String merchantUserNo;
    private String newpassword;
}
