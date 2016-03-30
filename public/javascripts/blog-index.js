$(function(){
    setCollection();
    deleteBlog();
});

function setCollection(){
    $.ajax({
        type:'get',
        url:'/users/:id/blog/getCollect',
        data:{},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                var collections = result['collections'];
                collections.forEach(function(collection){
                    var content = '<li><a>'+collection.collectionName+'</a></li>';
                    $('#catalog ul').append(content);
                });
            }
        }
    });
}

function deleteBlog(){
    $('.a-delete-blog').on('click',function(){
        var blogId = $(this).attr('blog-id');
        var item = $(this).parent().parent();
        $.ajax({
            type:'post',
            url:'/users/:id/blog/deleteBlog',
            data:{'blogId':blogId},
            dataType:'json',
            success:function(result){
                if(result['code'] == '0'){
                    item.remove();
                }else{
                    alert('删除失败');
                    console.log(result);
                }
            }
        });
    });
}