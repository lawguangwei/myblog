$(function(){
    var ue = UE.getEditor('container');
    setCollection();
    $('#commit-btn').on('click',function(){
        var userId = $(this).attr('user-id');
        var title = $('#title').val();
        var content = ue.getContent();
        var collection = $('#collection').val();
        var type = $(':radio[name="type"]:checked').val();

        if(title == ''){
            alert('请完成标题');
        }else{
            writeBlog(title,content,collection,type,userId);
        }
    });

    $('#collect-commit').on('click',function(){
        var name = $('#input-collect-name').val();
        var type = $(':radio[name="collect-type"]:checked').val();
        if(name == ''){
            alert('请完成标题');
        }else{
            createCollect(name,type);
        }
    });
})

function writeBlog(title,content,collection,type,userId){
    $.ajax({
        type:'post',
        url:'write',
        data:{title:title,content:content,collection:collection,type:type},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                alert('博文已保存!');
                location.href = '/users/'+userId+'/blog';
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

function setCollection(){
    var userId = $('#write-pane').attr('user-id');
    $.ajax({
        type:'post',
        url:'getCollect',
        data:{'userId':userId},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                var collections = result['collections'];
                collections.forEach(function(collection){
                    var content = '<option class="option-append" value="'+collection._id+'">'+collection.collectionName+'</option>';
                    $('#collection').append(content);
                });
            }
        }
    });
}