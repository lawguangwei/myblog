$(function(){
    var ue = UE.getEditor('container');
    $('#commit-btn').on('click',function(){
        var title = $('#title').val();
        var content = ue.getContent();
        var collection = $('#collection').val();
        var type = $(':radio[name="type"]:checked').val();
        var id = $(this).attr('blog-id');
        var userId = $(this).attr('user-id');
        if(title == ''){
            alert('请完成标题');
        }else{
            modifyBlog(title,content,collection,type,id,userId);
        }
    });
    setCollection($('#collection').attr('blog-collection'));
});


function modifyBlog(title,content,collection,type,blogId,userId){
    $.ajax({
        type:'post',
        url:'/users/'+userId+'/blog/modify',
        data:{title:title,content:content,collection:collection,type:type,blogId:blogId},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                alert('博文已保存!');
                location.href='/users/'+userId+'/blog/check/'+result['blogId'];
            }else{
                alert('博文保存失败');
            }
        }
    });
}

function createCollect(name,type){
    $.ajax({
        type:'post',
        url:'createCollect',
        data:{name:name,type:type},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                $('.option-append').remove();
                setCollection();
            }else{
                alert('创建失败');
            }
        }
    });
}

function setCollection(blogCollection){
    $.ajax({
        type:'get',
        url:'/users/:id/blog/getCollect',
        data:{},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                var collections = result['collections'];
                collections.forEach(function(collection){
                    if(collection._id == blogCollection){
                        var content = '<option class="option-append" value="'+collection._id+'" selected>'+collection.collectionName+'</option>';
                    }else{
                        var content = '<option class="option-append" value="'+collection._id+'">'+collection.collectionName+'</option>';
                    }
                    $('#collection').append(content);
                });
            }
        }
    });
}