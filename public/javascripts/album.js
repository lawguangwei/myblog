/**
 * Created by luoguangwei on 16/4/1.
 */
var next;
var last;
$(function(){
    new WOW().init();
    getPictures(1);
    setPages();
});

function getImageDetail(){
    $('.a-img').off('click');
    $('#next-picture').off('click');
    $('#last-picture').off('click');

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
}

function checkImg(item){
    var src = item.find('img').attr('src');
    $('#img-show').attr('src',src);
    next = item.next();
    last = item.prev();
    if(!next.get(0)){
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

function setFace(){
    $('.a-face').off('click');
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
}

function deleteAlbum(){
    $('.a-delete').off('click');
    $('.a-delete').on('click',function(){
        var pictureId = $(this).attr('pictureId');
        var item = $(this).parent();
        $.ajax({
            type:'post',
            url:'/users/:id/picture/deletePicture',
            data:{'pictureId':pictureId},
            dataType:'json',
            success:function(result){
                if(result['code'] == '0'){
                    item.remove();
                }
            }
        });
    });
}

function getPictures(page){
    var userId = $('#picture-pane').attr('owner-id');
    var albumId = $('#picture-pane').attr('album-id');
    $.ajax({
        type:'post',
        url:'/users/'+userId+'/picture/getAlbumPictures',
        data:{'userId':userId,'albumId':albumId,'page':page},
        dataType:'json',
        success: function (result) {
            if(result['code'] == '0'){
                $('.a-img').parent().remove();
                var pictures = result['pictures'];
                pictures.forEach(function(picture){
                    var paths = picture.path.split('/');
                    if(result['isMe']){
                        var content = '<div class="col-md-3">' +
                            '<a data-toggle="modal" data-target="#show-picture" class="a-img">' +
                            '<img src="/userImage/'+paths[paths.length-2]+'/'+paths[paths.length-1]+'" class="col-md-12">' +
                            '</a>' +
                            '<a album="'+picture.album+'" class="a-face">设为封面</a>' +
                            '<a pictureId="'+picture._id+'" class="text-danger a-delete">删除</a>' +
                            '</div>';
                    }else{
                        var content = '<div class="col-md-3">' +
                            '<a data-toggle="modal" data-target="#show-picture" class="a-img">' +
                            '<img src="/userImage/'+paths[paths.length-2]+'/'+paths[paths.length-1]+'" class="col-md-12">' +
                            '</a>' +
                            '</div>';
                    }
                    $('#picture-pane').append(content);
                });
                getImageDetail();
                setFace();
                deleteAlbum();
            }
        }
    });
}

function setPages(){
    var userId = $('#picture-pane').attr('owner-id')
    var albumId = $('#picture-pane').attr('album-id');
    $.ajax({
        type:'post',
        url:'/users/'+userId+'/picture/getPicturePages',
        data:{'albumId':albumId},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                var pages = result['pages'];
                for(var i = 1;i<=pages;i++){
                    if(i == 1){
                        var item = '<li class="active" page="'+i+'"><a>'+i+'</a></li>';
                    }else{
                        var item = '<li page="'+i+'"><a>'+i+'</a></li>';
                    }
                    $('#ul-pagination').append(item);
                }
                cdPage();
            }
        }
    });
}

function cdPage(){
    $('#ul-pagination a').off('click');
    $('#ul-pagination a').on('click',function(){
        var page = $(this).text();
        $('#ul-pagination li').removeClass('active');
        getPictures(page);
        $(this).parent().addClass('active');
    });
}
