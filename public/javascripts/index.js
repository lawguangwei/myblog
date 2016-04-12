/**
 * Created by luoguangwei on 16/3/19.
 */
var pictures;
var pictureIndex = 0;
$(function(){
    $('.photo-album').height($('.photo-album').width());
    $('.img-album').width($('.photo-album').width()*0.95);
    $('.img-album').height($('.photo-album').height()*0.95);
    getBlog();
    getIndexPictures();
    $('#next-img').on('click',function(){
        pictureIndex++;
        if(pictureIndex>=pictures.length){
            pictureIndex = 0;
        }
        var paths = pictures[pictureIndex].path.split('/');
        $('#img-show').attr('src','/userImage/'+paths[paths.length-2]+'/'+paths[paths.length-1]);
    });
    $('#last-img').on('click',function(){
        pictureIndex--;
        if(pictureIndex<=0){
            pictureIndex = pictures.length-1;
        }
        var paths = pictures[pictureIndex].path.split('/');
        $('#img-show').attr('src','/userImage/'+paths[paths.length-2]+'/'+paths[paths.length-1]);
    });
});

function getBlog(){
    var ownerId = $('#person-pane').attr('owner-id');
    $.ajax({
        type:'post',
        url:'/users/'+ownerId+'/blog/getUserBlog',
        data:{'ownerId':ownerId},
        dataType:'json',
        success:function(result){
            var blogs = result['blogs'];
            blogs.forEach(function(blog){
                var date = new Date(blog.createDate);
                var content = '<div class="col-md-12">' +
                    '<h2 class="text-info">'+blog.title+'</h2>' +
                    '<div class="li-line"></div>' +
                    '<p>创建时间&nbsp;&nbsp;'+date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+
                    '&nbsp;&nbsp;<span class="blog-item">&nbsp;&nbsp;阅读量:<span class="text-danger">11</span></span></p>' +
                    '<div class="blog-content">'+blog.content+'</div>' +
                    '<a href="/users/'+ownerId+'/blog/check/'+blog._id+'">'+'阅读全文</a>' +
                    '</div>';
                $('#blog-pane').append(content);
            });
        }
    });
}

function getIndexPictures(){
    var ownerId = $('#person-pane').attr('owner-id');
    $.ajax({
        type:'post',
        url:'/users/'+ownerId+'/picture/getIndexPictures',
        data:{'ownerId':ownerId},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                pictures = result['pictures'];
                var paths = pictures[pictureIndex].path.split('/');
                $('#img-show').attr('src','/userImage/'+paths[paths.length-2]+'/'+paths[paths.length-1]);
            }
        }
    });
}