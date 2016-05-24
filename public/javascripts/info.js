/**
 * Created by luoguangwei on 16/3/19.
 */
$(function(){
    new WOW().init();
    setImg();
    $('#btn-set-base').on('click',function(){
        var name;
        if($('#user-name').val()){
            name = $('#user-name').val();
        }
        var gender = $(':radio[name="gender"]:checked').val();
        var birthday = $('#birthday').val();
        var marriage = $('#marriage').val();

        setBaseInfo(name,gender,birthday,marriage);
    });

    $('#btn-set-experience').on('click',function(){
        var college = $('#college').val();
        var high = $('#high-school').val();
        var middle = $('#middle-school').val();
        var company = $('#company').val();
        setExperience(college,high,middle,company);
    });

    $('#btn-set-info').on('click',function(){
        var info = $('#text-person-info').val();
        setPersonInfo(info);
    });

    $('#btn-set-url').on('click',function(){
        var url = $('#text-url').val();
        checkPersonUrl(url);
    })
})


function uploadImg(data){
    $.ajax({
        url:'/users/setimg',
        type:'post',
        data:{'img':data},
        dataType:'json',
        error:function(){
            alert('网络错误');
        },
        success:function(result){
            if(result['code'] == '0'){
                $('#old-img').attr('src',result['img']);
            }
        },
    });
}

function setImg(){
    var options =
    {
        thumbBox: '.thumbBox',
        imgSrc: '../images/person-img.png'
    }
    var cropper = $('.imageBox').cropbox(options);
    var img="";
    $('#upload-file').on('change', function(){
        var reader = new FileReader();
        reader.onload = function(e) {
            options.imgSrc = e.target.result;
            cropper = $('.imageBox').cropbox(options);
        }
        reader.readAsDataURL(this.files[0]);
        this.files = [];
        //$('#btnCrop').click();
    })
    $('#btnCrop').on('click', function(){
        img = cropper.getDataURL();
        $('.cropped').html('');
        $('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:64px;margin-top:4px;border-radius:64px;box-shadow:0px 0px 12px #7E7E7E;" ><p>64px*64px</p>');
        $('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:128px;margin-top:4px;border-radius:128px;box-shadow:0px 0px 12px #7E7E7E;"><p>128px*128px</p>');
        $('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:180px;margin-top:4px;border-radius:180px;box-shadow:0px 0px 12px #7E7E7E;"><p>180px*180px</p>');
    })
    $('#btnZoomIn').on('click', function(){
        cropper.zoomIn();
    })
    $('#btnZoomOut').on('click', function(){
        cropper.zoomOut();
    })
    $('#upload-btn').on('click',function(){
        if(!img){
            alert('请选择图像');
        }else{
            uploadImg(img);
        }
    });
}

function setBaseInfo(name,gender,birthday,marriage){
    $.ajax({
        url:'/users/setBaseInfo',
        type:'post',
        data:{name:name,gender:gender,birthday:birthday,marriage:marriage},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                alert('基本信息修改成功!');
                location.reload();
            }else{
                alert('修改失败!');
            }
        }
    });
}


function setExperience(college,high,middle,company){
    $.ajax({
        url:'/users/setExperience',
        type:'post',
        data:{college:college,high:high,middle:middle,company:company},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                alert('记录修改成功!');
                location.reload();
            }else{
                alert('修改失败!');
            }
        }
    });
}


function setPersonInfo(info){
    $.ajax({
        url:'/users/setPersonInfo',
        type:'post',
        data:{info:info},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                alert('个人信息修改成功!');
                location.reload();
            }else{
                alert('修改失败!');
            }
        }
    });
}

function setPersonUrl(url){
    $.ajax({
        url:'/users/setPersonUrl',
        type:'post',
        data:{personUrl:url},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                alert('个人信息修改成功!');
                location.reload();
            }else{
                alert('修改失败!');
            }
        }
    })
}
function checkPersonUrl(url){
    $.ajax({
        url:'/users/checkPersonUrl',
        type:'post',
        data:{personUrl:url},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                setPersonUrl(url);
            }else{
                if(result['code'] == '2'){
                    alert('地址已占用!');
                }
                if(result['code'] == '1'){
                    alert('修改失败!');
                }
            }
        }
    })
}
/*
 function uploadImg(data){
 var myxhr;
 $.ajax({
 url:'/users/setimg',
 type:'post',
 xhr:function(){
 myxhr = $.ajaxSettings.xhr();
 if(myxhr.upload){
 myxhr.upload.addEventListener('progress',progressHandlingFunction,false);
 }
 return myxhr;
 },
 data:data,
 dataType:'json',
 error:function(){
 alert('网络错误');
 },
 success:function(result){
 alert(result['msg']);
 },
 cache:false,
 contentType:false,
 processData:false
 });
 }s
 */