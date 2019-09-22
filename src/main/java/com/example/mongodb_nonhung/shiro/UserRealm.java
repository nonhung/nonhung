package com.example.mongodb_nonhung.shiro;

import com.aliyun.openservices.shade.com.alibaba.fastjson.JSON;
import com.example.mongodb_nonhung.commons.ShiroUtils;
import com.example.mongodb_nonhung.dao.ShiroTestDao;
import com.example.mongodb_nonhung.dao.dto.UserInfoDto;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.apache.shiro.authc.credential.HashedCredentialsMatcher;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class UserRealm  extends AuthorizingRealm {
    private Logger logger = LoggerFactory.getLogger(getClass());
    @Resource
    private ShiroTestDao shiroTestDao;
    /**
     * 授权
     * */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        logger.info("授权开始");
        UserInfoDto user = (UserInfoDto) principalCollection.getPrimaryPrincipal();
        List<String> strings = shiroTestDao.queryReos(user.getUserId());
        logger.info("当前用户拥有的权限", JSON.toJSONString(strings));
        //用户权限列表
        Set<String> permsSet = new HashSet<>();
        for (String perms : strings) {
            if (StringUtils.isBlank(perms)) {
                continue;
            }
            permsSet.addAll(Arrays.asList(perms.trim().split(",")));
        }
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        info.setStringPermissions(permsSet);
        logger.info("授权结束");
        return info;
    }

    /**
     * 认证
     * */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        logger.info("认证开始");
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        UserInfoDto userInfoDto = shiroTestDao.queryUser(token.getUsername());
        if (userInfoDto==null){
            throw new UnknownAccountException("帐号不存在");
        }
        SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(userInfoDto, userInfoDto.getPassword(), ByteSource.Util.bytes(userInfoDto.getSalt()), getName());
        logger.info("认证结束");
        return info;
        //DisabledAccountException DisabledAccountException（帐号被禁用）
        //
        //LockedAccountException（帐号被锁定）
        //
        //ExcessiveAttemptsException（登录失败次数过多）
        //
        //ExpiredCredentialsException（凭证过期）等
    }
    /**
     * 凭证匹配器
     * （由于我们的密码校验交给Shiro的SimpleAuthenticationInfo进行处理了
     *  所以我们需要修改下doGetAuthenticationInfo中的代码;
     * 可以扩展凭证匹配器，实现 输入密码错误次数后锁定等功能，下一次*/
    @Override
    public void setCredentialsMatcher(CredentialsMatcher credentialsMatcher) {
        HashedCredentialsMatcher shaCredentialsMatcher = new HashedCredentialsMatcher();
        shaCredentialsMatcher.setHashAlgorithmName(ShiroUtils.hashAlgorithmName);
        shaCredentialsMatcher.setHashIterations(ShiroUtils.hashIterations);
        super.setCredentialsMatcher(shaCredentialsMatcher);
    }

}
