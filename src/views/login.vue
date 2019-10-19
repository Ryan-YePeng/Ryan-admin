<template>
  <div class="login" v-title data-title="登录-admin-master">
    <div id="flex-container" :style="{height: screenHeight+'px'}">
      <section class="container">
        <el-form ref="loginForm" :model="loginUser" :rules="rules" label-position="left" label-width="0px"
                 class="login-form">
          <h3 class="title">叶落回忆后台管理系统</h3>
          <el-form-item prop="username">
            <el-input v-model="loginUser.username" type="text" auto-complete="off" placeholder="账号">
              <i slot="prefix" class="el-icon-user-solid"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginUser.password" type="password" auto-complete="off" placeholder="密码"
                      @keyup.enter.native="submitForm('loginForm')">
              <svg-icon slot="prefix" icon-class="password"></svg-icon>
            </el-input>
          </el-form-item>
          <el-checkbox style="margin:0 0 25px 0;position: relative;right: 117px" v-model="rememberMe">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                       @click.native.prevent="submitForm('loginForm')">
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>
          <div class="forgetPassword" @click="sendEmail">忘记密码?</div>
        </el-form>
      </section>
      <div class="canvaszz" :style="{height: screenHeight+'px'}"></div>
      <canvas id="canvas" :style="{height: screenHeight+'px'}"></canvas>
    </div>
  </div>
</template>

<script>
  import {login, visitApi, forgetPasswordApi} from '../api/login'
  import {getRouter} from "../router";
  import {MessageBox} from 'element-ui'

  export default {
    name: "Login",
    data() {
      return {
        loading: false,
        screenHeight: window.innerHeight, // 屏幕高度
        rememberMe: false,
        loginUser: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            {
              required: true,
              message: '用户名不能为空',
              trigger: 'blur'
            },
          ],
          password: [
            {
              required: true,
              message: '密码不能为空',
              trigger: 'blur'
            },
          ],
        }
      }
    },
    watch: {
      'screenHeight': function (val) { // 监听屏幕高度变化
        var oIframe = document.getElementById('flex-container');
        oIframe.style.height = Number(val) + 'px' // '120'是页面布局调整，可去除
      },
      rememberMe(val) {
        if (val) this.$setLocalStorage('rememberMe', [this.compileStr(this.loginUser.username), this.compileStr(this.loginUser.password)]);
        else this.$removeLocalStorage('rememberMe')
      },
      'loginUser.username'() {
        if (this.rememberMe) this.$setLocalStorage('rememberMe', [this.compileStr(this.loginUser.username), this.compileStr(this.loginUser.password)])
      },
      'loginUser.password'() {
        if (this.rememberMe) this.$setLocalStorage('rememberMe', [this.compileStr(this.loginUser.username), this.compileStr(this.loginUser.password)])
      },
    },
    created() {
      let rememberMe = this.$getLocalStorage('rememberMe') || null;
      if (rememberMe && rememberMe[0] !== '%00' && rememberMe[1] !== '%00') {
        this.loginUser.username = this.uncompileStr(rememberMe[0]);
        this.loginUser.password = this.uncompileStr(rememberMe[1]);
        this.rememberMe = true
      }
    },
    mounted() {
      var _this = this;
      window.onresize = function () { // 定义窗口大小变更通知事件
        _this.screenHeight = document.documentElement.clientHeight // 窗口高度
      };
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      var w = canvas.width = window.innerWidth;
      var h = canvas.height = window.innerHeight;
      var hue = 217;
      var stars = [];
      var count = 0;
      var maxStars = 1668; // 星星数量
      var canvas2 = document.createElement('canvas');
      var ctx2 = canvas2.getContext('2d');
      canvas2.width = 100;
      canvas2.height = 100;
      var half = canvas2.width / 2;
      var gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
      gradient2.addColorStop(0.025, '#CCC');
      gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
      gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
      gradient2.addColorStop(1, 'transparent');
      ctx2.fillStyle = gradient2;
      ctx2.beginPath();
      ctx2.arc(half, half, half, 0, Math.PI * 2);
      ctx2.fill();

      function random(min, max) {
        if (arguments.length < 2) {
          max = min;
          min = 0
        }
        if (min > max) {
          var hold = max;
          max = min;
          min = hold
        }
        return Math.floor(Math.random() * (max - min + 1)) + min
      }

      function maxOrbit(x, y) {
        var max = Math.max(x, y);
        var diameter = Math.round(Math.sqrt(max * max + max * max));
        return diameter / 2
        // 星星移动范围，值越大范围越小，
      }

      var Star = function () {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(60, this.orbitRadius) / 8;
        // 星星大小
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / 400000;
        // 星星移动速度
        this.alpha = random(2, 10) / 10;
        count++;
        stars[count] = this
      };
      Star.prototype.draw = function () {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        var y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
        var twinkle = random(10);
        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05
        }
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed
      };
      for (var i = 0; i < maxStars; i++) {
        new Star()
      }

      function animation() {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.5; // 尾巴
        ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = 'lighter';
        for (var i = 1, l = stars.length; i < l; i++) {
          stars[i].draw()
        }
        window.requestAnimationFrame(animation)
      }

      animation()
    },
    methods: {
      compileStr(code) {
        var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (var i = 1; i < code.length; i++) {
          c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        }
        return escape(c);
      },
      uncompileStr(code) {
        code = unescape(code);
        var c = String.fromCharCode(code.charCodeAt(0) - code.length);
        for (var i = 1; i < code.length; i++) {
          c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
        }
        return c;
      },
      sendEmail() {
        MessageBox.prompt('请输入用户名:', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({value}) => {
          forgetPasswordApi({account: value}).then(result => {
            console.log(result)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            const data = {};
            data.username = this.loginUser.username;
            data.password = this.loginUser.password;
            login(data)
              .then(result => {
                const {token} = result.data;
                const {user} = result.data;
                this.$store.dispatch('setUser', user);
                this.$store.dispatch('setToken', `Bearer ${token}`);
                visitApi();
                // 动态拉取路由和菜单
                return getRouter();
              })
              .then(() => {
                this.loading = false;
                this.$router.push({name: 'home'});
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            this.$message.error('请正确输入信息！');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-checkbox {
    color: white !important;
  }

  .forgetPassword {
    font-size: 14px;
    text-align: right;
    color: #3a8ee6;
    cursor: pointer;
  }

  .forgetPassword:hover {
    text-decoration: underline;
  }

  .login {
    user-select: none;
    .container {
      position: absolute;
      border-radius: 10px;
      top: 20%;
      left: 33%;
      padding: 25px;
      border: 5px;
      text-align: center;
      z-index: 99;
      background: rgba(0, 0, 0, .2);
      color: #fff;
    }
    .title {
      margin: 0 auto 30px auto;
      text-align: center;
      font-size: 20px;
      font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
      font-weight: bold;
    }
    .login-form {
      width: 300px;
      padding: 25px 25px 5px 25px;
      position: relative;
      .el-input {
        height: 38px;
        input {
          height: 38px;
        }
      }
      .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
      }
    }
    canvas {
      width: 100%;
      height: auto; /*默认全屏显示 可自己设置高度640px*/
      display: inline-block;
      vertical-align: baseline;
      position: absolute;
      z-index: -1;
    }
    .canvaszz {
      width: 100%;
      height: 100%;
      background: url("../assets/bg.jpg") no-repeat center bottom fixed;
      background-size: cover;
      text-align: center;
      font-family: 'Montserrat', sans-serif;
      position: absolute;
      filter: alpha(opacity=60);
      -moz-opacity: 0.6;
      -khtml-opacity: 0.6;
      opacity: 0.6;
    }
  }
</style>
