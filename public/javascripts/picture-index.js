$(function(){
    new WOW().init();
    var userId = $('#picture-pane').attr('owner-id');
    getAlbums(userId,1);
    setPages();
    $('#commit').on('click',function(){
        var albumId = $('#input-album-id').val();
        var albumName = $('#input-album-name').val();
        var albumType =  $(':radio[name="album-type"]:checked').val();
        $.ajax({
            type:'post',
            url:'/users/:id/picture/configAlbum',
            data:{'albumId':albumId,'albumName':albumName,'albumType':albumType},
            dataType:'json',
            success:function(result){
                if(result['code']=='0'){
                    location.reload();
                }
            }
        });
    });

    $('.remove-album').on('click',function(){
        var albumId = $(this).attr('album-id');
        var item = $(this).parent().parent();
        $.ajax({
            type:'post',
            url:'/users/:id/picture/removeAlbum',
            data:{'albumId':albumId},
            dataType:'json',
            success:function(result){
                if(result['code'] == '0'){
                    item.remove();
                }
            }
        });
    });
});

function setAlbumInfo(){
    $('.album-config').off('click');
    $('.album-config').on('click',function(){
        var albumId = $(this).attr('album-id');
        var albumName = $(this).attr('album-name');
        var albumType = $(this).attr('album-type');
        $('#input-album-name').val(albumName);
        $('#input-album-id').val(albumId);
        if(albumType=='public'){
            $('#type-public').get(0).checked = true;
        }
        if(albumType=='private'){
            $('#type-private').get(0).checked = true;
        }
    });
}

function removeAlbums(){
    $('.remove-album').off('click');
    $('.remove-album').on('click',function(){
        var albumId = $(this).attr('album-id');
        var item = $(this).parent().parent();
        $.ajax({
            type:'post',
            url:'/users/:id/picture/removeAlbum',
            data:{'albumId':albumId},
            dataType:'json',
            success:function(result){
                if(result['code'] == '0'){
                    item.remove();
                }
            }
        });
    });
}


function getAlbums(userId,page){
    $.ajax({
        type:'post',
        url:'/users/'+userId+'/picture/getAlbums',
        data:{userId:userId,page:page},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                $('.picture-item').parent().remove();
                var albums = result['albums'];
                albums.forEach(function(album){
                    var date = new Date(album.createDate);
                    if(result['isMe']){
                        var content = '<div class="col-md-3">' +
                            '<div class="col-md-12 picture-item">' +
                            '<a href="picture/checkAlbum/'+album._id+'">' +
                            '<img src="'+album.face+'" class="col-md-12">' +
                            '</a>' +
                            '<table class="table table-striped">' +
                            '<tr>' +
                            '<td>相册名</td>' +
                            '<td>'+album.name+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>创建时间</td>' +
                            '<td>'+date.toLocaleDateString()+'</td>' +
                            '</tr>' +
                            '</table>' +
                            '<a album-id="'+album._id+'" data-toggle="modal" data-target="#config-album"' +
                                'album-name="'+album.name+'" album-type="'+album.type+'" class="album-config">' +
                            '<span class="glyphicon glyphicon-cog">&nbsp;</span>' +
                            '</a>' +
                            '<a album-id="'+album._id+'" class="remove-album">' +
                            '<span class="glyphicon glyphicon-remove"></span>' +
                            '</a>' +
                            '</div>' +
                            '</div>';
                    }else{
                        var content = '<div class="col-md-3">' +
                            '<div class="col-md-12 picture-item">' +
                            '<a href="picture/checkAlbum/'+album._id+'">' +
                            '<img src="'+album.face+'" class="col-md-12">' +
                            '</a>' +
                            '<table class="table table-striped">' +
                            '<tr>' +
                            '<td>相册名</td>' +
                            '<td>'+album.name+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>创建时间</td>' +
                            '<td>'+date.toLocaleDateString()+'</td>' +
                            '</tr>' +
                            '</table>' +
                            '</div>' +
                            '</div>';
                    }
                    $('#picture-pane').append(content);
                });
                setAlbumInfo();
                removeAlbums();
            }
        }
    });
}

function setPages(){
    var userId = $('#picture-pane').attr('owner-id');
    $.ajax({
        type:'post',
        url:'/users/'+userId+'/picture/getAlbumPages',
        data:{'userId':userId},
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
    var userId = $('#picture-pane').attr('owner-id');
    $('#ul-pagination a').off('click');
    $('#ul-pagination a').on('click',function(){
        var page = $(this).text();
        $('#ul-pagination li').removeClass('active');
        getAlbums(userId,page);
        $(this).parent().addClass('active');
    });
}