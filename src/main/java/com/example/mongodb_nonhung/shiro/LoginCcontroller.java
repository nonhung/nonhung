package com.example.mongodb_nonhung.shiro;

import com.example.mongodb_nonhung.commons.R;
import com.example.mongodb_nonhung.commons.ShiroUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class LoginCcontroller  {

    @RequestMapping(value = "/login")
    public String login(){
        return "login";
    }

    @RequestMapping(value = "/index")
    public String index(){
        return "index";
    }
    @GetMapping({"/", ""})
    public String welcome() {
        return "redirect:/login";
    }


    @GetMapping("/logout")
    public String logout() {
        return "redirect:/login";
    }

    @RequestMapping("/validateLogin")
    @ResponseBody
    public R validateLogin(String username, String password) {
        try {
            Subject subject = ShiroUtils.getSubject();
            UsernamePasswordToken token = new UsernamePasswordToken(username, password);
            subject.login(token);
        } catch (UnknownAccountException e) {
            return R.error(e.getMessage());
        } catch (IncorrectCredentialsException e) {
            return R.error("帐号或密码不正确");
        } catch (LockedAccountException e) {
            return R.error("帐号已被锁定,请联系管理员");
        } catch (AuthenticationException e) {
            return R.error("帐户验证失败");
        }
        return R.ok();
    }

}
