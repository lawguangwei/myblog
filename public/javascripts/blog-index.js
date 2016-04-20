$(function(){
    setCollection();
    getBlogs('all',1);
    setPages('all');
});

function setCollection(){
    var userId = $('#blog-list').attr('owner-id');
    $.ajax({
        type:'post',
        url:'/users/'+userId+'/blog/getCollect',
        data:{'userId':userId},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                var collections = result['collections'];
                collections.forEach(function(collection){
                    var content = '<li><a coll="'+collection._id+'" class="a-collection">'+collection.collectionName+'</a></li>';
                    $('#catalog ul').append(content);
                });
                cdCollection();
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

function getBlogs(collection,page){
    var userId = $('#blog-list').attr('owner-id');
    $.ajax({
        type:'post',
        url:'/users/'+userId+'/blog/getBlogList',
        data:{'userId':userId,'collection':collection,'page':page},
        dataType:'json',
        success: function (result) {
            if(result['code'] == '0'){
                $('.tr-blog').remove();
                var blogs = result['blogs'];
                blogs.forEach(function(blog){
                    if(result['isMe']){
                        var date = new Date(blog.createDate);
                        var content = '<tr class="tr-blog">' +
                            '<td><a href="/users/'+userId+'/blog/check/'+blog._id+'">'+blog.title+'</a></td>' +
                            '<td>'+date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'</td>' +
                            '<td><a blog-id="'+blog._id+'" class="a-delete-blog">删除</a></td>' +
                            '</tr>';
                    }else{
                        var date = new Date(blog.createDate);
                        var content = '<tr class="tr-blog">' +
                            '<td><a href="/users/'+userId+'/blog/check/'+blog._id+'">'+blog.title+'</a></td>' +
                            '<td>'+date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'</td>' +
                            '</tr>';
                    }
                    $('table').append(content);
                });
                deleteBlog();
            }
        }
    });
}

function setPages(collection){
    var userId = $('#blog-list').attr('owner-id');
    $.ajax({
        type:'post',
        url:'/users/'+userId+'/blog/getBlogPages',
        data:{'userId':userId,'coll':collection},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                var pages = result['pages'];
                for(var i = 1;i<=pages;i++){
                    if(i == 1){
                        var item = '<li class="active" page="'+i+'"><a coll="'+collection+'">'+i+'</a></li>';
                    }else{
                        var item = '<li page="'+i+'"><a coll="'+collection+'">'+i+'</a></li>';
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
        var coll = $(this).attr('coll')
        $('#ul-pagination li').removeClass('active');
        getBlogs(coll,page);
        $(this).parent().addClass('active');
    });
}

function cdCollection(){
    $('.a-collection').on('click',function(){
        var collName = $(this).text();
        var collId = $(this).attr('coll');
        $('#coll-title').text(collName);
        getBlogs(collId,1);
    });
}