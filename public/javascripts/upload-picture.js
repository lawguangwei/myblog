/**
 * Created by luoguangwei on 16/3/30.
 */
var progressId;
var formDatas = new Array();
var myxhr;
$(function(){
    setAlbum();
    $('#upload-picture').hide();

    $('#add-picture').on('click',function(){
       $('#upload-file').click();
    });

    $('#upload-file').on('change', function(){
        var files = $(this).prop('files');
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function(evt) {
            var imgSrc = evt.target.result;
            var timestamp = Date.parse(new Date());
            var content = '<div class="picture-item col-md-3"><img src="'+imgSrc+'"><progress id="'+timestamp+'" value="0" max="100"></progress></div>';
            $('#picture-pane').append(content);
            var formData = new FormData($('#form-img')[0]);
            formDatas.unshift([formData,timestamp]);
            $('#upload-picture').show();
        }
    });

    $('#upload-picture').on('click',function() {
        $('#add-picture').hide();
        $('#upload-picture').hide();
        uploadPicture(formDatas);
    });

    $('#album-commit').on('click',function(){
        var name = $('#input-album-name').val();
        var type = $(':radio[name="album-type"]:checked').val();
        if(name == ''){
            alert('请完成标题');
        }else{
            createAlbum(name,type);
        }
    });
});

function uploadPicture(formDatas){
    if(formDatas.length != 0){
        var formData = formDatas.pop();
        progressId = formData[1];
        $.ajax({
            url:'/users/:id/picture/upload',
            type:'post',
            xhr:function(){
                myxhr = $.ajaxSettings.xhr();
                if(myxhr.upload){
                    myxhr.upload.addEventListener('progress',progressHandlingFunction,false);
                }
                return myxhr;
            },
            data:formData[0],
            dataType:'json',
            cache:false,
            contentType:false,
            processData:false,
            error:function(){
                alert('网络错误');
            },
            success:function(result){
                if(result['code'] == '0'){
                    var content = '<span class="glyphicon glyphicon-ok"></span>'
                    $("#"+progressId).parent().append(content);
                    if(formDatas.length != 0){
                        uploadPicture(formDatas);
                    }else{
                        $('#add-picture').show();
                    }
                }
            }
        });
    }
}

function progressHandlingFunction(e){
    $("#"+progressId).attr({"value":e.loaded,"max":e.total});
}

function createAlbum(name,type){
    $.ajax({
        url:'/users/:id/picture/createAlbum',
        type:'post',
        data:{name:name,type:type},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                $('.option-append').remove();
                setAlbum();
            }else{
                alert('创建失败');
            }
        }
    });
}

function setAlbum(){
    $.ajax({
        type:'get',
        url:'/users/:id/picture/getAlbum',
        data:{},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                var albums = result['albums'];
                albums.forEach(function(album){
                    var content = '<option class="option-append" value="'+album._id+'">'+album.name+'</option>';
                    $('#album').append(content);
                });
            }
        }
    });
}