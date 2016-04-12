/**
 * Created by luoguangwei on 16/4/1.
 */
var next;
var last;
$(function(){
    $('.a-img').on('click',function(){
        var item = $(this).parent();
        checkImg(item);
    });

    $('#next-picture').on('click', function(){
        checkImg(next);
    });
    $('#last-picture').on('click', function(){
        checkImg(last);
    });

    $('.a-face').on('click',function(){
        var faceSrc = $(this).parent().find('img').attr('src');
        var albumId = $(this).attr('album');
        $.ajax({
            type:'post',
            url:'/users/:id/picture/setAlbumFace',
            data:{'src':faceSrc,'albumId':albumId},
            dataType:'json',
            success:function(result){
                if(result['code'] == '0'){
                    alert('设置成功');
                }
            }
        });
    });
});

function checkImg(item){
    var src = item.find('img').attr('src');
    $('#img-show').attr('src',src);
    next = item.next();
    last = item.prev();

    console.log(next.get(0).tagName);
    if(next.get(0).tagName != 'DIV'){
        $('#next-picture').hide();
    }else{
        $('#next-picture').show();
    }

    if(last.get(0).tagName != 'DIV'){
        $('#last-picture').hide();
    }else{
        $('#last-picture').show();
    }
}