/**
 * Created by luoguangwei on 16/3/19.
 */
$(function(){
    setImg();
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
            $('#old-img').attr('src',result['img']);
        },
    });
}

function progressHandlingFunction(){

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