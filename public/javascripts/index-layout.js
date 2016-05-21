$(function(){
    $('#btn-login').on('click',function(){
        var email = $('#login-email').val();
        var password = $('#login-password').val();

        if(!email){
            alert('请输入账户.');
        }else{
            $.ajax({
                url:'/users/loginAjax',
                type:'post',
                data:{'email':email,'password':password},
                dataType:'json',
                success:function(result){
                    if(result['code'] == '0'){
                        location.reload();
                    }else if(result['code'] == '1'){
                        alert('密码错误');
                    }else{
                        alert('账号不存在');
                    }
                }
            });
        }
    })
})